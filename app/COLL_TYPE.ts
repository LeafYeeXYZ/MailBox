import type { Email } from 'postal-mime'

export type UserData = {
  /** 邮箱地址 */
  email: string
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 头像(base64编码) */
  avatar?: string
  /** 角色 */
  role: 'user' | 'admin'
  /** 是否激活 */
  active: boolean
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
  /** 备用邮箱, 用于找回密码 */
  backupEmail?: string
  /** MFA密钥 */
  mfa?: string
}

export type InboxData = {
  workers: {
    from: string
    to: string
  }
} & Email

export type SentData = {

}