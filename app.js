const express = require('express'),
      config = require('./config'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path'),
      session = require('express-session');

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
app.use(bodyParser.json({limit: '30mb'}));

//Session to track logins.
app.use(session({
  secret : 'sosecret',
  resave : true,
  saveUninitialized: false
}))


//Routes config
const postsRoutes = require('./routes/postRoutes');
app.use('/posts',postsRoutes);
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);


var port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0" , () =>{
  console.log("Listening to port "+port);
})
