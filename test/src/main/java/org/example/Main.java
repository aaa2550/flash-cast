import java.util.Scanner;

// 注意类名必须为 Main, 不要有任何 package xxx 信息
public class Main {
    public static void main(String[] args) {
        int[] arr = new int[]{1, 4, 2, 3};
        int num1 = 2;
        int num2 = 4;
        System.out.println(getIndex(arr, num1));
        System.out.println(isNear(arr, num1, num2) ? "Yes" : "No");
    }

    public static boolean isNear(int[] arr, int num1, int num2) {
        if (arr.length < 2) {
            return false;
        }
        int index = getIndex(arr, num1);
        if (index < 0 || index > arr.length) {
            return false;
        }
        return (index > 0 && arr[index - 1] == num2) ||
                (index < arr.length - 1 && arr[index + 1] == num2);
    }

    public static int getIndex(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        // 注意循环条件是left <= right
        while (left <= right) {
            // 计算中间索引，避免溢出
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid; // 找到目标，返回索引
            } else if (arr[mid] < target) {
                left = mid + 1; // 目标在右侧，移动左指针
            } else {
                right = mid - 1; // 目标在左侧，移动右指针
            }
        }

        return -1; // 未找到目标
    }


}