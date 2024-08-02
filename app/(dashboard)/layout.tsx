import { Nav } from './components/Nav'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className='flex flex-col sm:flex-row align-center justify-center h-dvh w-dvw bg-gray-50'
    >
      <div
        className='w-full sm:w-40 sm:h-full pl-2 pr-2 pt-2 sm:pt-6 sm:pb-6 sm:pl-4 sm:pr-0 bg-gray-50'
      >
        <Nav />
      </div>
      <div
        className='w-full h-[calc(100%-3rem)] sm:w-[calc(100%-10rem)] sm:h-full py-2 sm:py-4 pl-2 pr-2 sm:pl-4 sm:pr-5 bg-gray-50'
      >
        <div
          className='w-full h-full bg-white rounded-2xl border shadow-sm p-4'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

