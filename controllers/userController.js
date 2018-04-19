const User = require('../models/User'),
      bcrypt = require('bcrypt-nodejs'),
      _ = require('lodash');


  //Fetch user user data.
  exports.fetchUser = (req,res) =>{
    //Verify if data is missing.
    const userId = req.params.id;
    if(!userId){
      return res.status(409).json({
        message : 'required data missing'
      });
    }

    User.findOne( {_id : userId} )
    .populate('posts')
    .exec( (err,user) => {
      if(err){
        return res.status(500).json({
          message : 'error finding user'
        });
      }
      //Send user data.
      res.json(user);
    });

  }

  //Log out user
  exports.logOutUser = (req,res) => {
    if(req.session){
      //delete session object
      req.session.destroy( (err)=> {
        if(err){
          return res.status(500).json({
            err
          });
        }
         res.status(200).json({
          message : 'user logged out'
        });
      });
    }
  }
  //Log in user
  exports.logInUser = (req,res) => {

    const { email , password } = req.body;

    if(!email||!password){
      return res.status(409).json({
        message : 'required data missing'
      });
    }

    //Verify if the email is correct.
    User.findOne( {email} )
    .exec()
    .then( (foundUser) =>{
      if( !foundUser ){
        return res.status(409).json({
          message: 'user not found'
        });
      }

      //User found.
      //Verify password.
      bcrypt.compare(password,foundUser.password , (err,result) =>{
         if(err){
          return res.status(500).json({
            err
          });
        }

        if(!result){
          return res.status(409).json({
            message: 'invalid password'
          });
        }else{
          //Set session
          req.session.userId = foundUser._id;
          return res.json({
            _id : foundUser._id,
            username : foundUser.username
           });
        }
      });

    });

  }
  //Create new user
  exports.createUser = (req,res) => {

  const { email, username, password , firstName , lastName } = req.body;


  //Check if all data is recieved.
  if(!email||!username||!password||!firstName||!lastName){
    return res.status(409).json({
      message: 'required data missing'
    });
  }else{
  //Verify if email is already registered.
  User.findOne( {email} )
  .exec( (err,foundUser) => {
    if(err){
      return res.status(500).json({
        message : 'error finding user'
      });
    }
    if( foundUser ){
      return res.status(409).json({
        message : 'email already registered'
      });
    }
    //Verify if username is already registered.
      User.findOne( {username} )
      .exec( (err,foundUser) =>{
        if(err){
          return res.status(500).json({
            message : 'error finding user'
          })
        }
        if(foundUser ){
          return res.status(409).json({
            message: 'username already registered'
          });
        }
        //Hash password
        bcrypt.hash( password , null , null , (err,hash) => {
          if(err){
            return res.status(500).json({
            message : 'error hashing password'
           });
          }

          const userData = {
            email,
            username,
            password : hash,
            firstName,
            lastName
          }

          User.create( userData , (err,user) => {
            if(err){
              console.log("Error creating user.");
            }

            return res.status(201).json({
              message : 'user created'
            });
          });
        });
      });
  });
  }
}
