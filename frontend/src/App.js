// src/App.js
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import React from "react";
import DocumentUpload from "./pages/upload";
import DocumentQuery from "./pages/query";
import Navbar from "./components/Navbar";
import Chat from "./pages/chat";
import HomePage from "./pages/home";
import "./App.css";

const DocumentPage = () => {
  return (
    <div>
      <DocumentUpload />
      <DocumentQuery />
    </div>
  );
};

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/rag",
        element: <DocumentPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
