const express = require('express'),
      router = express.Router(),
      User = require('../models/User'),
      bcrypt = require('bcrypt');

//Controller
const { createUser , logInUser , logOutUser } = require('../controllers/userController');


router.post('/register',createUser);
router.post('/login',logInUser);
router.post('/logout',logOutUser);

router.get('/session', (req,res)=>{
  res.send(req.session)
});

module.exports = router;
