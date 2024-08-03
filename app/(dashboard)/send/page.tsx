'use client'

import { Button, Input, Form, message, Radio } from 'antd'
import { UserOutlined, CommentOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { sendEmail } from './action'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import 'github-markdown-css/github-markdown.css'

type FieldType = {
  to: string
  subject: string
  content: string
}

export default function Send() {

  // 基础信息
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    const username = localStorage.getItem('username') ?? sessionStorage.getItem('username') ?? ''
    const email = localStorage.getItem('email') ?? sessionStorage.getItem('email') ?? ''
    const password = localStorage.getItem('password') ?? sessionStorage.getItem('password') ?? ''
    setUsername(username)
    setEmail(email)
    setPassword(password)
  }, [])

  // 内容和预览
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)

  // 提交表单
  const router = useRouter()
  const [form] = Form.useForm<FieldType>()
  const [messageAPI, contextHolder] = message.useMessage()
  const [disableForm, setDisableForm] = useState(false)
  const handleSubmit = (values: FieldType) => {
    flushSync(() => setDisableForm(true))
    messageAPI.open({
      content: '发送中...',
      key: 'sending',
      duration: 0,
      type: 'loading'
    })
    sendEmail(email, values.to, values.subject, values.content, password, username)
      .then(res => {
        if (res === '401') {
          messageAPI.destroy()
          messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
          localStorage.clear()
          sessionStorage.clear()
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else if (res === '500a' || res === '500b') {
          messageAPI.destroy()
          messageAPI.error('发送失败')
        } else if (res === '403') {
          messageAPI.destroy()
          messageAPI.error('该账号无权限发送邮件')
        } else {
          messageAPI.destroy()
          messageAPI.success('发送成功')
          form.resetFields()
          setContent('')
        }
      })
      .catch(err => {
        messageAPI.destroy()
        messageAPI.error(`发送失败: ${err instanceof Error ? err.message : err}`)
      })
      .finally(() => {
        setDisableForm(false)
      })
  }

  return (
    <div className='flex overflow-hidden flex-col items-center justify-center h-full w-full'>
      {contextHolder}
      <Form<FieldType>
        name='send'
        form={form}
        onFinish={handleSubmit}
        className='w-full h-full grid grid-rows-[13.5rem,calc(100%-12.5rem)] md:grid-rows-[5.8rem,calc(100%-5.8rem)] md:gap-[1.1rem]'
        disabled={disableForm}
      >
        <div className='w-full md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4'>
          <Form.Item>
            <Input
              className='w-full'
              disabled
              placeholder={`${username} <${email}>`}
              addonBefore={<span className='text-gray-400'><UserOutlined /> 发件人</span>}
            />
          </Form.Item>
          <Form.Item
            name='to'
            rules={[
              { required: true, message: '请输入收件人' },
              { type: 'email', message: '请输入正确的邮箱地址' },
              () => ({
                validator(_, value) {
                  if (value === email) {
                    return Promise.reject('收件人和发件人不能相同')
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <Input
              className='w-full'
              addonBefore={<span className='text-gray-400'><CommentOutlined /> 收件人</span>}
              placeholder='请输入收件人'
            />
          </Form.Item>
          <Form.Item
            name='subject'
            rules={[{ required: true, message: '请输入主题' }]}
          >
            <Input
              className='w-full'
              addonBefore={<span className='text-gray-400'><EditOutlined /> 主题</span>}
              placeholder='请输入主题'
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType='submit'
              className='w-full'
            >
              发送
            </Button>
          </Form.Item>
        </div>
        <div className='w-full h-full grid grid-rows-[2.4rem,calc(100%-3.5rem)]'>
          <Form.Item
            className='mx-auto'
          >
            <Radio.Group
              defaultValue='edit'
              size='small'
              buttonStyle='outline'
              onChange={e => setPreview(e.target.value === 'preview')}
            >
              <Radio.Button className='text-xs' value='edit'>编辑</Radio.Button>
              <Radio.Button className='text-xs' value='preview'>预览</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <div 
            style={{ scrollbarWidth: 'none' }}
            className='w-full h-full rounded-lg border overflow-x-hidden overflow-y-auto'
          >
            <div 
              className='w-full h-full'
              style={{ display: preview ? 'block' : 'none' }}
            >
              <Markdown
                className='markdown-body w-full h-full py-2 px-3'
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content + '<br /><br />'}
              </Markdown>
            </div>
            <Form.Item
              name='content'
              rules={[{ required: true, message: '请输入邮件内容' }]}
              className='w-full h-full'
              style={{ display: preview ? 'none' : 'block' }}
            >
              <Input.TextArea
                placeholder='请输入邮件内容 (支持 Markdown 和 HTML)'
                autoSize={{ minRows: 5 }}
                className='w-full h-full border-none py-2 focus:ring-0'
                onChange={e => setContent(e.target.value)}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  )
}