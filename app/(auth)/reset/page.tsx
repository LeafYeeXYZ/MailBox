'use client'

import { Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function Reset() {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className="text-center text-lg font-bold">本功能开发中...</div>
      <div className="text-center text-sm my-6 px-6">如需找回账号, 请联系管理员删除原账号, 再重新进行注册, 收发件箱的邮件不会丢失</div>
      <Button type='primary' onClick={() => router.push('/login')}>返回登录</Button>
    </div>
  )
}