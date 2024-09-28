import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; // Adjust the path as necessary
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


const Navbar = ({isAuthenticated, username, toggleLoginModal, handleLogout}) => {

  const navigate = useNavigate();
  const handleImageClick = ()=>{
    navigate('/');
  }
  return (
    <div className='flex justify-between items-center px-7 w-[100%] mx-auto bg-[#F2F3F3] h-[6vw] '>
    <div className='h-full w-full flex items-center gap-3'>
      <img onClick={handleImageClick} src="./images/mindwars.png" className='hover:cursor-pointer h-[50%]' alt="" />
      <img onClick={handleImageClick} className='h-[30%] hover:cursor-pointer ' src="https://see.fontimg.com/api/rf5/DGRW/MTNmYjZiN2U1NjRlNDM1MGE1OTgzOWRiZGFmMzgxNTIudHRm/TWluZFdhcnMgQWk/star-jedi.png?r=fs&h=81&w=1250&fg=0C0B0B&bg=FFFFFF&tb=1&s=65" alt="Star Wars fonts"/>
    </div>

    {isAuthenticated ? (
      <div className='flex font-bold text-[1.5vw] items-center gap-2'>
        <span className='text-black px-5 flex items-center gap-4'>
              <Avatar className='h-[3vw] w-[3vw]'>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
          {username || 'User'}</span> {/* Display username */}
        <button onClick={handleLogout} className='px-4 py-2 text-[1vw] bg-[#3565EC] text-white hover:text-black hover:bg-gray-200 hover:drop-shadow-lg opacity-90 font-bold rounded-xl'>Logout</button>
      </div>
    ) : (
      <button onClick={toggleLoginModal} className='px-4 py-2 text-[1vw] bg-[#3565EC] text-white hover:text-black hover:bg-gray-200 hover:drop-shadow-lg opacity-90 font-bold rounded-xl'>Login</button>
    )}
  </div>
  )
}

export default Navbar