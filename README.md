# MailBox 🚧 WIP
MailBox is a web application that allows you to send and receive emails serverlessly and costlessly.

## TODO
- [ ] 身份验证和用户数据存储 (MongoDB)
- [ ] 发送邮件功能 (Resend)
- [ ] 接收邮件功能 (Cloudflare Mail Workers -> Next.js API -> MongoDB)
- [ ] 支持 Markdown 写邮件 (Marked)
- [ ] 注册功能 (服务端注册条件控制)
- [ ] 找回密码功能 (向备用邮箱发送验证码)

## Environment Variables
| Variable | Description | Default | Required |
|:--------:|:-----------:|:-------:|:--------:|
| `RESEND_API_KEY` | API key of Resend | | Yes |