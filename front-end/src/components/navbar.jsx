import React from 'react'


const navbar = () => {
  return (
    <div className='w-full flex justify-between h-20 px-5 items-center bg-gray-200 shadow'>
      <div className='w-[10%] h-full flex items-center h-full'><h1 className='font-bold text-2xl text-zinc-1000'>LOGO</h1></div>
      <div className='w-[50%] h-full '>
        <ul className='w-full h-full flex  gap-6 list-none text-zinc-800 font-medium  items-center '>
            <li className='cursor-pointer'>HOME</li>
            <li className='cursor-pointer'>ABOUT</li>
            <li className='cursor-pointer'>CONTACT</li>
            

        </ul> 
      </div>
    </div>
  )
}

export default navbar