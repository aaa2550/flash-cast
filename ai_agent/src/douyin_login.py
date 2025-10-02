import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
import logging

logging.basicConfig(level=logging.ERROR)

# 只保留异步 Playwright（同步的删除，避免混用）
from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright, Cookie, Browser

from models.douyin_task_models import PublishTask, DouyinStatus, DouyinUserInfo

logger = logging.getLogger(__name__)


class Douyin:
    user_cookies: dict[int, DouyinUserInfo] = {}  # 去掉 str 注解，cookies 是列表类型
    user_publish_status: dict[int, PublishTask] = {}
    browser: Browser = None
    def __init__(self):
        pass

    async def start_playwright(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)

    async def _cleanup_old_tasks(self):
        """清理旧任务"""
        while True:
            try:
                cutoff_time = datetime.now() - timedelta(hours=24)
                old_task_ids = [
                    user_id for user_id, task in self.user_publish_status.items()
                    if task.created_at < cutoff_time
                ]

                for user_id in old_task_ids:
                    del self.user_publish_status[user_id]

            except Exception as e:
                logger.error(f"Error cleaning up tasks: {str(e)}")

            # 每小时清理一次
            await asyncio.sleep(3600)

    async def get_image_base64(self, user_id: int):
        try:
            # 1. 异步启动 Playwright（全异步流程）
            context = await self.browser.new_context()
            page = await context.new_page()

            # 2. 跳转页面并获取二维码 URL
            await page.goto("https://creator.douyin.com/", wait_until="domcontentloaded")
            # 注意：异步 Playwright 获取属性需要 await！
            image_base64 = await page.get_by_role("img", name="二维码").get_attribute("src")
            self.user_cookies[user_id] = DouyinUserInfo(image_base64=image_base64)
            # 3. 启动后台异步任务（wait_for_url），不阻塞当前函数返回
            # 用实例属性保存任务，避免任务被垃圾回收
            self.wait_task = asyncio.create_task(self.wait_for_url(context, self.browser, page, user_id))

            # 4. 立即返回 URL（核心需求：不等待 wait_for_url，直接返回）
            return image_base64
        except Exception:
            logging.exception("get_image_base64 error")
            raise

    async def publish(self, user_id: int, task_id: int, path: str) -> bool:
        try:
            self.user_publish_status[task_id] = PublishTask(user_id)
            """同步发布逻辑（保持不变，注意：需确保 cookies 已获取后再调用）"""
            cookies = self.user_cookies[user_id]
            if not cookies:
                print("❌ 未获取到 cookies，发布失败")
                return False
            context = await self.browser.new_context()
            # 关键：添加之前获取的 cookies，实现自动登录
            await context.cookies(cookies.cookies)
            page = await context.new_page()
            await page.goto("https://creator.douyin.com/creator-micro/home")

            # 后续发布操作（保持不变）
            await page.locator(".icon-video-i1-jYMVDL").click()
            await page.get_by_role("button", name="上传视频").click()
            await page.get_by_role("button", name="上传视频").set_input_files("fc-test.mp4")
            await page.goto("https://creator.douyin.com/creator-micro/content/post/video?enter_from=publish_page")
            await page.get_by_role("textbox", name="填写作品标题，为作品获得更多流量").fill("你好标题")
            await page.locator(".zone-container").fill("内容")
            await page.get_by_role("button", name="完成").click()

            await context.close()
            self.user_publish_status[task_id].status = DouyinStatus.SUCCESS
            return True
        except Exception:
            self.user_publish_status[task_id].status = DouyinStatus.FAILED

    def get_status(self, task_id: int) -> DouyinStatus:
        return self.user_publish_status[task_id].status

    async def wait_for_url(self, context, browser, page, user_id: int):
        """后台异步执行：等待扫码跳转，完成后打印 cookies"""
        try:
            print("✅ 后台任务已启动，等待扫码登录...")
            # 等待页面跳转到目标 URL（超时 60 秒）
            await page.wait_for_url(
                "https://creator.douyin.com/creator-micro/home",
                timeout=60000
            )
            nickname = page.locator(
                "//*[@id=\"garfish_app_for_douyin_creator_pc_home_emu0xley\"]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]").text_content()
            douyin_id = page.locator(
                "//*[@id=\"garfish_app_for_douyin_creator_pc_home_emu0xley\"]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div[3]/text()[2]").text_content()
            # 扫码成功，获取 cookies（异步方法需 await）
            cookies = await self.set_cookies(context, douyin_id, nickname, user_id)
            # 完成后打印 cookies（满足你的需求）
            print(f"\n✅ 扫码完成！获取到 cookies: {cookies[:50]}...")  # 打印前50字符避免过长
        finally:
            # 可选：如果不需要复用浏览器，扫码完成后可关闭资源（不影响主逻辑）
            await context.close()

    def get_cookies(self, user_id) -> Optional[DouyinUserInfo]:
        return self.user_cookies.get(user_id)

    async def set_cookies(self, context, douyin_id, nickname, user_id):
        cookies: List[Cookie] = await context.cookies()
        douyin_user_info = self.user_cookies[user_id]
        douyin_user_info.id = douyin_id
        douyin_user_info.nickname = nickname
        douyin_user_info.cookies = cookies
        douyin_user_info.status = DouyinStatus.SUCCESS
        douyin_user_info.time = int(datetime.now().timestamp() * 1000)
        return cookies


douyin_helper = Douyin()


async def main():
    user_id = 1
    task_id = 1
    douyin = Douyin()
    # 1. 调用 get_cookie，立即获取 URL（不等待 wait_for_url）
    # 这里直接 await get_cookie，因为它本身执行很快（跳转页面+获取二维码），核心是内部的 wait_for_url 后台跑
    url = await douyin.get_image_base64(user_id, task_id)
    # 2. 立即打印 URL（满足“立即返回”的需求）
    print(f"✅ 已获取二维码 URL: {url}")

    # 3. 主逻辑继续执行（不阻塞，这里用 asyncio.sleep 模拟后续操作，不会卡住事件循环）
    print("\n✅ 主逻辑继续执行，不等待扫码...")
    for i in range(30):  # 模拟主逻辑运行 30 秒
        print(f"主逻辑运行中... {i + 1} 秒", end="\r")
        await asyncio.sleep(1)  # 异步睡眠，不阻塞后台任务

    # 4. 主逻辑结束后，可选择等待后台任务完成（可选，不影响之前的打印）
    # 如果你想等扫码完成后再调用 publish，就加这行；不想等就删掉
    await douyin.wait_task

    # 5. 调用发布（需确保 cookies 已获取）
    await douyin.publish(user_id, task_id)


# 启动事件循环（唯一入口）
if __name__ == "__main__":
    asyncio.run(main())
