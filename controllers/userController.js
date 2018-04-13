const User = require('../models/User'),
      bcrypt = require('bcrypt-nodejs');


  exports.logOutUser = (req,res,next) => {
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

  exports.logInUser = (req,res,next) => {

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
          return res.json({ _id : foundUser._id });
        }
      });

    });

  }


  exports.createUser = (req,res,next) => {

  const { email, username, password, passwordConf } = req.body;

  //Check if all data is recieved.
  if(!email||!username||!password){
    return res.status(409).json({
      message: 'required data missing'
    });
  }

  //Verify if email is already registered.
  User.find( {email} )
  .exec()
  .then( (foundUser) => {
    if( foundUser.length>=1 ){
      return res.status(409).json({
        message : 'email already registered'
      });
    }
    //Verify if username is already registered.
      User.find( {username} )
      .exec()
      .then( (foundUser) =>{
        if(foundUser.length>=1){
          return res.status(409).json({
            message: 'username already registered'
          });
        }

        //Hash password
        bcrypt.hash( password , 10 , (err,hash) =>{
          if(err){
            return res.status(500).json({ error:err });
          }

          const userData = {
            email,
            username,
            password : hash
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
