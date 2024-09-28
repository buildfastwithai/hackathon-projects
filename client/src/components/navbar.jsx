import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
        <div className='relative top-1 z-50 mx-auto w-[99vw] flex justify-between bg-matte-black/50 text-white p-4 rounded-lg'>
            <div>Study Sphere</div>
            <div className='flex gap-8'>
                <div><Link to="/">Articles</Link></div>
                <div><Link to="/community">Communities</Link></div>
                <div><Link to="/quizgen">Quiz Generator</Link></div>
                <div><Link to="/chatbot">Chat With Document</Link></div>
            </div>
            <div className='flex gap-2'>
                <div>Login</div>
                <div>Signup</div>
            </div>
        </div>
    </>
  )
}

export default Navbar