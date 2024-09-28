import React, { createContext, useContext, useState } from 'react';

// Create a context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Check if token exists
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    const login = (token, user) => {
        localStorage.setItem('token', token); // Store token in localStorage
        localStorage.setItem('username', user); // Store username in localStorage
        setIsAuthenticated(true);
        setUsername(user); // Update username state
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        localStorage.removeItem('username'); // Remove username from localStorage
        setIsAuthenticated(false);
        setUsername(''); // Reset username state
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
