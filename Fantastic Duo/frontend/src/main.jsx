import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <Router>
    <App />
    </Router>
    </AuthProvider>
  </StrictMode>,
)
