import React from 'react'
import { CiChat1 } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";

const Chatsidebar = () => {
  const list = [
    {title: "Test Chat - hello  1"},
    {title: "Test Chat - hello  2"},
    {title: "Test Chat - hello  3"},
  ]
  const handleClick = () => {

  }
  const SideChat = ({title}) =>{
    // console.log({title})
    return (
      <div className='flex items-center gap-3 rounded-lg px-4 mt-2 hover:bg-black/30 p-2' role='button'>
        <CiChat1 className='text-white1 text-2xl font-extrabold'/>
        <div className='text-white1 text-lg'>{title}</div>
      </div>
    )
  }
  return (
    <div className=' bg-matte-black2 min-w-[17vw] w-fit rounded min-h-[93vh] flex flex-col justify-between items-center z-10'>
      {/* <div className='text-white'>Chatsidebar</div> */}
      <div>
        {list.map((obj) => (
            <SideChat title={obj.title} />
        ))}
      </div>

      <div onClick={handleClick()} role='button' className='bg-green1 rounded-lg flex items-center text-white text-xl w-fit p-2 px-4 mb-5 gap-2'>
          <IoMdAdd />
          Start New Chat
      </div>
      
    </div>
  )
}

export default Chatsidebar