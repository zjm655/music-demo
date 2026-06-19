// 通用弹窗工具：统一封装 element-plus 的 ElMessage、ElMessageBox、ElNotification
// 由于这些组件采用函数式调用，对应的 CSS 样式不会自动引入，需手动 import 样式文件
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
// 手动引入函数式调用所需的样式
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'

// 消息提示：轻量级顶部消息条，用于短暂反馈
const message = {
  // 成功消息
  success(text: string) {
    ElMessage.success(text)
  },
  // 警告消息
  warning(text: string) {
    ElMessage.warning(text)
  },
  // 错误消息
  error(text: string) {
    ElMessage.error(text)
  },
  // 普通信息消息
  info(text: string) {
    ElMessage.info(text)
  },
}

// 确认弹窗：返回 Promise<boolean>，确认返回 true，取消返回 false，不抛出异常
async function confirm(message: string, title?: string): Promise<boolean> {
  try {
    await ElMessageBox.confirm(message, title ?? '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    return true
  } catch {
    // 用户点击取消或关闭弹窗时，返回 false 而非抛错
    return false
  }
}

// 通知提醒：右上角通知卡片，用于较长时间停留的提示
const notify = {
  // 成功通知
  success(title: string, message?: string) {
    ElNotification.success({ title, message })
  },
  // 警告通知
  warning(title: string, message?: string) {
    ElNotification.warning({ title, message })
  },
  // 错误通知
  error(title: string, message?: string) {
    ElNotification.error({ title, message })
  },
  // 普通信息通知
  info(title: string, message?: string) {
    ElNotification.info({ title, message })
  },
}

// 统一导出 popup 对象，供全局调用
export const popup = {
  message,
  confirm,
  notify,
}
