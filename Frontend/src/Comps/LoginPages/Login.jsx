import React, { useEffect, useRef, useContext } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

import { useState } from "react";
import { baseName, hostUrl } from '../../App';

import { LoadingContext } from "../../App";

export const userDatas = {};
export let isChecked = false;

function Login() {
  const [state, setState] = useState({
    signInOrSignUpTitle: "Sign in",
    signInOrSignUpSubtitle: "create an account",
    buttonText: "Sign in",
    forgotLblDisplay: "block",
    userNameTextBoxDisplay: "none",
  });
  const userNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const {loadingState, setLoadingState} = useContext(LoadingContext);

  const loadingProgress = (displayProp) => {
    setLoadingState({
      display : displayProp
    });
  }

  useEffect(()=>{
  
  if(localStorage.getItem('isLogin') == "true" || sessionStorage.getItem('singleLogin') == "true"){
      //localStorage.removeItem('singleLogin');
      navigate(baseName);
   }
 
  },[]);


  //when create account btn clicked
  const createAccountBtnClicked = () => {
    setState({
      signInOrSignUpTitle:
        state.signInOrSignUpTitle == "Sign in" ? "Sign up" : "Sign in",
      signInOrSignUpSubtitle:
        state.signInOrSignUpSubtitle == "create an account"
          ? "login with an account"
          : "create an account",
      buttonText: state.buttonText == "Sign in" ? "Verify Email" : "Sign in",
      forgotLblDisplay: state.forgotLblDisplay == "block" ? "none" : "block",
      userNameTextBoxDisplay:
        state.userNameTextBoxDisplay == "none" ? "block" : "none",
    });
  };
  //when sign in or sign up btn clicked
  const onSignBtnClicked = () => {
    const uUserName = userNameRef.current.value;
    const uGmail = emailRef.current.value;
    const uPassword = passwordRef.current.value;

    //check the validation
    if (!uGmail) {
      alert("Enter you email");
      return;
    }
    if (!uPassword) {
      alert("Enter you password");
      return;
    }

    //if button clicked for create account
    if (state.buttonText == "Verify Email") {
      if (!uUserName) {
        alert("Enter you username");
        return;
      }

      //if validation is success for creating account
      loadingProgress('flex'); //show loading progress
      axios 
        .post(hostUrl + "/signup", {
          username: uUserName,
          gmail: uGmail,
          password: uPassword,
        })
        .then((res) => {
          if (res.data.isSuccess) {
            alert(res.data.message);
            //show otp page
            userDatas.username = res.data.username;
            userDatas.gmail = res.data.gmail;
            userDatas.password = res.data.password;
            navigate(baseName + 'otp');
            loadingProgress('none'); //hide loading progress
          } else {
            loadingProgress('none'); //hide loading progress
            alert(res.data.message);
          }
        })
        .catch((err) => {
          loadingProgress('none'); //hide loading progress
          alert(err.response.data.message);
        });

      return;
    }

    //if button clicked for sign in
    //if validation is success for login account
    loadingProgress('flex'); //show loading progress
    axios
      .post(hostUrl + "/login", {
        gmail: uGmail,
        password: uPassword,
      })
      .then((res) => {
        if(res.data.isSuccess){
          //navigate('/loginapp/');
          alert(res.data.message);
          window.location.reload();
          //check is Remember me check or not
          
          if(isChecked){
            localStorage.setItem('isLogin', true);
          }
          sessionStorage.setItem('singleLogin', true);
          loadingProgress('none'); //hide loading progress
        }else{
          loadingProgress('none'); //hide loading progress
          alert(res.data.message);
        }
      })
      .catch((err) => {
        loadingProgress('none'); //hide loading progress
        console.log(err);
      });
  };

  const onCheckBoxChange = (e) => {
    isChecked = e.target.checked;
  }

  return (
    <div className="mainLoginLayout">
      <div className="loginDiv">
        <div className="loginTitle">
          <h2>{state.signInOrSignUpTitle}</h2>
          <p>
            or{" "}
            <a onClick={createAccountBtnClicked}>
              {state.signInOrSignUpSubtitle}
            </a>
          </p>
        </div>
        <div className="loginInputDiv">
          <input
            style={{ display: state.userNameTextBoxDisplay }}
            ref={userNameRef}
            type="text"
            placeholder="Username"
          />
          <input ref={emailRef} type="text" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
        </div>
        <label style={{display : state.buttonText == "Sign in" ? "flex" : "none"}} className="checkboxLbl">
          <input onChange={onCheckBoxChange} type="checkbox" />
          Remember me
        </label>
        <button onClick={onSignBtnClicked} className="signBtn">
          {state.buttonText}
        </button>
        {/* <button style={{display: "none"}} className="signwithgoogleBtn">
          <img src={gIcon} />
          Sign in with Google
  </button> */}
        <Link
          style={{ display: state.forgotLblDisplay }}
          to={baseName + "forgotpass"}
          className="forgotPasLbl"
        >
          Forgotten your password?
        </Link>
      </div>
    </div>
  );
}

export default Login;
