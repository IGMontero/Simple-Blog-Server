const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  title:String,
  subtitle:String,
  content:String,
  createdAt : {
    type:Date,
    default: Date.now
  },
  image:String,
  generalTopic : String,
  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
  }
});

module.exports = mongoose.model('Post',postSchema);
