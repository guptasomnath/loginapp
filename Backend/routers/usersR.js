const express = require('express');
const usersC = require('../controllers/usersC');
const userRouter = express.Router();

userRouter.post("/login", usersC.login)
.post("/signup", usersC.signup)
.post("/sendotp", usersC.sendOtp)
.post("/verifyotp", usersC.verifyOtp);

exports.userRouter = userRouter;