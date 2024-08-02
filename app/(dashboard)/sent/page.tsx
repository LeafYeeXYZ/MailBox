'use client'

import { Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function Sent() {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className="text-center text-lg font-bold my-4">开发中...</div>
      <Button type='primary' onClick={() => router.push('/login')}>返回登录</Button>
    </div>
  )
}