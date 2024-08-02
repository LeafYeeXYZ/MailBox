'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppstoreOutlined, FileAddOutlined, FileDoneOutlined, IdcardOutlined, DisconnectOutlined } from '@ant-design/icons'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState('')
  useEffect(() => {
    setUsername(localStorage.getItem('username') ?? sessionStorage.getItem('username') ?? '')
  }, [])
  return (
    <div
      style={{ scrollbarWidth: 'none' }} 
      className='relative flex flex-row sm:flex-col gap-1 sm:gap-3 w-full h-full overflow-y-auto'
    >
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/inbox' ? 'text-rose-400' : 'text-gray-500'}`} href='/inbox'><AppstoreOutlined /> 收件箱</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/send' ? 'text-rose-400' : 'text-gray-500'}`} href='/send'><FileAddOutlined /> 新邮件</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/sent' ? 'text-rose-400' : 'text-gray-500'}`} href='/sent'><FileDoneOutlined /> 已发送</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full sm:absolute sm:bottom-[3.15rem] ${pathname === '/profile' ? 'text-rose-400' : 'text-gray-500'}`} href='/profile'><IdcardOutlined /> 账号</Link>
      <a className='bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full sm:absolute sm:bottom-0 text-gray-500' href='#'
        onClick={event => {
          event.preventDefault()
          localStorage.clear()
          sessionStorage.clear()
          router.push('/login')
        }}
      ><DisconnectOutlined /> 注销</a>
      <p className='bg-white shadow-sm border rounded-full hidden sm:block absolute bottom-[6.5rem] overflow-hidden text-ellipsis text-nowrap w-full text-center text-xs font-bold text-gray-500 p-2'>你好, {username}</p>
    </div>
  )
}