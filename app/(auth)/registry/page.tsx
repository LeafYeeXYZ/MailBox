'use client'

import { Button, Input, Form, Flex, message, ConfigProvider, ThemeConfig } from 'antd'
import { UserOutlined, KeyOutlined, MailOutlined, CodeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { registry } from './action'
import { darkTheme } from '@/app/config'

type FieldType = {
  username: string
  email: string // without '@' and domain
  password: string // before encryption
  confirm: string // should be the same as password
  authCode?: string // registration code
}

export default function Login() {

  const router = useRouter()
  const [messageAPI, contextHolder] = message.useMessage()
  const [disableForm, setDisableForm] = useState<boolean>(false)

  const handleSubmit = async (values: FieldType) => {
    flushSync(() => setDisableForm(true))
    messageAPI.open({
      type: 'loading',
      content: '正在注册...',
      duration: 0,
      key: 'registering'
    })
    await registry(values.username, values.email, values.password, values.authCode ?? '')
      .then(res => {
        if (res === '200') {
          messageAPI.destroy()
          messageAPI.open({
            type: 'success',
            content: '注册成功 (2秒后自动跳转至登录页面)',
            duration: 2,
            key: 'success'
          })
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          messageAPI.destroy()
          messageAPI.open({
            type: 'error',
            content: `注册失败: ${res}`,
            duration: 3,
            key: 'error'
          })
        }
      }).catch(() => {
        messageAPI.destroy()
        messageAPI.open({
          type: 'error',
          content: '注册失败, 未知错误',
          duration: 3,
          key: 'error'
        })
      }).finally(() => {
        setDisableForm(false)
      })
  }

  // 控制黑暗模式
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({})
  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkMode) {
      setThemeConfig(darkTheme)
    }
  }, [])
  
  return (
    <ConfigProvider
      theme={themeConfig}
    >
      <div className='relative w-full h-full flex flex-col items-center justify-center'>
        {contextHolder}
        <Form<FieldType>
          name='registry'
          className='w-11/12'
          onFinish={handleSubmit}
          disabled={disableForm}
        >
          <Form.Item>
            <p className='mb-2 text-2xl font-bold text-center'>注册</p>
          </Form.Item>

          <Form.Item
            name='username'
            rules={[{ required: true, message: '请输入用户名' },
              () => ({
                validator(_, value) {
                  if (!value || value.length <= 20 && !/\s/.test(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('用户名最长20个字符且不能有空格'))
                },
              })
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder='用户名 (支持中文)' />
          </Form.Item>

          <Form.Item
            name='email'
            rules={[{ required: true, message: '请输入邮箱地址', },
              () => ({
                validator(_, value) {
                  if (!value || /^[a-z0-9]{1,20}$/.test(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入20个字符以内的小写字母或数字'))
                },
              })
            ]}
          >
            <Input addonAfter={`@${process.env.NEXT_PUBLIC_MAIL_SERVER}`} prefix={<MailOutlined />} placeholder='邮箱地址' type='text' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input prefix={<KeyOutlined />} type="password" placeholder='密码' />
          </Form.Item>

          <Form.Item
            name='confirm'
            dependencies={['password']}
            rules={[{ required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            })]}
          >
            <Input prefix={<KeyOutlined />} type="password" placeholder='确认密码' />
          </Form.Item>

          {
            process.env.NEXT_PUBLIC_REGISTRY_SET === 'true' &&
            <Form.Item
              name='authCode'
              rules={[{ required: true, message: '请输入注册码' }]}
            >
              <Input prefix={<CodeOutlined />} placeholder='注册码' />
            </Form.Item>
          }

          <Form.Item>
            <Flex justify="space-between" align="center" className='mt-2'>
              <Button type='default' htmlType='button' className='w-[48%]' onClick={() => router.push('/login')}>返回登录</Button>
              <Button type='primary' htmlType='submit' className='w-[48%]'>立即注册</Button>
            </Flex>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  )
}