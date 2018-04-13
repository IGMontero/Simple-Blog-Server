const mongoose = require('mongoose');
const User = require('../models/User');
const Post  = require('../models/Post');

exports.isLoggedIn = (req,res,next) => {
  if(req.session.userId){
    return next();
  }else{
    return res.status(401).json({
      message: 'user not logged in'
    });
  }
}

exports.isPostAuthor = (req,res,next) => {
  if(!req.session.userId){
    return res.status(401).json({
      message : 'user not logged in'
    });
  }
  //Search for the post
  console.log(req.params.id);

  Post.findOne({_id : req.params.id} )
  .populate('author')
  .exec( (err,post) => {
    if(err){
      return res.status(500).json({
        message : 'post not found'
      });
    }

    //Check if the authenticated user is the post owner.
    if(post.author && post.author._id.equals(req.session.userId)){
      next();
    }else{
      return res.status(401).json({
        message : 'not authorized to do that'
      });
    }

  });

  }
