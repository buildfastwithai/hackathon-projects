import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="p-[5vw] bg-[#F2F3F3]  max-w-screen flex items-center justify-between h-[10vw]">

          <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
          <img src="./images/mindwars.png" className='h-[3vw]' alt="" />
          <img className='h-[2vw]' src="https://see.fontimg.com/api/rf5/DGRW/MTNmYjZiN2U1NjRlNDM1MGE1OTgzOWRiZGFmMzgxNTIudHRm/TWluZFdhcnMgQWk/star-jedi.png?r=fs&h=81&w=1250&fg=0C0B0B&bg=FFFFFF&tb=1&s=65" alt="Star Wars fonts"/>
          </div>
          
          <h2 className="text-black opacity-90">Copyright © 2024 - All rights reserved</h2>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-[1.2vw]">Creators</h2>
            <div className="flex flex-col gap-1">
            <div className="">
              <HoverCard>
              <HoverCardTrigger className="hover:underline flex gap-2 items-center"><a className="flex flex-row gap-[0.5vw] items-center" href='https://github.com/PYIArun' target="_blank"><FaGithub />Arun Chandra</a></HoverCardTrigger>
              <HoverCardContent>
              A creative thinker who loves coming up with solutions to tricky tech challenges
              </HoverCardContent>
            </HoverCard>

            </div>
            <div className="">
            <HoverCard>
              <HoverCardTrigger className="hover:underline flex gap-2 items-center"><a className="flex flex-row gap-[0.5vw] items-center" href='https://github.com/ashishsah24' target="_blank"><FaGithub />Ashish Sah</a></HoverCardTrigger>
              <HoverCardContent>
              An explorer in the tech world who loves taking on challenges and learning along the way.
              </HoverCardContent>
            </HoverCard>

            </div>
            </div>

          </div>



      </footer>
  )
}

export default Footer