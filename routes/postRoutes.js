const express = require('express'),
      router = express.Router(),
      Post = require('../models/Post');


//GET ALL POSTS
router.get('/' ,(req,res) => {
  Post.find({}, (err,posts) => {
    if(err)
      console.log(err);
    console.log("Showing posts page.");
    res.json(posts);
  })
})


//SHOW POST INFO
router.get('/:id' , (req,res) => {
  Post.findById(req.params.id , (err,post) => {
    if(err)
      console.log(err);
    console.log("Showing post with id: "+req.params.id);
    res.send(post);
  })
});

//CREATE A NEW POST
router.post('/', (req,res) => {
  const newPost = new Post({
    title:req.body.title,
    subtitle:req.body.subtitle,
    content:req.body.content,
    image:req.body.image,
    generalTopic:req.body.generalTopic
  })

  newPost.save(function(err,post){
    if(err)
      console.log(err);
      console.log("New post created with id: "+post._id);
      res.send(post);
  })

});

//DELETE Post

router.delete('/:id' , (req,res) =>{
  Post.findByIdAndRemove(req.params.id , (err) => {
    if(err){
      console.log(err);
    }
    console.log("Post deleted with id: "+req.params.id);
  })
})


//GET EDIT POST PAGE
  router.get('/:id/edit' , (req,res) => {
    Post.findById(req.params.id , (err , post) => {
      if(err)
        console.log(err);
      console.log('Showing edit panel for post with id :'+req.params.id);
      res.send(post);
    })
  });

//EDIT POST
  router.put('/:id' , (req,res) => {
    Post.findByIdAndUpdate(req.params.id , req.body , (err,post) => {
      if(err)
        console.log(err);
      console.log("Post edited with id: "+req.params.id);
      res.send(post);
    })
  })


module.exports = router;
