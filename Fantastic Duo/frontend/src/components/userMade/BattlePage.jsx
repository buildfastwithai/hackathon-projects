import { useAuth } from "@/AuthContext"
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom"


const BattlePage = () => {

  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();


  const handleCreateBattle = ()=>{
    
    if(!isAuthenticated){
      navigate('/');
    }
    else{
      navigate('/createbattle');
    }
  }

  const handleJoinBattle = ()=>{

    if(!isAuthenticated){
      navigate('/');
    }
    else{
      navigate('/joinbattle')
    }
  }
  const handleBackButton = ()=>{
      navigate('/')    
  }

  return (
    <div className="max-w-screen pb-[11vw] ">

        <div className="text-center">
        <div onClick={handleBackButton} className='p-4 active:scale-105 rounded-full transition-all hoverease-in duration-150 hover:bg-gray-100 text-[2vw] absolute'><BiArrowBack/></div>
                <h2 className="text-[4vw] font-bold text-[#3565EC]">Battle <span className='text-yellow-500'>Arena</span></h2>
        </div>

            <div className="flex justify-center gap-[8vw]">
            <div className="flex flex-col items-center font-bold text-[2vw]">
            <img onClick={handleCreateBattle} className="hover:drop-shadow-2xl active:scale-[0.7] transition-all ease-in duration-200 scale-75" src="./images/createBattle.png" alt="" />
            <h2 className="text-[#F47F2F]">Create Battle</h2>
            </div>
            <div className="flex flex-col items-center font-bold text-[2vw]">
            <img onClick={handleJoinBattle} className="hover:drop-shadow-2xl active:scale-[0.7] transition-all ease-in duration-200 scale-75" src="./images/joinBattle.png" alt="" />
            <h2 className="text-[#F47F2F]">Join Battle</h2>
            </div>
        </div>
    </div>
  )
}

export default BattlePage