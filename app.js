const express = require('express'),
      config = require('./config'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path');

const app = express();

//DB setup
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}${config.db.url}`, (err) =>{
  if(err)
    console.log(err);
  console.log('Connected to database.');
})

//App configuration
app.use(bodyParser.urlencoded({extended : true}));
//Interpret json posts
app.use(bodyParser.json());

//Routes config
const postsRoutes = require('./routes/postRoutes');
app.use('/posts',postsRoutes);



app.listen(8080, () =>{
  console.log("Listening to port "+8080);
})
