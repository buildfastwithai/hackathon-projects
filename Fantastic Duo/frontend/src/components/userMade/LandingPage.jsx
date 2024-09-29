import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthContext";



const LandingPage = ({notify}) => {
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const handleContestPage = () => {
    if (isAuthenticated) {
      navigate('/battlepage');
    } else {
      console.log('Not authenticated. Showing toast...');
      notify();
    }
  };

  return (
    <>
      <div className='flex items-center flex-row gap-[1.5vw] pt-[3vw] w-[90%] mx-auto'>
        <h1 className='text-[#3565EC] w-[70%] text-[5vw] font-[900] leading-[5vw]'>
          Join the ultimate AI Quiz Contest! <br />
          <span className='text-yellow-500'>Test your knowledge</span> and <br />
          <span className='text-yellow-500'>show off your skills</span> against others.
        </h1>
        <img src="./images/battle.png" className='h-[70%] w-[25%]' alt="Quiz Contest" />
      </div>

      <div className='w-[90%] pt-[2vw] mx-auto gap-[2vw] flex'>
        <Button onClick={handleContestPage} className='rounded-full font-semibold px-[2vw] text-[1.5vw] py-[1.5vw] bg-[#F47F2F]'>Start Contest</Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='rounded-full font-semibold px-[2vw] text-[1.5vw] py-[1.5vw] bg-[#F47F2F]'>Learn More</Button>
          </SheetTrigger>
          <SheetContent className='w-[80vw]'>
            <SheetHeader>
              <SheetTitle>Learn More</SheetTitle>
              <SheetDescription>
                Join the MindWars AI Quiz Contest: Compete with friends and other participants, answer AI-generated questions, and see how you rank!
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className='flex flex-col items-center mt-[11vw]'>
        <h1 className="text-[#3565EC] font-bold text-[3vw]">Tired of <span className='text-yellow-500'>Traditional Quizzes?</span></h1>
        <p className='text-[1.2vw]'>Join our AI-generated quiz contest, improve your knowledge, and compete against others in a fun and engaging way!</p>
      </div>

      <div className="flex mt-[5vw] flex-row gap-[2.5vw] w-[90%] justify-center mx-auto max-w-screen h-[20vw]">
        <div className="hover:scale-105 duration-100 transition-all ease-out w-[24%] h-[100%] text-white flex flex-col gap-2 justify-center p-[1vw] text-center items-center bg-[#3764EF] rounded-3xl">
          <h2 className="font-bold text-[1.5vw]">Join a Competitive Quiz</h2>
          <p className="text-[1vw]">Test your knowledge against participants and climb the ranks with unique, AI-generated questions.</p>
        </div>
        <div className="hover:scale-105 duration-100 transition-all ease-out w-[24%] h-[100%] text-white flex flex-col gap-2 justify-center p-[1vw] text-center bg-[#FE6376] rounded-3xl">
          <h2 className="font-bold text-[1.5vw]">Analyze Your Performance</h2>
          <p className="text-[1vw]">Receive detailed feedback on your answers and track your progress after every contest.</p>
        </div>
        <div className="hover:scale-105 duration-100 transition-all ease-out w-[24%] h-[100%] text-white flex flex-col gap-2 justify-center p-[1vw] text-center bg-[#01DBAB] rounded-3xl">
          <h2 className="font-bold text-[1.5vw]">Personalized Learning Experience</h2>
          <p className="text-[1vw]">Get tailored quiz recommendations based on your strengths and weaknesses.</p>
        </div>
      </div>

      <div className="mt-[10vw] bg-[#F2F3F3] max-w-screen p-[3vw]">
        <div className="w-[90%] mx-auto flex flex-row gap-[3vw] justify-center items-center">
          <div className="flex flex-col gap-2 w-[40%]">
            <div className="flex gap-2 items-center">
              <Avatar className='h-[4vw] w-[4vw]'>
                <AvatarImage src="./images/arun_avatar2.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h2>Hey, This is Arun</h2>
            </div>
            <p>
              We're thrilled to introduce MindWars AI! This contest is all about pushing your limits and testing your knowledge against friends and others. Get ready for a fun and engaging experience with quizzes tailored to your interests!
            </p>
          </div>

          <div className="flex flex-col gap-2 w-[40%]">
            <div className="flex gap-2 items-center">
              <Avatar className='h-[4vw] w-[4vw]'>
                <AvatarImage src="./images/ashish_avatar2.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h2>It's me, Ashish here!</h2>
            </div>
            <p>
              MindWars AI is for everyone who enjoys a friendly challenge. Our AI-driven quizzes make learning fun and competitive, allowing you to test your skills and gain valuable knowledge. Join us for an exciting journey of learning!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[5vw] max-w-screen h-[90]">
        <div className="flex justify-center w-full flex-col">
          <h2 className="text-[#3565EC] font-bold text-[3vw] text-center">Test Your Knowledge, <span className='text-yellow-500'>Challenge Your Friends!</span></h2>
          <div className="flex items-center w-[80%]">
            <img className="px-[3vw] scale-50 h-[30vw]" src="./images/desktop.png" alt="Desktop" />
            <p>Experience the thrill of competition with MindWars AI, where you can challenge your friends and expand your knowledge through engaging, AI-generated quizzes. Whether you're looking to boost your skills or enjoy some friendly rivalry, our platform makes it easy to connect with others while enhancing your understanding. Gather your friends, embrace your curiosity, and let the quiz battles begin!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
