'use client'

import { Button, Input, Form, message, Space } from 'antd'
import { UserOutlined, AuditOutlined, CameraOutlined, BankOutlined, FileTextOutlined, KeyOutlined, CodeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { getUser, updateUser } from './action'
import { UserData } from '@/app/COLL_TYPE'
import Image from 'next/image'
import sha256 from 'crypto-js/sha256'
import { clear, set, get, del } from 'idb-keyval'

export default function Profile() {

  // 功能组件
  const router = useRouter()
  const [messageAPI, contextHolder] = message.useMessage()

  // 表单数据
  const [form, setForm] = useState<UserData & { confirm?: string } | null>(null)
  const [disabled, setDisabled] = useState<boolean>(false)

  // 用户数据
  const [user, setUser] = useState<UserData | null>(null)
  useEffect(() => {
    const email = localStorage.getItem('email') ?? sessionStorage.getItem('email') ?? ''
    const password = localStorage.getItem('password') ?? sessionStorage.getItem('password') ?? ''
    if (!email.length || !password.length) {
      messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return () => messageAPI.destroy()
    }
    get<UserData>('user')
    // 先从缓存中获取用户信息
    .then(res => {
      return res ?? getUser(email, password)
    })
    // 缓存中没有再从服务器获取
    .then(res => {
      if (res === '401') {
        messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
        localStorage.clear()
        sessionStorage.clear()
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setUser(res as UserData)
        setForm(res as UserData)
        set('user', res as UserData) // Promise<void>
      }
    })
    .catch(err => {
      messageAPI.error(`获取用户失败: ${err instanceof Error ? err.message : err}`)
    })
    return () => {
      messageAPI.destroy()
      setUser(null)
      setForm(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 提交表单
  const handleUpdate = (field: string, value: string) => {
    flushSync(() => setDisabled(true))
    messageAPI.open({
      type: 'loading',
      content: '正在更新...',
      duration: 0,
      key: 'updating'
    })
    updateUser(user?.email ?? '', user?.password ?? '', field, value)
      .then(res => {
        messageAPI.destroy()
        if (res === '200') {
          messageAPI.success('更新成功')
          // 清除缓存
          del('user').then(() => {
            if (field === 'password') {
              messageAPI.info('即将跳转至登录页')
              localStorage.clear()
              sessionStorage.clear()
              setTimeout(() => {
                router.push('/login')
              }, 800)
            } else {
              setTimeout(() => {
                location.reload()
              }, 800)
            }
          })
        } else if (res === '401') {
          messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
          localStorage.clear()
          sessionStorage.clear()
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else if (res === '403') {
          messageAPI.error('该账号无权限更新信息')
        } else {
          messageAPI.error('更新失败, 未知错误')
        }
      }).catch(() => {
        messageAPI.destroy()
        messageAPI.error('更新失败, 未知错误')
      }).finally(() => {
        setDisabled(false)
      })
  }

  return (
    <div className='flex items-start justify-center h-full w-full overflow-x-hidden overflow-y-auto'>
      {contextHolder}
      <Form
        name='profile'
        disabled={disabled}
        style={{ scrollbarWidth: 'none' }}
        className='w-full max-w-xl flex flex-col items-center justify-start overflow-hidden'
      > 
        {/* 头像, 用户名, 邮箱 */}
        <div className='relative w-full h-32 my-8 border rounded-lg py-[0.95rem] pl-5 bg-gray-50 shadow-sm'>
          <div className='relative w-24 h-24 rounded-full overflow-hidden'>
            <Image 
              src={user?.avatar ?? (user?.role === 'admin' ? '/avatar.jpg' : '/avatar_public.png')}
              alt='avatar'
              width={100}
              height={100}
            />
          </div>
          <div className='absolute w-1/2 top-[2.4rem] left-[9.1rem] text-lg font-bold text-gray-700 overflow-hidden text-ellipsis text-nowrap'>
            { user?.username ?? '加载中...' }
          </div>
          <div className='absolute w-1/2 top-[4.3rem] left-[9.2rem] text-sm font-bold text-gray-500 overflow-hidden text-ellipsis text-nowrap'>
            { user?.email }
          </div>
        </div>

        {/* 修改个人信息 */}
        <p className='w-full text-left text-sm font-bold text-gray-700 my-2 pl-1'><FileTextOutlined /> 修改个人信息</p>
        <Space.Compact className='w-full my-2'>
          <Input 
            addonBefore={<span><UserOutlined /> 用户名</span>}
            name='username'
            placeholder={`当前: ${user?.username ?? '未设置'}`}
            onChange={e => setForm(form => ({ ...form, username: e.target.value } as UserData))}
          />
          <Button 
            onClick={() => {
              // 检查用户名长度
              if ((form?.username.length ?? 0) > 20 || /\s/.test(form?.username ?? '') || !form?.username.length) {
                messageAPI.error('用户名最长20个字符且不能有空格')
                return
              }
              handleUpdate('username', form?.username ?? '')
            }}
            type='default'
            disabled={user?.username === form?.username || !form?.username.length || disabled}
          >修改</Button>
        </Space.Compact>
        <Space.Compact className='w-full my-2'>
          <Input 
            addonBefore={<span><CameraOutlined /> 头像链接</span>}
            name='avatar'
            placeholder={`当前: ${user?.avatar ?? '未设置 (仅支持Gravatar)'}`}
            onChange={e => setForm(form => ({ ...form, avatar: e.target.value } as UserData))}
          />
          <Button 
            onClick={() => {
              // 检查链接格式
              if (!/^https?:\/\//.test(form?.avatar ?? '')) {
                messageAPI.error('头像链接格式错误')
                return
              }
              handleUpdate('avatar', form?.avatar ?? '')
            }}
            type='default'
            disabled={user?.avatar === form?.avatar || !form?.avatar?.length || disabled}
          >修改</Button>
        </Space.Compact>
        <Space.Compact className='w-full my-2'>
          <Input 
            addonBefore={<span><BankOutlined /> 密保邮箱</span>}
            name='signature'
            placeholder={`当前: ${user?.backupEmail ?? '未设置'}`}
            onChange={e => setForm(form => ({ ...form, backupEmail: e.target.value } as UserData))}
          />
          <Button 
            onClick={() => {
              // 检查邮箱格式
              if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(form?.backupEmail ?? '')) {
                messageAPI.error('密保邮箱格式错误')
                return
              }
              handleUpdate('backupEmail', form?.backupEmail ?? '')
            }}
            type='default'
            disabled={user?.backupEmail === form?.backupEmail || !form?.backupEmail?.length || disabled}
          >修改</Button>
        </Space.Compact>

        {/* 重置密码 */}
        <p className='w-full text-left text-sm font-bold text-gray-700 my-2 pl-1'><AuditOutlined /> 重置密码</p>
        <Space.Compact className='w-full my-2'>
          <Input 
            addonBefore={<span><KeyOutlined /> 新密码</span>}
            name='password'
            placeholder='请输入新密码'
            type='password'
            onChange={e => setForm(form => ({ ...form, password: e.target.value } as UserData))}
          />
        </Space.Compact>
        <Space.Compact className='w-full my-2'>
          <Input 
            addonBefore={<span><KeyOutlined /> 确认密码</span>}
            name='confirm'
            placeholder='请再次输入'
            type='password'
            onChange={e => setForm(form => ({ ...form, confirm: e.target.value } as UserData))}
          />
        </Space.Compact>
        <Button 
          onClick={() => handleUpdate('password', sha256(form?.password ?? '').toString())}
          type='default'
          className='w-full my-2'
          disabled={form?.password !== form?.confirm || !form?.password?.length || !form?.confirm?.length || disabled}
        >修改密码</Button>
        {/* 清除缓存 */}
        <p className='w-full text-left text-sm font-bold text-gray-700 my-2 pl-1'><CodeOutlined /> 高级设置</p>
        <Button 
          onClick={async () => {
            flushSync(() => setDisabled(true))
            await clear()
            messageAPI.success('清除成功')
            setTimeout(() => {
              location.reload()
            }, 800)
          }}
          type='default'
          className='w-full my-2'
        >清除缓存</Button>
      </Form>
    </div>
  )
}