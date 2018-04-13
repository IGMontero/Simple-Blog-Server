const express = require('express'),
      router = express.Router(),
      Post = require('../models/Post'),
      User = require('../models/User'),
      _ = require('lodash');
//Middleware
const { isLoggedIn , isPostAuthor } = require('../middleware/user');

//GET ALL POSTS
router.get('/' ,(req,res) => {
  Post.find({}, (err,posts) => {
    if(err){
      return res.status(500).json({
        flag : 'post find'
      })
    }
    console.log("Showing posts page.");
    res.json(posts);
  });
})


//SHOW POST INFO
router.get('/:id' , (req,res) => {
  Post.findById(req.params.id)
  .populate('author._id')
  .exec( (err,post) => {
    if(err){
      return res.status(500).json({
        flag : 'post findbyid'
      })
    }
    console.log("Showing post with id: "+req.params.id);
    res.json(post);
  });
});

//CREATE A NEW POST
router.post('/', isLoggedIn , (req,res) => {
  //Find the creator by id.
  User.findOne( {_id : req.session.userId} )
  .exec( (err,user) => {

    //Create the post
    const newPost = new Post({
      title:req.body.title,
      subtitle:req.body.subtitle,
      content:req.body.content,
      image:req.body.image,
      generalTopic:req.body.generalTopic,
      author:user
    });



    //Save the post into user's data
    user.posts.push(newPost);
    user.save((err) => {
      if(err){
        return res.status(500).json({
          message : 'error saving user data'
        });
      }else{
        //Save the created post.
        newPost.save( (err) => {
          if(err){
            return res.status(500).json({
              message : 'error saving post'
            });
          }
          return res.status(201).json({
            message: 'post created'
          });
        });
      }
    });
  });
});

//DELETE Post
router.delete('/:id' , isPostAuthor , (req,res) =>{

  if(!req.params.id)
    return res.status(500).json({
      message: 'post not found'
    });
  //Search for the post to delete.
  Post.findById(req.params.id)
  .populate('author._id')
  .exec( (err,post) => {
    if(err){
      return res.status(500).json({
        err,
        flag: 'post findOne'
      });
    }else{

      const authorId = post.author;
      //Search for the user and remove post from its data.
      User.findOne( { _id : authorId } )
      .populate('posts')
      .exec( (err,user) => {
        if(err){
          return res.status(500).json({
            err,
            flag : 'user findone'
          });
        }

        //Remove post by filtering its array of posts.
        user.posts = user.posts.filter( (userPost) => {
          return !_.isEqual(post._id , userPost._id);
        });
        //Save changes on user
        user.save( (err) => {
          if(err){
            return res.status(500).json({
              err
            });
          }
          //Finally ,remove the Post
          Post.findByIdAndRemove( req.params.id , (err) =>{
            if(err){
              return res.status(500).json({
                err
              });
            }

            console.log("Post deleted with id: "+req.params.id);

            return res.status(201).json({
              message : 'post deleted'
            });
          });
        });
      });
    }
  });
})


//GET EDIT POST PAGE
  router.get('/:id/edit' , isPostAuthor ,  (req,res) => {
    Post.findById(req.params.id , (err , post) => {
      if(err)
        console.log(err);
      console.log('Showing edit panel for post with id :'+req.params.id);
      res.send(post);
    })
  });

//EDIT POST
  router.put('/:id' , isPostAuthor , (req,res) => {
    Post.findByIdAndUpdate(req.params.id , req.body , (err,post) => {
      if(err)
        console.log(err);
      console.log("Post edited with id: "+req.params.id);
      res.send(post);
    })
  })


module.exports = router;
