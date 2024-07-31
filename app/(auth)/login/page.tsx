'use client'

import { Button, Checkbox, Input, Form, Flex } from 'antd'
import { UserOutlined, KeyOutlined, ExportOutlined } from '@ant-design/icons'
import Link from 'next/link'

type FieldType = {
  username?: string
  password?: string
  remember?: string
}

export default function Login() {

  const handleSubmit = (values: FieldType) => {
    console.log('Received values of form: ', values)
  }

  return (
    <div className='relative w-full h-full flex flex-col items-center justify-center'>

      <Form<FieldType>
        name='login'
        initialValues={{ remember: true }}
        className='w-11/12'
        onFinish={handleSubmit}
      >
        <Form.Item>
          <p className='text-2xl font-bold text-center'>MailBox</p>
        </Form.Item>

        <Form.Item
          name='username'
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