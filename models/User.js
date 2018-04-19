const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName : {
    type:String,
    required:true,
    trim:true
  },
  lastName : {
    type:String,
    required:true,
    trim:true
  },
  email : {
    type: String,
    unique : true,
    required: true,
    trim : true
  },
  username : {
    type: String,
    unique : true,
    required : true,
    trim : true
  },
  description : {
    type:String,
  },
  profileImage: {
    type:String
  },
  interestTopics : [{
    type:String
  }],
  password : {
    type: String,
    required: true
  },
  posts : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Post"
  }]
})

module.exports = mongoose.model('User',userSchema);
