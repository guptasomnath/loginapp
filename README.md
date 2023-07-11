# Login App
Complete login project using the MERN stack, which includes features such as responsive design, Gmail OTP verification, forgot password functionality, custom access key similar to JWT, and login and signup capabilities


## Features

- Gmail OTP verification
- Forgot password functionality
- Custom access key Generator similar to JWT
- Login and Signup capabilities


# Backend API Documentation
  **--Sign Up Api--**
  
      EndPoint :- "/signup", (ex: API_URL/signup)
      Method : POST,
      Body Params : username, gmail, password,

      Response If Failed:-
      {
        isSuccess: false,
        message: "Failed Message"
      }

      Response If Success:- 
      {
        isSuccess: true,
        message: 'Otp Sended Successfully',
        username : 'your sended username',
        gmail : 'your sended gmail',
        password : 'your sended password'
      }

  **Note**:- If a user is new, the server will automatically send a one-time password (OTP) to the user's Gmail when they click on the signup button. Once the response arrives, you can redirect the user to the OTP submission page. When the user clicks on the "Verify OTP" button, you can call the verifyotp API, which will be explained in the next section.

  **--Verify OTP Api--**

    EndPoint :- "/verifyotp", (ex: API_URL/verifyotp)
    Method : POST,
    Body Params : username, gmail, password, otp, vtype = "createaccount"

    Response If Failed : -
    {
      isSuccess: false,
      message: "Failed Message"
    }

    Response If Success:- 
    {
        isSuccess: true,
        message: "Your account is created"
    }

**Note**:- When the user clicks on the "Verify OTP" button, you need to send the necessary information in the body parameters. After the verification is completed, the account will be created.

  **--Login OTP Api--**
  
      EndPoint :- "/login", (ex: API_URL/login)
      Method : POST,
      Body Params : gmail, password

      Response If Failed : - 
       { 
          isSuccess: false,
          message: "Failed Message" 
       }

      Response If Success:- 
       {
          isSuccess: true,
          message: `Successfully Login`,
          accessid: AccessKey,
       }


   **--Forgot Password Api--**
   
       EndPoint :- "/verifyotp", (ex: API_URL/verifyotp)
       Method : POST,
       Body Params : gmail, otp, newpassword, vtype = "forgotpassword"

       Response If Failed : - 
       { 
          isSuccess: false,
          message: "Failed Message" 
       }

        Response If Success:- 
        {
            isSuccess: true,
            message: "Password Is Chnaged"
        } 

**Note**:- Since the user wants to change their password, we first need to verify their Gmail. Once the user's Gmail is verified, they can proceed to change the password. When you call this API, make sure to include the necessary information in the body parameters. Additionally, it's important to create a logic that can send both the OTP and the new password together when calling this API.
