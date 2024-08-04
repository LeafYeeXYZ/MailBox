export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  

  return (
    <div
      className='flex items-center justify-center h-dvh w-dvw bg-gray-50'
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
      <div className='absolute bottom-3 left-0 text-gray-400 text-center text-xs w-full'>
        GPL-3.0 License | Github: <a 
          href='https://github.com/LeafYeeXYZ/MailBox' 
          target='_blank'
          className='text-rose-300'
        >LeafYeeXYZ/MailBox</a>
      </div>
    </div>
  )
}