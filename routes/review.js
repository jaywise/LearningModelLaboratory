//review.js

var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var LMModel = require('../models/learningModelModel');

//flash middleware
router.use(flash());

//loads learning model models into review view
router.get('/', (req, res, next)=>{
  LMModel.find({})
    .then((learningModels)=>{
      res.render('review', {
        learningModels : learningModels,  //populates array with found JSON object(s)
        flashMsg: req.flash("ERROR: Cannot find these items.")
      });
    })
    .catch(()=>{
      if(err){
        res.end("ERROR!")
      }
    });
});

//reads learning model ID data from DB
router.get('/:LMid', (req, res, next)=>{
  console.log("finding " + req.params.LMid);
  LMModel.findOne({'_id' : req.params.LMid})  //finds model in DB baesd on URL
    .then((learningModel)=>{  //passes in found object
      res.render('updateLearningModel', {
        learningModel : learningModel,  //generates update page populated by found object
        flashMsg : req.flash("learningModelFindError")
      });
    }).catch((err)=>{
      if(err) console.log(err);
    });
});

//updates learning model in DB and displays in regenerated review screen
router.post('/:LMid', (req, res, next)=>{
  LMModel.findByIdAndUpdate(
    req.params.LMid,
    {
      $set: {   //overwrites found object with new key-value pairs
        title: req.body.title,
        description: req.body.description
      }
    }
  )
  .then((q)=>{
    console.log("updated: " + q)
    res.redirect('/review');  //generate updated data via review pug template
  }).catch((err)=>{
      if(err) console.log(err);
  })
});

//finds and deletes learning model
router.post('/delete/:LMid', (req, res, next)=>{
  LMModel.findByIdAndRemove(req.params.LMid)  //finds model via URL, then deletes it
  .then((q)=>{
    console.log("deleted: " + q)
    res.redirect('/review');
  }).catch((err)=>{
    console.log(err);
  })
});

module.exports = router;
