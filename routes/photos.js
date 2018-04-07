//photos.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
var photoController = require('../controllers/photoController');
var flash = require('connect-flash');
var upload = multer({
  storage: photoController.storage,
  fileFilter: photoController.imageFilter
});
var Photo = require('../models/photoModel');

// flash middleware
router.use(flash());

//loads photo models into photo view
router.get('/', (req, res, next)=>{
  photoController.PhotoService.list()
    .then((photos)=>{
      res.render('photos', {
        photos : photos, //populates photos array with found JSON object(s)
        flashMsg: req.flash("ERROR: Cannot find these items.")
      });
    })
    .catch(()=>{
      if(err){
        res.end("ERROR!")
      }
    });
});

//reads photo data
router.get('/:photoid', (req, res, next)=>{
  console.log("finding " + req.params.photoid);
  photoController.PhotoService.read(req.params.photoid) //invokes controller to grab photo object
    .then((photo)=>{
      res.render('updatePhoto', {
        photo : photo, //send updated photo data be rendered in pug template based on passed object
        flashMsg : req.flash("photoFindError")
      });
    }).catch((err)=>{
      if(err) console.log(err);
    });
});

//updates photo data
router.post('/:photoid', (req, res, next)=>{
  photoController.PhotoService.update(req.params.photoid, req.body) //find photo in DB based on URL data
    .then(()=>{
      res.redirect('/photos'); //generates page with updated photo data showing
    }).catch((err)=>{
      if(err) console.log(err);
    });
});

//processes into DB photo uploaded in newPhoto pug template
router.post('/', upload.single('image'), (req, res, next)=>{
  var path = "/static/img/" + req.file.filename
  var photo = { //defines sources of data to be passed into model via req object
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    imageurl: path,
    description: req.body.description,
    filename: req.file.filename,
    title: req.body.title,
    size: req.file.size / 1024 | 0
  }
  photoController.PhotoService.create(photo)
    .then(()=>{
      res.redirect('/photos') //generate template with new photo
    })
    .catch((err)=>{
      if(err){
        console.log(err);
        throw new Error("PhotoSaveError", photo);
      }
    });
});

//finds and deletes learning model
router.post('/delete/:photoid', (req, res, next)=>{
  photoController.PhotoService.delete(req.params.photoid)  //finds model via URL, then deletes it
  .then((q)=>{
    console.log("deleted: " + q);
    res.redirect('/photos');
  }).catch((err)=>{
    console.log(err);
  })
});

// catch errors here
router.use(function(err, req, res, next){
  console.error(err.stack);
  // if the error came from our imageFilter, set the flash message and redirect to the form
  if (err.message == "OnlyImageFilesAllowed"){
      req.flash('fileUploadError', "Please select an image file with a jpg, png, or gif filename extension.");
      res.redirect('/photos');
  }else if (err.message == "PhotoSaveError"){
      req.flash('PhotoSaveError', "There was a problem saving your photo");
      res.redirect('/photos');
  }else{
    // otherwise, let express handle the error in the usual way
     next(err);
  }
});

module.exports = router;
