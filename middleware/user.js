const mongoose = require('mongoose');
const User = require('../models/User');
const Post  = require('../models/Post');
const _ = require('lodash');

exports.isAccountOwner = (req,res,next) =>{
  const id = req.params.id;
  if(!req.session.userId){
    return res.status(401).json({
      message:'user not logged in'
    });
  }else{
  if(_.isEqual(id,req.session.userId)){
    return next();
  }else{
    return res.status(401).json({
      message : 'not authorized to do that'
    });
  }
}
}

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
