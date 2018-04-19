//Mongoose models
const User = require('../models/User'),
      Post = require('../models/Post'),
      _ = require('lodash');

//middleware
const { isLoggedIn , isPostAuthor } = require('../middleware/user');

//Fetch all posts
exports.fetchPosts = (req,res) => {
  Post.find({})
  .populate('author')
  .exec((err,posts) => {
    if(err){
      return res.status(500).json({
        message : 'error finding posts'
      })
    }
    console.log("Showing posts page.");
    res.json(posts);
  });
}
//Fetch only one post.
exports.fetchPost = (req,res) =>{
  Post.findById(req.params.id)
  .populate('author._id')
  .exec( (err,post) => {
    if(err){
      return res.status(500).json({
        message : 'error finding post'
      })
    }
    console.log("Showing post with id: "+req.params.id);
    res.json(post);
  });
}
//Create post
exports.createPost = (req,res) => {

  const { title , subtitle , content, image, generalTopic } = req.body;

  //Validate data.

  if(!title || !subtitle || !content ||!image ||!generalTopic){
    return res.status(401).json({
      message: 'required data missing'
    });
  }

  //Find the creator by id.
  User.findOne( {_id : req.session.userId} )
  .exec( (err,user) => {

    //Create the post
    const newPost = new Post({
      title,
      subtitle,
      content,
      image,
      generalTopic,
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
}
//Delete post
exports.deletePost = (req,res) =>{
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
}
//Update post
exports.updatePost = (req,res) => {
  Post.findByIdAndUpdate(req.params.id , req.body , (err,post) => {
    if(err){
      return res.status(500).json({
        message : 'error updating post'
      })
    }
    console.log("Post edited with id: "+req.params.id);
    res.json(post);
  });
}
