import React, {useRef, useContext} from 'react';
import './Otp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userDatas } from '../LoginPages/Login';

import { isChecked } from '../LoginPages/Login';
import { baseName, hostUrl } from '../../App';

import { LoadingContext } from '../../App';

function Otp() {
  const inputRef = useRef();
  const navigate = useNavigate();
  const {loadingState, setLoadingState} = useContext(LoadingContext);

  const loadingProgress = (displayProp) => {
    setLoadingState({
      display : displayProp
    });
  }

  const onOtpVerifyBtnClicked = async () => {

    loadingProgress('flex'); //show loading progress
    const otpVerifyRes =  await axios.post(hostUrl + '/verifyotp',{
        gmail : userDatas.gmail,
        otp : inputRef.current.value,
        password : userDatas.password,
        username : userDatas.username,
        vtype : 'createaccount'
      });

    if(otpVerifyRes.data.isSuccess){ //if otp is wright
      alert(otpVerifyRes.data.message);
      navigate(baseName);
       if(isChecked){
        localStorage.setItem('isLogin', true);
      }
      
      loadingProgress('none'); //hide loading progress

    }else{
      loadingProgress('none'); //hide loading progress
      alert(otpVerifyRes.data.message);
    }


  }
  return (
    <div className='otpDiv'>
        <div className='form'>
        <input ref={inputRef} type="text" placeholder="Enter OTP" />
        <button onClick={onOtpVerifyBtnClicked}>Verify</button>
        </div>
    </div>
  )
}

export default Otp