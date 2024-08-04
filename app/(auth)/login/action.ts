'use server'

import { MongoClient } from 'mongodb'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const inbox = db.collection('user')

export async function auth(email: string, password: string): Promise<string> {
  try {
    const user = await inbox.findOne({
      email,
      password
    }, { projection: { username: 1 } })
    if (!user) {
      throw new Error('邮箱地址或密码错误')
    }
    return user.username as string
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : '未知错误')
  }
}