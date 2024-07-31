import { EmailTemplate } from './email'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: '小叶子 <xiaoyezi@leafyee.xyz>',
      to: ['me@leafyee.xyz'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }
    return Response.json(data)

  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
