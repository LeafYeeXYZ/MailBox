'use client'

import { Button, message, Drawer, Popconfirm } from 'antd'
import { LoadingOutlined, CaretDownFilled, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import { getMails, Mail, getEmail, deleteEmail } from './action'
import { useRouter } from 'next/navigation'
import { flushSync } from 'react-dom'
import { set, get, del } from 'idb-keyval'

export default function Sent() {
  
  const mailsPerPage = 20
  const [useremail, setUseremail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const router = useRouter()
  const [messageAPI, contextHolder] = message.useMessage()

  // 邮件预览
  const [mails, setMails] = useState<Mail[]>([])
  const [btn, setBtn] = useState<'loading' | 'loaded' | 'null'>('loading')
  const handleLoadMore = (limit: number, skip: number) => {
    flushSync(() => setBtn('loading'))
    getMails(useremail, password, limit, skip)
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

  // 当前显示的邮件
  const loadingEmail: Mail = { _id: '', to: '', subject: '加载中...', content: '', date: '', attachments: [] }
  const [email, setEmail] = useState<Mail>(loadingEmail)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const handleClickEmail = (_id: string) => {
    flushSync(() => {
      setEmail(loadingEmail)
      setLoading(true)
      setOpen(true)
    })
    getEmail(useremail, password, _id)
      .then(res => {
        if (res === '401') {
          messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
          localStorage.clear()
          sessionStorage.clear()
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else if (res === '404') {
          messageAPI.error('缓存过期 (1秒后自动刷新)')
          del('sent') // Promise<void>
          setTimeout(() => {
            location.reload()
          }, 1000)
          setOpen(false)
        } else {
          setEmail(res as Mail)
          setLoading(false)
        }
      })
      .catch(err => {
        messageAPI.error(`获取邮件失败: ${err instanceof Error ? err.message : err}`)
        setOpen(false)
      })
  }
  const handleDeleteEmail = async (_id: string) => {
    const res = await deleteEmail(useremail, password, _id)
    if (res === '401') {
      messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
      localStorage.clear()
      sessionStorage.clear()
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else if (res === '404') {
      messageAPI.error('缓存过期 (1秒后自动刷新)')
      del('sent') // Promise<void>
      setTimeout(() => {
        location.reload()
      }, 1000)
    } else if (res === '403') {
      messageAPI.error('该账号无权限删除邮件')
    } else {
      messageAPI.success('删除成功')
      setMails(mails.filter(mail => mail._id !== _id))
      del('sent') // Promise<void>
    }
  }

  // 从服务器获取初始化邮件
  useEffect(() => {
    const email = localStorage.getItem('email') ?? sessionStorage.getItem('email') ?? ''
    const password = localStorage.getItem('password') ?? sessionStorage.getItem('password') ?? ''
    const username = localStorage.getItem('username') ?? sessionStorage.getItem('username') ?? ''
    setUseremail(email)
    setPassword(password)
    setUsername(username)
    if (!email.length || !password.length) {
      messageAPI.error('登陆失效 (2秒后自动跳转至登录页)')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return () => messageAPI.destroy()
    }
    get('sent')
    // 先从缓存中获取邮件
    .then(res => {
      return res ?? getMails(email, password, mailsPerPage, 0)
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
        setMails(res as Mail[])
        setBtn(res.length === mailsPerPage ? 'loaded' : 'null')
        set('sent', res as Mail[]) // Promise<void>
      }
    })
    .catch(err => {
      messageAPI.error(`获取邮件失败: ${err instanceof Error ? err.message : err}`)
    })
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
        {mails.map(mail => <EmailPreview key={mail._id} mail={mail} onClick={handleClickEmail} onDelete={handleDeleteEmail} />)}
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
      <Drawer
        title={email?.subject}
        placement='bottom'
        closeIcon={<CaretDownFilled />}
        onClose={() => {
          setOpen(false)
          setLoading(true)
        }}
        open={open}
        loading={loading}
        height={'90%'}
        style={{ scrollbarWidth: 'none' }}
        className='rounded-t-2xl'
      >
        <div className='w-dvw h-[calc(100%-5rem)] absolute left-0 grid grid-rows-[3rem,1fr] sm:grid-rows-[1.75rem,1fr] items-center'>
          <div className='w-full h-full flex flex-col sm:flex-row items-start justify-start -mt-8 px-3 gap-1 sm:flex-wrap'>
            <div className='w-full sm:w-[49.5%] text-left text-xs text-gray-500'>发给 {email?.to}</div>
            <div className='w-full sm:w-[49.5%] sm:text-right text-left text-xs text-gray-500'>发件人 {`${username} <${useremail}>`}</div>
            <div className='w-full text-left text-xs text-gray-500'>{new Date(email?.date).toLocaleString()}</div>
          </div>
          <div className='w-full h-full border-t'>
            <iframe
              srcDoc={email?.content}
              className='w-full h-full'
              style={{scrollbarWidth: 'none'}}
              sandbox=''
            ></iframe>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

function EmailPreview({ mail, onClick, onDelete }: { mail: Mail, onClick: (_id: string) => void, onDelete: (_id: string) => Promise<void> }) {
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
  const data = new Date(mail.date)
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
        <div className='text-xs text-gray-500 text-right absolute right-0 top-0'>{`${data.getFullYear().toString().slice(2)}-${data.getMonth() + 1}-${data.getDate()}`}</div>
      </div>
      <div className='text-xs my-2 text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap'>发给 {mail.to}</div>
      <div className='text-sm w-[calc(100%-2.8rem)] text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap'>{mail.content}</div>
      <Popconfirm
        title='是否确认删除此邮件'
        onConfirm={e => {
          e?.stopPropagation()
          return onDelete(mail._id) 
        }}
        onCancel={e => {
          e?.stopPropagation()
        }}
        okText='删除'
        cancelText='取消'
      >
        <Button className='absolute right-3 bottom-3' icon={<DeleteOutlined />} onClick={e => {
          e.stopPropagation()
        }} />
      </Popconfirm>
    </div>
  )
}