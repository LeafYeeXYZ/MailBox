import type { Metadata, Viewport } from 'next'
import './tailwind.css'
import { ConfigProvider } from 'antd'
import { lightTheme } from './config'

export const metadata: Metadata = {
  title: 'MailBox',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="zh-CN">
      <body className='overflow-hidden'>
        <ConfigProvider 
          theme={lightTheme}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
