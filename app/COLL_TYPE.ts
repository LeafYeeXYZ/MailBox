import type { Email } from 'postal-mime'

export type UserData = {
  /** 邮箱地址 */
  email: string
  /** 用户名 */
  username: string
  /** 
   * 密码, 经过 sha256 加密  
   * 登录时客户端先 sha256 加密再与数据库中的密码比对, 登录成功后存储加密后的密码    
   * 注册时密码直接传递到服务器(Server Action), 服务器再 sha256 加密后存储
   */
  password: string
  /** 角色 */
  role: 'user' | 'admin' | 'guest'
  /** 是否激活 */
  active: boolean
  /** 创建时间 */
  createTime: number
  /** 更新时间 */
  updateTime: number
  /** 头像(base64编码) */
  avatar?: string
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