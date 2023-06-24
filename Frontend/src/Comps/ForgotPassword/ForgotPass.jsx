import React, {useContext} from "react";
import axios from 'axios';
import "./ForgotPass.css";
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { baseName, hostUrl } from '../../App';
import { LoadingContext } from "../../App";

function ForgotPass() {

  const {loadingState, setLoadingState} = useContext(LoadingContext);

  const loadingProgress = (displayProp) => {
    setLoadingState({
      display : displayProp
    });
  }

  const [state, setState] = useState({
      gmailInputDisplay : 'block',
      otpInputDisplay : 'none',
      newPassInputDisplay : 'none',
      buttonText : 'Verify Email'
  });
  
  const emailRef = useRef();
  const otpRef = useRef();
  const newPassRef = useRef();
  const navigate = useNavigate();

  const onBtnClicked = async () => {

  if(state.buttonText == "Verify Email"){

    if (emailRef.current.value.trim() == "") {
      alert("Enter your email");
      return;
    }

    if (!emailRef.current.value.trim().includes("@gmail.com")) {
      alert("Enter a valid email");
      return;
    }

    sendOtp();
    return;

  }

  if(state.buttonText == "Verify OTP"){
    verifyOtp();
    return;
  }

  };
  

  async function verifyOtp(){
    loadingProgress('flex'); //show loading progress
    const verifyOtpRes = await axios.post(hostUrl + '/verifyotp',{
       gmail : emailRef.current.value,
       otp : otpRef.current.value,
       vtype : 'forgotpassword',
       newpassword : newPassRef.current.value
     }); 

     if(verifyOtpRes.data.isSuccess){
      alert(verifyOtpRes.data.message);
      navigate(baseName);
      loadingProgress('none'); //hide loading progress
      return;
     }

     alert(verifyOtpRes.data.message);
     loadingProgress('none'); //hide loading progress

  }

  async function sendOtp (){
    loadingProgress('flex'); //show loading progress
    const otpRes = await axios.post(hostUrl + '/sendotp',{
    gmail : emailRef.current.value,
    vtype : 'createaccount'
  });

  if(otpRes.data.isSuccess){
    //visiable the otp input
    alert('Otp Sended Successfully');
    setState({
      gmailInputDisplay : 'none',
      otpInputDisplay : 'block',
      newPassInputDisplay : 'block',
      buttonText : 'Verify OTP'
    });
    loadingProgress('none'); //hide loading progress

    return;
  }
  }

  return (
    <div className="forgotPassDiv">
      <div className="inputDiv">
        <input
          style={{display : state.gmailInputDisplay}}
          ref={emailRef}
          type="text"
          placeholder="Enter Email"
        />
        <input
          style={{display : state.otpInputDisplay}}
          ref={otpRef}
          type="text"
          placeholder="Enter OTP"
        />
        <input
          style={{display : state.newPassInputDisplay}}
          ref={newPassRef}
          type="text"
          placeholder="New Password"
        />
        <button onClick={onBtnClicked}>{state.buttonText}</button>
      </div>
    </div>
  );
}

export default ForgotPass;
