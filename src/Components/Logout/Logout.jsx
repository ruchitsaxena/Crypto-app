import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-hot-toast';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth).then(() => {
      
      navigate('/');

    }).catch((error) => {
      console.error('Logout Error:', error);
      toast.error('Failed to log out');
    });
  }, []); 
  

  return (
    <div>    
        <p>Logging out...</p>    
    </div>
  );  
}

export default Logout;
