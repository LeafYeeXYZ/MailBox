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
      className='relative flex flex-col gap-3 w-full h-full'
    >
      <Link className={`bg-white shadow-sm w-full border text-sm p-2 text-center rounded-full ${pathname === '/inbox' ? 'text-rose-400' : 'text-gray-500'}`} href='/inbox'><AppstoreOutlined /> 收件箱</Link>
      <Link className={`bg-white shadow-sm w-full border text-sm p-2 text-center rounded-full ${pathname === '/send' ? 'text-rose-400' : 'text-gray-500'}`} href='/send'><FileAddOutlined /> 新邮件</Link>
      <Link className={`bg-white shadow-sm w-full border text-sm p-2 text-center rounded-full ${pathname === '/sent' ? 'text-rose-400' : 'text-gray-500'}`} href='/sent'><FileDoneOutlined /> 已发送</Link>
      <Link className={`bg-white shadow-sm w-full border text-sm p-2 text-center rounded-full absolute bottom-[3.2rem] ${pathname === '/profile' ? 'text-rose-400' : 'text-gray-500'}`} href='/profile'><IdcardOutlined /> 个人信息</Link>
      <a className='bg-white shadow-sm w-full border text-sm p-2 text-center rounded-full absolute bottom-0 text-gray-500' href='#'
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