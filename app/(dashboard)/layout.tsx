import { Nav } from './components/Nav'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className='flex sm:flex-row align-center justify-center h-dvh w-dvw bg-gray-50 dark:bg-gray-950'
    >
      <div
        className='w-40 h-full py-6 pl-4 bg-gray-50 dark:bg-gray-950'
      >
        <Nav />
      </div>
      <div
        className='w-[calc(100%-10rem)] h-full py-4 pl-4 pr-5 bg-gray-50 dark:bg-gray-950'
      >
        <div
          className='w-full h-full bg-white dark:bg-gray-950 rounded-2xl border shadow-sm p-4'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

