const express = require('express'),
      router = express.Router(),
      Post = require('../models/Post'),
      User = require('../models/User'),
      _ = require('lodash');
//Middleware
const { isLoggedIn , isPostAuthor } = require('../middleware/user');

//Controller
const { fetchPosts , fetchPost , createPost , deletePost , updatePost } = require('../controllers/postController');

//GET ALL POSTS
router.get('/' ,fetchPosts);
//SHOW POST INFO
router.get('/:id' , fetchPost);
//CREATE A NEW POST
router.post('/', isLoggedIn , createPost);
//DELETE Post
router.delete('/:id' , isPostAuthor , deletePost);
//GET EDIT POST PAGE
router.get('/:id/edit' , isPostAuthor , fetchPost);
//Update post
router.put('/:id' , isPostAuthor , updatePost);


module.exports = router;
