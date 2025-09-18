# Flash Cast 后端服务

Flash Cast 是一个现代化的短视频分享平台后端服务，基于 Spring Boot 3.2.0 构建，采用 Java 17 开发。

## 技术栈

### 核心框架
- **Spring Boot 3.2.0** - 主框架
- **Java 17** - 开发语言
- **Maven** - 项目管理工具

### 数据库相关
- **MySQL 8.0.33** - 主数据库
- **MyBatis Plus 3.5.5** - ORM框架
- **Druid 1.2.20** - 数据库连接池
- **Redis** - 缓存和会话存储

### 安全认证
- **JWT (Auth0) 4.4.0** - 无状态认证
- **Spring Security** - 安全框架
- **BCrypt** - 密码加密

### 第三方服务
- **阿里云短信服务** - 验证码发送
- **阿里云OSS** - 文件存储
- **HuTool 5.8.22** - 工具库

### 文档和监控
- **Swagger/OpenAPI 3** - API文档
- **Spring Boot Actuator** - 应用监控

## 项目结构

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── flashcast/
│   │   │           ├── FlashCastApplication.java      # 主启动类
│   │   │           ├── auth/                          # 认证模块
│   │   │           │   ├── controller/               # 认证控制器
│   │   │           │   ├── dto/                      # 数据传输对象
│   │   │           │   ├── entity/                   # 实体类
│   │   │           │   ├── mapper/                   # 数据访问层
│   │   │           │   ├── service/                  # 业务逻辑层
│   │   │           │   ├── interceptor/              # JWT拦截器
│   │   │           │   └── util/                     # JWT工具类
│   │   │           ├── sms/                          # 短信服务模块
│   │   │           │   └── service/                  # 短信服务
│   │   │           ├── common/                       # 公共模块
│   │   │           │   ├── response/                 # 统一响应格式
│   │   │           │   └── exception/                # 异常处理
│   │   │           └── config/                       # 配置类
│   │   └── resources/
│   │       ├── application.yml                       # 应用配置
│   │       └── sql/
│   │           └── init.sql                          # 数据库初始化脚本
│   └── test/                                         # 测试代码
├── pom.xml                                           # Maven配置
└── README.md                                         # 项目说明
```

## 功能特性

### 用户认证系统
- 手机号注册/登录
- 短信验证码验证
- JWT令牌认证
- 用户信息管理

### 短信服务
- 阿里云短信服务集成
- 验证码发送和校验
- 开发环境模拟发送

### 安全特性
- JWT令牌认证和授权
- 请求拦截和用户身份验证
- 全局异常处理
- 跨域配置

### 数据库设计
- 用户表 - 用户基本信息
- 用户关注表 - 关注关系
- 视频表 - 视频信息
- 视频点赞表 - 点赞记录
- 视频评论表 - 评论系统
- 系统配置表 - 系统参数

## 快速开始

### 环境要求
- JDK 17+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd flash-cast/backend
   ```

2. **配置数据库**
   ```sql
   -- 创建数据库
   CREATE DATABASE flash_cast DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   
   -- 导入数据表
   mysql -u root -p flash_cast < src/main/resources/sql/init.sql
   ```

3. **配置Redis**
   ```bash
   # 启动Redis服务
   redis-server
   ```

4. **修改配置文件**
   编辑 `src/main/resources/application.yml`，配置数据库和Redis连接信息：
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/flash_cast
       username: your_username
       password: your_password
     redis:
       host: localhost
       port: 6379
   
   flashcast:
     sms:
       aliyun:
         access-key-id: your_access_key_id
         access-key-secret: your_access_key_secret
   ```

5. **运行应用**
   ```bash
   mvn spring-boot:run
   ```

6. **访问应用**
   - 应用地址：http://localhost:8080
   - API文档：http://localhost:8080/swagger-ui.html
   - 健康检查：http://localhost:8080/actuator/health

## API 接口

### 认证相关接口
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login-or-register` - 登录或注册
- `GET /api/auth/profile` - 获取用户信息

### 请求示例

#### 发送验证码
```bash
curl -X POST http://localhost:8080/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "18888888888"}'
```

#### 用户登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "18888888888", "verifyCode": "123456"}'
```

## 配置说明

### JWT配置
```yaml
flashcast:
  jwt:
    secret: your-jwt-secret-key
    expiration: 604800000  # 7天，单位毫秒
    issuer: flash-cast
```

### 短信服务配置
```yaml
flashcast:
  sms:
    aliyun:
      access-key-id: your-access-key-id
      access-key-secret: your-access-key-secret
      sign-name: Flash Cast
      template-code: SMS_XXXXXXXX
```

### 文件上传配置
```yaml
flashcast:
  oss:
    aliyun:
      access-key-id: your-access-key-id
      access-key-secret: your-access-key-secret
      bucket-name: flash-cast-storage
      endpoint: oss-cn-hangzhou.aliyuncs.com
```

## 开发规范

### 代码规范
- 遵循 Java 编码规范
- 使用统一的代码格式化规则
- 完善的注释和文档
- 单元测试覆盖

### 接口规范
- RESTful API设计
- 统一的响应格式
- 完整的错误处理
- API版本管理

### 数据库规范
- 统一的命名规范
- 合理的索引设计
- 数据库迁移脚本
- 备份和恢复策略

## 部署指南

### Docker部署
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/flash-cast-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 构建命令
```bash
# 编译打包
mvn clean package -DskipTests

# 构建Docker镜像
docker build -t flash-cast-backend .

# 运行容器
docker run -p 8080:8080 flash-cast-backend
```

## 监控和日志

### 应用监控
- Spring Boot Actuator 端点
- 应用健康检查
- 性能指标监控

### 日志配置
```yaml
logging:
  level:
    com.flashcast: DEBUG
    org.springframework.security: DEBUG
  file:
    name: logs/flash-cast.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
```

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目维护者：Flash Cast Team
- 邮箱：contact@flashcast.com
- 项目地址：https://github.com/flashcast/flash-cast-backend

## 更新日志

### v1.0.0 (2025-09-18)
- 初始版本发布
- 用户认证系统
- 短信验证码服务
- JWT令牌认证
- 基础数据库设计
- API文档集成