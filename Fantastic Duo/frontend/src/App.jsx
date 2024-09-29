import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Adjust the path as necessary

import Navbar from './components/userMade/navbar'
import Footer from './components/userMade/Footer';
import CreateBattle from './components/userMade/CreateBattle';
import LandingPage from './components/userMade/LandingPage';
import BattlePage from './components/userMade/BattlePage';
import LoginSignupModal from './components/modals/loginSignupModal';
import JoinBattle from './components/userMade/JoinBattle';

import { Routes, Route, Navigate } from 'react-router-dom'; // No need for Router now
import { Bounce, ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LeaderBoard from './components/userMade/LeaderBoard';
import QuizPage from './components/userMade/QuizPage';
import ResultQuiz from './components/userMade/ResultQuiz';
import Loading from './components/loading/Loading';

const App = () => { 
  const { login, logout, isAuthenticated } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [loginValue, setLoginValue] = useState(false);

  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/login', {
          identifier,
          password: passwordLogin,
        });
        setLoading(false);
        alert(response.data.message);
        // Use the login function from context
        login(response.data.token, response.data.username); 
        setLoginValue(false);
    } catch (error) {
        alert(error.response?.data?.message || "An error occurred");
    }
  };
  

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password: passwordSignup,
      });
      setLoading(false);
      alert(response.data.message);
      setLoginValue(false);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const toggleLoginModal = () => {
    setLoginValue(prev => !prev);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUsername(''); // Reset username state on logout
        logout(); // Call the logout function from context
    }
  };
  

  
  const notify = () => toast("Please login first to start a battle");


  const PrivateRoute = ({ element, ...rest }) => {
    if(!isAuthenticated){
      return<Navigate to="/" />
    }
    return element ;
  };


  

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [isAuthenticated]); // You can remove this if you rely entirely on context
  

  return (
    <div className="main min-h-screen max-w-screen pt-[0.1px]">
      
<ToastContainer
position="bottom-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover={false}
theme="light"
transition= {Bounce}
/>

      <Navbar 
      isAuthenticated={isAuthenticated}
      toggleLoginModal={toggleLoginModal}
      username={username}
      handleLogout={handleLogout}
      />


      {/*  */}
          <Routes>
          <Route path="/" element={<LandingPage notify={notify} />} />
          <Route path="/battlepage" element={<PrivateRoute element={<BattlePage />} />} />
          <Route path="/createbattle" element={<PrivateRoute element={<CreateBattle/>}/>}/>
          <Route path="/joinbattle" element={<PrivateRoute element={<JoinBattle/>}/>}/>
          <Route path="/leaderboard/:quiz_id" element={<PrivateRoute element={<LeaderBoard/>}/>}/>
          <Route path="/quiz/:quiz_id" element={<PrivateRoute element={<QuizPage/>}/>}/>
          <Route path="/result/:quiz_id/:username" element={<PrivateRoute element={<ResultQuiz/>}/>}/>
        </Routes>

      {/*  */}

      {loading && (
                // Loading spinner overlay
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <Loading type="bars" color="#3565EC" />
                </div>
            )}
    {loginValue && 
    <LoginSignupModal handleLogin={handleLogin} 
        setPasswordLogin={setPasswordLogin} 
        setIdentifier={setIdentifier} 
        handleSignup={handleSignup} 
        setPasswordSignup={setPasswordSignup} 
        setUsername={setUsername} 
        setEmail={setEmail} 
        setlogin={setLoginValue}
      />}

      <Footer/>
    </div>
  );
};

export default App;
