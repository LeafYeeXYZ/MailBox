'use server'

import { MongoClient, ObjectId } from 'mongodb'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const user = db.collection('user')
const inbox = db.collection('inbox')

export type Mail = {
  _id: string
  from: string
  fromName: string
  to: string
  subject: string
  content: string
  date: string
  attachments?: string[]
}

// 删除特定邮件
export async function deleteEmail(email: string, password: string, _id: string): Promise<boolean | string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email, password })
  if (!auth) {
    return '401'
  } else if (auth.role !== 'admin' && auth.role !== 'user') {
    return '403'
  }
  // 删除邮箱
  const res = await inbox.deleteOne({ _id: new ObjectId(_id) })
  if (res.deletedCount === 0) {
    return '404'
  }
  return true
}

// 返回特定邮件
export async function getEmail(email: string, password: string, _id: string): Promise<Mail | string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email, password })
  if (!auth) {
    return '401'
  }
  // 获取邮箱
  const data = await inbox.findOne({ _id: new ObjectId(_id) })
  if (!data) {
    return '404'
  }
  return {
    _id: data._id.toString(),
    fromName: data.from.name,
    from: data.from.address,
    to: data.workers.to,
    subject: data.subject,
    content: data.html,
    date: data.date,
    attachments: data.attachments ?? []
  }
}

// 返回邮件列表, 内容仅需前 100 个字符
export async function getMails(email: string, password: string, limit: number, skip: number): Promise<Mail[] | string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email, password })
  if (!auth) {
    return '401'
  }
  // 获取邮箱列表
  const data = inbox.find({ 'workers.to': email }).sort({ date: -1 }).skip(skip).limit(limit).project({ text: 1, subject: 1, date: 1, workers: 1, from: 1 })
  const mails: Mail[] = []
  for await (const doc of data) {
    mails.push({
      _id: doc._id.toString(),
      from: doc.from.address,
      fromName: doc.from.name,
      to: doc.workers.to,
      subject: doc.subject,
      content: doc.text.slice(0, 100),
      date: doc.date.split('T')[0].slice(2)
    })
  }
  return mails
}
