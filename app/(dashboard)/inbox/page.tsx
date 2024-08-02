'use client'

import { Button, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useState, useOptimistic, useEffect, useRef } from 'react'
import { getMails, Mail } from './action'
import { useRouter } from 'next/navigation'
import { flushSync } from 'react-dom'

export default function Inbox() {
  
  const mailsPerPage = 20
  const emailRef = useRef<string>('')
  const passwordRef = useRef<string>('')
  const router = useRouter()
  const [messageAPI, contextHolder] = message.useMessage()

  // 邮件预览
  const [mails, setMails] = useState<Mail[]>([])
  const [btn, setBtn] = useState<'loading' | 'loaded' | 'null'>('loading')
  const handleLoadMore = (limit: number, skip: number) => {
    flushSync(() => setBtn('loading'))
    getMails(emailRef.current, passwordRef.current, limit, skip)
      .then(res => {
        if (res === '401') {
          messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
          localStorage.clear()
          sessionStorage.clear()
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          setMails(mails => [...mails, ...res as Mail[]])
          setBtn(res.length === mailsPerPage ? 'loaded' : 'null')
        }
      })
      .catch(err => {
        messageAPI.error(`获取邮件失败: ${err instanceof Error ? err.message : err}`)
      })
  }

  // 当前显示的邮件 - TODO
  const [email, setEmail] = useState<React.ReactNode>('')
  const [optEmail, setOptEmail] = useOptimistic(email, (state, action) => {
    return <div><LoadingOutlined /> 加载中</div>
  })
  const handleClickEmail = (_id: string) => {
    messageAPI.info(`打开邮件 ${_id}`)
  }

  // 从服务器获取初始化邮件
  useEffect(() => {
    emailRef.current = localStorage.getItem('email') ?? sessionStorage.getItem('email') ?? ''
    passwordRef.current = localStorage.getItem('password') ?? sessionStorage.getItem('password') ?? ''
    if (!emailRef.current || !passwordRef.current) {
      messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      getMails(emailRef.current, passwordRef.current, mailsPerPage, 0)
        .then(res => {
          if (res === '401') {
            messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
            localStorage.clear()
            sessionStorage.clear()
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          } else {
            setMails(res as Mail[])
            setBtn(res.length === mailsPerPage ? 'loaded' : 'null')
          }
        })
        .catch(err => {
          messageAPI.error(`获取邮件失败: ${err instanceof Error ? err.message : err}`)
        })
    }
    return () => {
      messageAPI.destroy()
      setMails([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div 
      className='w-full h-full relative flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden'
      style={{scrollbarWidth: 'none'}}
    >
      <div className='w-full flex flex-row items-center justify-center flex-wrap gap-4'>
        {mails.map(mail => <EmailPreview key={mail._id} mail={mail} onClick={handleClickEmail} />)}
      </div>
      <div className='mt-6 mb-4'>
        <Button
          disabled={btn === 'null'}
          loading={btn === 'loading'}
          icon={btn === 'loading' ? <LoadingOutlined /> : undefined}
          onClick={btn === 'loaded' ? () => handleLoadMore(mailsPerPage, mails.length) : undefined}
        >
          {btn === 'loading' ? '加载中' : (btn === 'loaded' ? '加载更多' : '没有更多邮件')}
        </Button>
      </div>
      {contextHolder}
    </div>
  )
}

function EmailPreview({ mail, onClick }: { mail: Mail, onClick: (_id: string) => void }) {
  const color = () => {
    let random = 0
    const min = 215
    const max = 245
    while (random < min || random > max) {
      random = Math.floor(Math.random() * 255)
    }
    return random
  }
  const colorStart = `rgb(${color()}, ${color()}, ${color()})`
  const colorEnd = `rgb(${color()}, ${color()}, ${color()})`
  return (
    <div className='flex flex-col w-full md:w-[48.5%] xl:w-[32.2%] p-4 relative shadow-sm border rounded-xl bg-gray-50 cursor-pointer transition-all hover:scale-[99%] md:hover:scale-[98%]' onClick={() => onClick(mail._id)}>
      <div className='grid relative grid-cols-[2rem,1fr,4rem] gap-[0.6rem] items-center'>
        <div 
          className='w-8 h-4 rounded-full'
          style={{
            background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`
          }}
        ></div>
        <div className='text-sm font-bold text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap'>{mail.subject}</div>
        <div className='text-xs text-gray-500 text-right absolute right-0 top-0'>{mail.date}</div>
      </div>
      <div className='text-xs my-2 text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap'>来自 {mail.from}</div>
      <div className='text-sm text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap'>{mail.content}</div>
    </div>
  )
}