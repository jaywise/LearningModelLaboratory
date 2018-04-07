//create.js

var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var LMModel = require('../models/learningModelModel');
var multer = require('multer');
var upload = multer();

// flash middleware
router.use(flash());

//render create pug template
router.get('/', (req, res, next)=>{
    res.render('create', {
        flashMsg: req.flash("createPageRenderError")//error handling if page doesn't load
    });
});

//save model to database
router.post('/', upload.array(), (req, res, next)=>{
  var learningModel = {
    description: req.body.description,
    title: req.body.title,
  }
  var learningModel = new LMModel(learningModel); //generate model based on learningModelModel template
  learningModel.save()
    .then((q)=>{
      console.log("Saving" + q);
      res.redirect('/review') //send to review for editing and reading of new model
    })
    .catch((err)=>{
      if(err){
        console.log(err);
        throw new Error("LearningModelSaveError", learningModel);
      }
    });
});

// catch errors here
router.use(function(err, req, res, next){
  console.error(err.stack);
  // if the error came from our imageFilter, set the flash message and redirect to the form
  if (err.message == "LearningModelSaveError"){
      req.flash('LearningModelSaveError', "There was a problem saving your learning model");
      res.redirect('/create');
  }else{
    // otherwise, let express handle the error in the usual way
     next(err);
  }
});

module.exports = router;
