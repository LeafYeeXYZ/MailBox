'use server'

import { Resend } from 'resend'
import { MongoClient } from 'mongodb'
import { marked } from 'marked'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const user = db.collection('user')
const sent = db.collection('sent')
// 连接 Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  content: string,
  password: string,
  username: string
): Promise<boolean | string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email: from, password }, { projection: { role: 1 } })
  if (!auth) {
    return '401'
  } else if (auth.role !== 'admin' && auth.role !== 'user') {
    return '403'
  }
  // 渲染 Markdown
  const mail = await marked.parse(content)
  const css = await (await fetch('https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.css')).text()
  const html = `
    <div class='markdown-body'>
      ${mail}
    </div>
    <style>
      ${css}
    </style>
    <style>
      .markdown-body {
        min-width: 200px;
        max-width: 900px;
        padding: 20px;
        margin: 0 auto;
      }
    </style>
  `
  // 发送邮件
  const { error } = await resend.emails.send({
    from: `${username} <${from}>`,
    to: [to],
    subject,
    html,
    text: content
  })
  if (error) {
    return '500a'
  }
  // 保存邮件
  await sent.insertOne({
    from,
    to,
    subject,
    text: content,
    html: `
      <html>
        <head>
          <style>
            ${css}
          </style>
          <style>
            .markdown-body {
              min-width: 200px;
              max-width: 900px;
              padding: 20px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class='markdown-body'>
            ${mail}
          </div>
        </body>
      </html>
    `,
    date: new Date().toISOString()
  }).catch(() => {
    return '500b'
  })
  return true
}
