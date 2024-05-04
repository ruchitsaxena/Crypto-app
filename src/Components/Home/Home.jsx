import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./Home.module.css";
import LoggedInUsers from "../LoggedInUsers/LoggedInUsers"
import { useAuth } from '../Context/AuthContext';


function Home() {

  const { currentUser } = useAuth();

  console.log(currentUser,"curr ")


  return (
    <div className={styles.container}>
      
      <div className={styles.navbar}>

        <div className={styles.navLinks}>
          {currentUser ? (
            <Link to="/logout" className={`${styles.link} ${styles.neonEffect}`}>Logout</Link>
          ) : (
            <>
              <Link to="/login" className={`${styles.link} ${styles.neonEffect}`} style={{ marginRight: '20px' }}>Login</Link>
              <Link to="/signup" className={`${styles.link} ${styles.neonEffect}`}>Signup</Link>
            </>
          )}
        </div>
      </div>
     
      <h1 className={`${styles.heading} `}><span style={{color:"blue"}}>Cryptocurrency</span> Price Tracker Web App</h1>
      <p className={`${styles.message} ${styles.neonEffect}`}>{currentUser ? `Hi ${currentUser?.displayName}, here's the current market overview.` : `To see live prices, kindly login or signup.`}</p>
      {currentUser ? (<LoggedInUsers/>) :(<div></div>)}
    </div>
  );
}


export default Home;
