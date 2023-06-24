import React, { createContext, useState } from "react";
import "./App.css";
import Login from "./Comps/LoginPages/Login";
import Home from "./Comps/HomePage/Home";
import Otp from "./Comps/OTP/Otp";
import ForgotPass from "./Comps/ForgotPassword/ForgotPass";
import Loading from "./Comps/LoadingProgress/Loading";

import { Route, Routes } from "react-router-dom";

export const hostUrl = "";
export const baseName = "/";
export const LoadingContext = createContext();

function App() {
  const isLogin = localStorage.getItem('isLogin');
  const singleLogin = sessionStorage.getItem('singleLogin');
  const [loadingState, setLoadingState] = useState({
    display : "none"
  });

  return (
  <div className="App">
    <LoadingContext.Provider value={{loadingState : loadingState, setLoadingState : setLoadingState}}>
    <Loading />
    <Routes>
      <Route path={baseName} element = {isLogin == "true" || singleLogin == "true" ? <Home /> : <Login />}/>
      <Route path={baseName + "otp"} element = {<Otp />} />
      <Route path ={baseName + 'forgotpass'} element = {<ForgotPass/>} />
    </Routes>
    </LoadingContext.Provider>
  </div>);
}

export default App;
