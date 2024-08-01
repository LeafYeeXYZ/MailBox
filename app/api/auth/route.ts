import { MongoClient } from 'mongodb'

// 连接 MongoDB
const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('mailbox')
const inbox = db.collection('user')

export async function POST(req: Request): Promise<Response> {
  const { email, password }: { email: string, password: string } = await req.json()
  const user = await inbox.findOne({
    email,
    password
  })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  return new Response('OK')
}