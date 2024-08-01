import { ForwardableEmailMessage } from '@cloudflare/workers-types'

export default {
	async email(message: ForwardableEmailMessage, env, ctx) {
		// 获取邮件信息
		const { from, to, raw } = message
		// 解析邮件
		const mail = await new Response(raw).text()
		const data = JSON.stringify({ from, to, mail })
		// 发送数据到接收API
		await fetch(env.NEXT_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		})

	}
} satisfies ExportedHandler<Env>