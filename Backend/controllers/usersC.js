const axios = require("axios");
const ped = require("../ped");
const database = require('../database/database');
const hostUrl = process.env.HOST_URL;



const Users = database.UsersModle;
const otps = [];

//This is the Login Api Controller
exports.login = async (req, res) => {
    const uGmail = req.body.gmail;
    const uPassword = req.body.password;
  
    //validate body datas
    if (!uGmail) {
      res.status(200).json({ isSuccess: false, message: "gmail is required" });
      return;
    }
  
    if (uGmail.includes("@gmail.com") == false) {
      res.status(200).json({ isSuccess: false, message: "enter a valid gmail" });
      return;
    }
  
    if (!uPassword) {
      res.status(200).json({ isSuccess: false, message: "password is required" });
      return;
    }
  
    //check is the gmail is avilable of not in the database
    const userData = await Users.findOne({ gmail: uGmail });
    if (!userData) {
      res
        .status(200)
        .json({ isSuccess: false, message: `You don't have any account` });
      return;
    }
  
    //check the password
    if (ped.decode(userData.password) != uPassword) {
      res.status(200).json({ isSuccess: false, message: `Password is wrong` });
      return;
    }
    
    //if all the detais is write then change the access id
    const rendomAccessId = ped.randomKey(30);
    Users.findOneAndUpdate({ _id: userData._id }, { accessid: rendomAccessId })
      .then(() => {
        res.status(200).json({
          isSuccess: true,
          message: `Successfully Login`,
          accessid: rendomAccessId,
        });
      })
      .catch((err) => {
        res.status(200).json({ isSuccess: false, message: err.message });
      });
}

//This is the Signup Api Controller
exports.signup = async (req, res) => {
    const uUserName = req.body.username;
    const uGmail = req.body.gmail;
    const uPassword = req.body.password;
    const reqType = req.body.reqType;
  
    //check the validation is all fild came of not
    if (!uUserName) {
      res.status(200).json({ isSuccess: false, message: "username is required" });
      return;
    }
  
    if (uGmail.includes("@gmail.com") == false) {
      res.status(200).json({ isSuccess: false, message: "enter a valid gmail" });
      return;
    }
  
    if (!uPassword) {
      res.status(200).json({ isSuccess: false, message: "password is required" });
      return;
    }
  
    //check is the username or user gmail is already avilable in db or not
    const quaryData = await Users.findOne({
      $or: [{ gmail: uGmail }, { username: uUserName }],
    });
  
    if (!quaryData && !reqType) { //if user don't already registered
  
      //verify the user email
      try {
        const otpRes = await axios.post(hostUrl + "/sendotp", {
          gmail: uGmail,
        });
        
        if(otpRes.data.isSuccess == true){ //otp sended
          
          res.status(200).json({ isSuccess: true, message: 'Otp Sended Successfully', username : uUserName, gmail : uGmail, password : uPassword});
          return;
  
        }else{
          res.status(200).json({ isSuccess: false, message: 'Problem while sending otp' });
          return;
        }
  
      } catch (err) {
        res.status(200).json({ isSuccess: false, message: err });
        return;
      }
    }
  
    if(!quaryData && reqType != ''){
      //create a new user
     Users.create({
      username: uUserName,
      gmail: uGmail,
      password: ped.encode(uPassword),
      accessid: ped.randomKey(30),
    })
      .then(() => {
        res
          .status(200)
          .json({ isSuccess: true, message: "Your account is created" });
      })
      .catch((err) => {
        res.status(400).json({ isSuccess: false, message: err.message });
      });
  
      return;
    }
  
    //check which data is already avilable in database
    if (quaryData.gmail == uGmail) { //if user is already register
      res
        .status(200)
        .json({ isSuccess: false, message: "This gmail is already exist" });
      return;
    }
    if (quaryData.username == uUserName) {
      res
        .status(200)
        .json({ isSuccess: false, message: "This username is already exist" });
      return;
    }
  
}

//This is the Send Otp Api Controller
exports.sendOtp = async (req, res) => {
    const toEmail = req.body.gmail;
  
    //check the validation is all fild came of not
    if (!toEmail) {
      res.status(200).json({ isSuccess: false, message: "gmail is required" });
      return;
    }
  
    if (toEmail.includes("@gmail.com") == false) {
      res.status(200).json({ isSuccess: false, message: "enter a valid email" });
      return;
    }
    const myOtp = Math.floor(1000 + Math.random() * 9000);
	console.log(myOtp);
    otps.push({
      email: toEmail,
      otp: myOtp,
    });
    
    const eApi = process.env.OTP_SCRIPT;
  
    try {
      const gotData = await axios.get(
        `${eApi}?toEmail=${toEmail}&subject=OTP%20From%20Simple%20Login%20App&body=This%20is%20your%20OTP%20:-%20%20${myOtp}`
      );
      res.status(200).json({ isSuccess: true, message: "Otp Sended Successfuly" });
    } catch (err) {
      res.status(200).json({ isSuccess: true, message: "Otp Sended Successfuly" });
    }
}

//This is the verify Otp Api Controller
exports.verifyOtp = async (req, res) => {
    const toEmail = req.body.gmail;
    const userOtp = req.body.otp;
    const uPassword = req.body.password;
    const uUserName = req.body.username;
    const verifyType = req.body.vtype;
    const newPassword = req.body.newpassword;
  
    if (!toEmail) {
      res.status(200).json({ isSuccess: false, message: "'gmail' is required" });
      return;
    }
  
    if (toEmail.includes("@gmail.com") == false) {
      res.status(200).json({ isSuccess: false, message: "Enter a valid email" });
      return;
    }
  
    if (!userOtp) {
      res.status(200).json({ isSuccess: false, message: "'otp' is required" });
      return;
    }
  
    if(!verifyType){
      res.status(200).json({ isSuccess: false, message: "vtype is required" });
      return;
    }
  
    const foundObj = otps.find((items) => items.email == toEmail);
  
  
    if (foundObj == undefined) {
      res.status(200).json({ isSuccess: false, message: "Send a otp first" });
      return;
    }


    if (foundObj.otp == userOtp) {
      //after verification completed i am going to store user data to db
  
     if(verifyType == "forgotpassword"){
  
       if(!newPassword){
        res.status(200).json({ isSuccess: false, message: "newpassword is required" });
        return;
       }
        //delete the otp form otps array and send response
        otps.splice(otps.lastIndexOf(foundObj), 1);
        forgotPassword({toEmail: toEmail, newPassword : newPassword}, req, res);
        return;
  
     }
     
     if(verifyType == "createaccount"){
      //delete the otp form otps array and call sign up api
      otps.splice(otps.lastIndexOf(foundObj), 1);

      //call sign up api
     
      const signUpRes =  await axios.post(hostUrl + '/signup',{
        username : uUserName,
        gmail : toEmail,
        password : uPassword,
        reqType : 'verifyComplete'
      });
  
       res.status(200).json(signUpRes.data);
  
       return;
     }
  
     
     res.status(200).json({ isSuccess: false, message: "vtype is not correct" });
   
    }else{
      res.status(200).json({ isSuccess: false, message: "This otp is wrong" });
    }
  
}

//Thisiis an extra function
async function forgotPassword(data, req, res){
    const updatePass = await Users.findOneAndUpdate({ gmail: data.toEmail }, { password: ped.encode(data.newPassword),  accessid : ped.randomKey(30)});
    if(!updatePass){
      res.status(200).json({ isSuccess: false, message: "Your Account Is Not Exist With This Gmail" });
      return;
    }
    res.status(200).json({ isSuccess: true, message: "Password Is Chnaged" });
}