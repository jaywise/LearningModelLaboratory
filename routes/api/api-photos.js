//api-photos.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
var photoController = require('../../controllers/photoController');
var upload = multer({
  storage: photoController.storage,
  fileFilter: photoController.imageFilter
});
const PhotoService = photoController.PhotoService;

router.use((req, res, next)=>{
  res.set({ // set content-type for all api requests
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':'Content-type, Access-Control-Allow-Headers',
    'Content-type':'application/json'
  });
  if(req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
});

//  photos -- GET to list
router.get('/', (req, res, next)=>{
  PhotoService.list()
    .then((photos)=>{
      console.log(`API: Found images: ${photos}`);
      res.status(200);
      res.send(JSON.stringify(photos));
    })
});

//  photos/:photoid -- GET to find
router.get('/:photoid', (req, res, next)=>{
  PhotoService.read(req.params.photoid)
    .then((photos)=>{
      console.log(`API: Found images: ${photos}`);
      res.status(200);
      res.send(JSON.stringify(photos));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});

//  /photos -- POST to create
router.post('/', upload.single('image'), async (req, res, next)=>{
  var path = "/static/img/" + req.file.filename
  var photo = {           //defines sources of data to be passed into model via req object
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    imageurl: path,
    description: req.body.description,
    filename: req.file.filename,
    title: req.body.title,
    size: req.file.size / 1024 | 0
  }
  try{
    const photoSave = await PhotoService.create(photo);
    res.status(201);  //signifies "success, created!"
    res.send(JSON.stringify(photoSave));
  }catch(err){
    console.log(err);
    throw new Error("PhotoSaveError", photo);
  }

});

//  /photos -- PUT to update
router.put('/:photoid', (req, res, next)=>{
  console.log(`putting ${req.params.photoid}`);
  let putData = req.body;
  PhotoService.update(req.params.photoid, putData)
    .then((updatedPhoto)=>{
      res.status(200);
      res.send(JSON.stringify(updatedPhoto));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});

//  /photos/:photoid -- DELETE to erase
router.delete('/:photoid', (req, res, next)=>{
  console.log(`deleting ${req.params.photoid}`);
  let putData = req.body;
  PhotoService.delete(req.params.photoid)
    .then((deletedPhoto)=>{
      res.status(200);
      res.send(JSON.stringify(deletedPhoto));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});




module.exports = router;
