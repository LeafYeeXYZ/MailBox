import type { Metadata, Viewport } from 'next'
import './tailwind.css'
import { ConfigProvider } from 'antd'

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
          theme={{
            token: {
              colorPrimary: '#ff8080',
              colorText: '#4c0519'
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
