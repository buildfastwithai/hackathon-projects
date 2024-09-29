import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Jseditor from "./Jseditor"; // Import your Jseditor component
import Web from "./web";
import LandingPage from "./Home";
import Jsquiz from "./Jsquiz";
// import { CodeProvider } from "./CodeContext";

function App() {
  return (
    <Router>
      <div>
        {/* Routes setup */}
        <Routes>
          <Route path="/web" element={<Web />} />
          <Route path="/js" element={<Jseditor />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/js/quiz" element={<Jsquiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
