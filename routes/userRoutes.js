const express = require('express'),
      router = express.Router(),
      User = require('../models/User'),
      bcrypt = require('bcrypt-nodejs');

//Controller
const { createUser , logInUser , logOutUser , fetchUser , updateUser } = require('../controllers/userController');

//Middleware
const { isAccountOwner } = require('../middleware/user');

//User authentication routes
router.post('/register',createUser);
router.post('/login',logInUser);
router.post('/logout',logOutUser);
//Fetch user
router.get('/users/:id' , fetchUser );
//Update user
router.put('/users/:id' , isAccountOwner , updateUser );


router.get('/session', (req,res)=>{
  res.send(req.session)
});

module.exports = router;
