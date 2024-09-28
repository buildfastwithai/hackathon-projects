import React, { useEffect, useState } from 'react';

const Timer = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // Update timeLeft every second
  useEffect(() => {
    if (timeLeft === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Calculate percentage and stroke-dashoffset for the circle fill
  const percentage = (timeLeft / initialTime) * 100;
  const strokeDashoffset = (percentage / 100) * circumference - circumference;

  // Format time in mm:ss format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='absolute right-5 top-5'>
 <div className="relative w-[30vw] h-[34vw] flex justify-center items-center">
      <svg width="200" height="200">
        <circle
          className="fill-none stroke-gray-300"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="10"
        />
        <circle
          className="fill-none stroke-blue-500 stroke-linecap-round transform rotate-[-90deg] origin-center transition-all duration-1000"
          cx="100"
          cy="100"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute text-2xl font-bold text-gray-800">
        {formatTime(timeLeft)}
      </div>
    </div>

    </div>
   
  );
};

export default Timer;
