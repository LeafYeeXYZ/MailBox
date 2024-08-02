'use server'

import { MongoClient } from 'mongodb'
import sha256 from 'crypto-js/sha256'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const user = db.collection('user')

export async function registry(
  username: string,
  email: string,
  password: string,
  authCode: string = ''
): Promise<string> {
  const fullEmail = `${email}@${process.env.NEXT_PUBLIC_MAIL_SERVER}`
  try {
    // 验证 authCode
    if (process.env.REGISTRY_KEY && authCode !== process.env.REGISTRY_KEY) {
      return '注册码错误'
    }
    // 查询是否已存在
    const result = await user.findOne({ email: fullEmail })
    if (result) {
      return '邮箱已注册'
    }
    // 插入数据
    await user.insertOne({
      username,
      email: fullEmail,
      password: sha256(password).toString(),
      role: 'user',
      active: true,
      createTime: Date.now(),
      updateTime: Date.now()
    })
    return '200'
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : '未知错误')
  }
}