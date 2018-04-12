// app.js
var express = require('express');
var path = require('path');
var url = require('url');
var discover = require('./routes/discover');
var review = require('./routes/review');
var home = require('./routes/home');
var create = require('./routes/create');
var apiphotos = require('./routes/api/api-photos');
var apireview = require('./routes/api/api-review');
var photos = require('./routes/photos');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require("mongoose");
require('dotenv').config(); //package to conceal DB credentials

//set up mongoose connection
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@joshcluster1-shard-00-00-52qg0.mongodb.net:27017,joshcluster1-shard-00-01-52qg0.mongodb.net:27017,joshcluster1-shard-00-02-52qg0.mongodb.net:27017/cscie31?ssl=true&replicaSet=JoshCluster1-shard-0&authSource=admin`)
  .then(() => { console.log('DB connection successful!');
  })
  .catch((err) => console.error(err));


// set up 'utility' middleware
var app = express();
app.use(cookieParser('cscie31-secret'));
app.use(session({
  secret:"cscie31",
  resave: "true",
  saveUninitialized: "true"
}));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

// use pug view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set up routes and routers
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/photos', photos);
app.use('/discover', discover);
app.use('/create', create);
app.use('/review', review);
app.use('/home', home);
app.use('/', home);
app.use('/api/photos', apiphotos);
app.use('/api/review', apireview);

// catch any remaining routing errors
app.use((req, res, next)=>{
  var err = new Error('File cannot be found');
  err.status = 404;
  next(err);
});

module.exports = app;
