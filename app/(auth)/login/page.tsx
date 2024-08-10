'use client'

import { Button, Checkbox, Input, Form, Flex, message } from 'antd'
import { UserOutlined, KeyOutlined, ExportOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useOptimistic } from 'react'
import { auth } from './action'
import sha256 from 'crypto-js/sha256'
import { clear } from 'idb-keyval'

type FieldType = {
  email: string
  password: string
  remember?: boolean
}

export default function Login() {

  const router = useRouter()
  const [messageAPI, contextHolder] = message.useMessage()
  const [disableForm] = useState(false)
  const [disableState, setDisableState] = useOptimistic(
    disableForm, 
    (_, value: boolean) => value
  )

  const handleSubmit = async (values: FieldType) => {
    // 加密
    const password = sha256(values.password).toString()
    setDisableState(true)
    messageAPI.open({
      type: 'loading',
      content: '正在登录...',
      duration: 0,
      key: 'logining'
    })
    await auth(values.email, password)
      .then(username => {
        messageAPI.destroy()
        messageAPI.open({
          type: 'success',
          content: '登录成功',
          duration: 2,
          key: 'success'
        })
        if (values.remember) {
          sessionStorage.clear()
          localStorage.setItem('username', username)
          localStorage.setItem('email', values.email)
          localStorage.setItem('password', password)
        } else {
          localStorage.clear()
          sessionStorage.setItem('username', username)
          sessionStorage.setItem('email', values.email)
          sessionStorage.setItem('password', password)
        }
        setTimeout(() => {
          router.push('/inbox')
        }, 800)
      })
      // 注: Server Action 不会返回原始错误信息
      .catch(() => {
        messageAPI.destroy()
        messageAPI.open({
          type: 'error',
          content: '登录失败, 请检查邮箱地址和密码',
          duration: 3,
          key: 'error'
        })
      })
  }

  useEffect(() => {
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
      router.push('/inbox')
    } else {
      clear() // Promise<void>
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='relative w-full h-full flex flex-col items-center justify-center'>
      {contextHolder}
      <Form<FieldType>
        name='login'
        initialValues={{ remember: true }}
        className='w-11/12'
        onFinish={handleSubmit}
        disabled={disableState}
      >
        <Form.Item>
          <p className='mb-4 text-2xl font-bold text-center'>MailBox</p>
        </Form.Item>

        <Form.Item
          name='email'
          rules={[{ type: 'email', message: '请输入正确的邮箱地址', }, { required: true, message: '请输入邮箱地址', }]}
        >
          <Input prefix={<UserOutlined />} placeholder='邮箱地址' type='email' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input prefix={<KeyOutlined />} type="password" placeholder='密码' />
        </Form.Item>

        <Form.Item className='px-1'>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className='text-xs'>记住我</Checkbox>
            </Form.Item>
            <Link href="/registry" className='text-xs opacity-70'>注册<ExportOutlined className='ml-1' /></Link>
            <Link href="/reset" className='text-xs opacity-70'>忘记密码<ExportOutlined className='ml-1' /></Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>登录</Button>
        </Form.Item>
      </Form>
    </div>
  )
}