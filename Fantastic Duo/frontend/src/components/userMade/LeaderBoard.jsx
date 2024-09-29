import { TbRefresh } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/AuthContext";
import { IoTimerOutline } from "react-icons/io5";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {quiz_id} = useParams();
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/leaderboard/${quiz_id}`  // Include quiz_id in the API call
        );
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [quiz_id]);

  const handleRefreshButton = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaderboard/${quiz_id}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleBackButton = () => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      navigate("/joinbattle");
    }
  };

  return (
    <div className="max-w-screen">
      <div className="flex h-[42vw]">
        <div className="w-[50%] h-full relative">
          <div
            onClick={handleBackButton}
            className="p-4 active:scale-105 rounded-full transition-all hoverease-in duration-150 hover:bg-gray-100 text-[2vw] absolute"
          >
            <BiArrowBack />
          </div>
          <div className="h-full justify-center flex flex-col items-center">
            <h2 className="leading-[5vw] flex flex-col justify-center items-center text-[5vw] w-full font-bold text-[#3565EC]">
              Quiz Contest <span className="text-yellow-500">Leaderboard.</span>
            </h2>
            <p className="text-[1.5vw] font-semibold w-[65%] text-center">
              Join the AI quiz contest, challenge your skills, climb the
              leaderboard, and win exclusive rewards—are you up for the
              challenge?
            </p>
          </div>
        </div>

        <div className="w-[50%] flex justify-center">
          <Card className="w-[80%] h-[38vw] py-[1vw] border-none drop-shadow-none m-5">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[2vw]">
                  Quiz Leaderboard 🏆🚀
                </CardTitle>
                <TbRefresh
                  onClick={handleRefreshButton}
                  className="text-[2vw] active:scale-[0.9] rounded-full hover:bg-gray-100 p-1"
                />
              </div>
            </CardHeader>
            <CardContent className="h-[30vw] overflow-y-scroll">
              {leaderboard.length > 0 ? (
                leaderboard.map((user, index) => (
                  <Card
                    key={index}
                    className="flex flex-col p-[1vw] mb-[1vw] drop-shadow-none"
                  >
                    <div className="w-full flex items-center">
                      <div className="w-[80%] flex gap-[1vw] font-bold flex-row items-center">
                        Rank {index + 1}
                        <div>
                        <Avatar className='h-[4vw] w-[4vw]'>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                        </div>
                        <div className="flex items-center gap-[1vw]">
                          <h2 className="text-[2vw]">@{user.username}</h2>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex w-[120%]  font-bold items-center justify-end pr-[1vw]">
                          <IoTimerOutline className="" />
                          <h2>{user.time_taken} secs</h2>
                        </div>
                        <h2 className="flex justify-end font-bold text-[1vw]">
                          Score: {user.score}
                        </h2>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="flex justify-center items-center">
                  <h2 className="text-[1vw]">No participants yet!</h2>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
