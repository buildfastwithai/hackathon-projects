import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar'
import { Route, Routes } from "react-router-dom"
import { useSelector } from 'react-redux'
import Article from './pages/article'
import Community from './pages/community'
import Quiz from './pages/quiz'
import Chatbot from './pages/chatbot'

function App() {
  

  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-70% to-green-950'>
      <div>
        <Navbar/>
      </div>
      {/* pages */}
      <Routes>
        <Route path='/' element={<Article />}/>
        <Route path='/community' element={<Community />}/>
        <Route path='/quizgen' element={<Quiz />}/>
        <Route path='/chatbot' element={<Chatbot />}/>
      </Routes>
      {/* <div>hello</div> */}
    </div>
  )
}

export default App
