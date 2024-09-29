import React from "react";
import { Link } from "react-router-dom";
import "../style/home.css";

const HomePage = () => {
  return (
    <div className="landing-section">
      <div className="portal-effect"></div>
      <div>
        <h1 className="landing-title">
          Guiding you through new realms with clarity and insight
        </h1>
        <p className="landing-subtitle">
          Unveil the power <em>Gen Ai</em>
        </p>
        <button className="button">
          <Link className="begin" to="/chat">
            Begin
          </Link>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
