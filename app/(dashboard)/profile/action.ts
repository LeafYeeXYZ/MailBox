'use server'

import { MongoClient } from 'mongodb'
import type { UserData } from '@/app/COLL_TYPE'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const user = db.collection('user')

export async function getUser(email: string, password: string): Promise<UserData | string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email, password }, { projection: { _id: 0 } })
  if (!auth) {
    return '401'
  } else {
    return auth as unknown as UserData
  }
}

export async function updateUser(email: string, password: string, field: string, value: string): Promise<string> {
  // 验证邮箱和密码
  const auth = await user.findOne({ email, password }, { projection: { role: 1 } })
  if (!auth) {
    return '401'
  } else if (auth.role !== 'admin' && auth.role !== 'user') {
    return '403'
  }
  // 更新用户
  await user.updateOne({ email, password }, { $set: { [field]: value } })
  return '200'
}