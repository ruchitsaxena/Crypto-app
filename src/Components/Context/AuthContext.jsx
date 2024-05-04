import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import logo from './Pi42.png'; 

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', textAlign: 'center' }}>
        <img src={logo} alt="Pi42 Logo" style={{ width: '100px', height: 'auto' }} />
      </div>
    </AuthContext.Provider>
  );
}
