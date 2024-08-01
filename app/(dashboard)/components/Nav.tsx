'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppstoreOutlined, FileAddOutlined, FileDoneOutlined, IdcardOutlined, DisconnectOutlined } from '@ant-design/icons'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div
      style={{ scrollbarWidth: 'none' }} 
      className='relative flex flex-row sm:flex-col gap-1 sm:gap-3 w-full h-full overflow-y-auto'
    >
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/inbox' ? 'text-rose-400' : 'text-gray-500'}`} href='/inbox'><AppstoreOutlined /> 收件箱</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/send' ? 'text-rose-400' : 'text-gray-500'}`} href='/send'><FileAddOutlined /> 新邮件</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full ${pathname === '/sent' ? 'text-rose-400' : 'text-gray-500'}`} href='/sent'><FileDoneOutlined /> 已发送</Link>
      <Link className={`bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full sm:absolute sm:bottom-[3.2rem] ${pathname === '/profile' ? 'text-rose-400' : 'text-gray-500'}`} href='/profile'><IdcardOutlined /> 账号</Link>
      <a className='bg-white text-nowrap shadow-sm w-full border text-xs sm:text-sm p-2 text-center rounded-full sm:absolute sm:bottom-0 text-gray-500' href='#'
        onClick={event => {
          event.preventDefault()
          localStorage.clear()
          sessionStorage.clear()
          router.push('/login')
        }}
      ><DisconnectOutlined /> 退出登录</a>
    </div>
  )
}