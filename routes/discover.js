//discover.js

var express = require('express');
var router = express.Router();

//render discover page with discover pug template
router.get('/', (req, res, next)=>{
  res.render('discover', {
    "username":"Josh",
  });
});

module.exports = router;
