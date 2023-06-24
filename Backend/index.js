const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

const usersR = require('./routers/usersR');
const database = require('./database/database');


database.connectDb();

//middlewares
app.use(express.json());
app.use(cors());
app.use('/', usersR.userRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}..`));