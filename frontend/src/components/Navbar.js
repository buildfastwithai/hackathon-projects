import React from "react";
import { Link } from "react-router-dom";
import "../style/chat.css";

function Navbar() {
  return (
    <div className="header">
      <Link className="logo" to="/">
        Vidya.ai
      </Link>
      <div className="nav">
        <Link className="link" to="/rag">
          <h6>Rag</h6>
        </Link>

        {/* <Link className="link" to="/assessment">
          <h6>assessment</h6>
        </Link> */}

        <Link className="link" to="/chat">
          <h6>chat</h6>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
