const mongoose = require("mongoose");

exports.connectDb = async () => {
    await mongoose.connect(process.env.DBURL);
    console.log("Db Connected");
};

//databse schema
const usersSchems = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
  
    gmail: {
      type: String,
      required: true,
    },
  
    password: {
      type: String,
      required: true,
    },
  
    accessid: {
      type: String,
      required: true,
    },
});

exports.UsersModle = mongoose.model("Users", usersSchems);
