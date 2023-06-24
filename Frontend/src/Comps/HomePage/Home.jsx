import React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import { baseName } from '../../App';

function Home() {
  const navigate = useNavigate();

  const onLogoutBtnClicked = () => {
    localStorage.removeItem('isLogin');
    sessionStorage.removeItem('singleLogin');
    navigate(baseName);
    window.location.reload();
  }
  
  return (
    <div className='HomeDiv'>
         <h1>Welcome To Home Page</h1>
         <button onClick={onLogoutBtnClicked}>Logout</button>
    </div>
  )
}

export default Home