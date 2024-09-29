import React from 'react';
import { Link } from 'react-router-dom';
import { FaJs, FaGlobe, FaGithub } from 'react-icons/fa'; // Importing icons

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <h1 className="text-5xl font-bold mb-6">
        Welcome to <span className="text-yellow-400 text-6xl font-extrabold underline decoration-blue-500">GenCodeX</span>
      </h1>
      <p className="mb-4 text-gray-400 text-lg text-center max-w-md">
        Explore our features and learn more about JavaScript and Web Development.
      </p>
      
      {/* Main Button Section */}
      <div className="flex flex-col w-full justify-center items-center gap-6 p-4">
        <div className='flex gap-6'>
          <Link to="/js">
            <button className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
              <FaJs className="mr-2" /> Go to JavaScript
            </button>
          </Link>
          <Link to="/web">
            <button className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg">
              <FaGlobe className="mr-2" /> Go to Web Development
            </button>
          </Link>
        </div>
        
        <div>
          <Link to="/js/quiz">
            <button className="flex items-center px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 shadow-lg">
              <FaJs className="mr-2" /> JavaScript Quiz
            </button>
          </Link>
        </div>
      </div>
      
      {/* GitHub Links Section */}
      <div className="flex gap-6 mt-6">
        <a href="https://github.com/sanketshinde3001" target="_blank" rel="noopener noreferrer">
          <button className="flex items-center px-5 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300 shadow-lg">
            <FaGithub className="mr-2" /> Sanket Shinde
          </button>
        </a>
        <a href="https://github.com/Vaishnavi-Raykar" target="_blank" rel="noopener noreferrer">
          <button className="flex items-center px-5 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300 shadow-lg">
            <FaGithub className="mr-2" /> Vaishnavi Raykar
          </button>
        </a>
      </div>
      
      {/* Footer Section */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © 2024 GenCodeX. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;