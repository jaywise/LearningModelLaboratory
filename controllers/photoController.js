var multer = require('multer');
var Photo = require('../models/photoModel');

// configure file upload storage
const storage = multer.diskStorage({
  // destination set to 'public/img'
  destination: function(req, file, cb) {
    cb(null, 'public/img');
  },
  // filename set to date prepended to original filename
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// only allow filenames ending in these common image extensions
const imageFilter = function(req, file, cb) {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
    cb(null, true);
  }  else {
    cb(new Error("OnlyImageFilesAllowed"), false);
 }
}

class PhotoService{

  // list photos
  static list(){
    return Photo.find({}) // looks for objects via Photo model
      .then((photos)=>{
        return photos; // returns photo object to function call
      })
  };

  // find photos
  static read(id){
    return Photo.findById(id) // detects match in DB and passes object
      .then((photo)=>{
        return photo; // returns photo object to function call
      })
  };

  // generate new photo based on model
  static create(obj){
     var photo = new Photo(obj); // generates new model based on photoModel
     return photo.save(); //saves to DB
  }

  //   update
  static update(id, data){
      return Photo.findById(id)   // finds photo in DB and passes to promise
       .then((photo)=>{
         photo.set(data);
         photo.save();  // saves to DB
         return photo;
       });
  }

  //  delete
  static delete(id){
    return Photo.findByIdAndRemove({_id: id})   // matches via URL params passed in via function's parameter
      .then((obj)=>{
        return obj;
    })
  }

}


module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.PhotoService = PhotoService;
