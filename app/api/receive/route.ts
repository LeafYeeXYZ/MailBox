import PostalMime from 'postal-mime'
import { MongoClient } from 'mongodb'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const inbox = db.collection('inbox')

export async function POST(req: Request): Promise<Response> {
  // 从请求中解析邮件数据
  const { from, to, mail, auth }: { from: string, to: string, mail: string, auth: string } = await req.json()
  if (auth !== process.env.PEER_AUTH_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }
  const data = await PostalMime.parse(mail)
  // 如果没有 text, 将 html 转换为 text 并移除所有标签
  if (!data.text) {
    data.text = data.html
      ?.replace(/<br>/g, '\n')
      .replace(/<br \/>/g, '\n')
      .replace(/<style[^>]*>.*?<\/style>/g, '')
      .replace(/<script[^>]*>.*?<\/script>/g, '')
      .replace(/<[^>]+>/g, '')
  }
  // 生产 AI 摘要
  // const summary = ''
  // 如果没有 html, 将 text 转换为 html
  if (!data.html) {
    data.html = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            /* 黑色模式响应式 */
            @media (prefers-color-scheme: dark) {
              #root {
                color: #fff;
              }
            }
          </style>
        </head>
        <body>
          <div id="root">${data.text}</div>
        </body>
      </html>
    `
  }
  // 将邮件数据插入到收件箱
  await inbox.insertOne({ ...data, workers: { from, to } })
  return new Response('OK')
}