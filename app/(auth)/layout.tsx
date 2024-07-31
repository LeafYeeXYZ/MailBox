export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className='flex items-center justify-center h-dvh w-dvw bg-gray-50 dark:bg-gray-950'
    >
      <div
        className='w-[95%] h-[95%] max-w-[45rem] max-h-[30rem] flex flex-row gap-4 p-4 bg-white rounded-lg shadow-lg'
      >
        <div
          className='hidden sm:block sm:w-3/5 h-full rounded-lg bg-red-50'
        >

        </div>
        <div
          className='w-full sm:w-2/5 h-full rounded-lg bg-white'
        >
          {children}
        </div>
      </div>
    </div>
  )
}