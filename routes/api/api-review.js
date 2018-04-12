//api-photos.js
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var reviewController = require('../../controllers/reviewController');

const LMService = reviewController.LModelService;

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
  LMService.list()
    .then((learningModels)=>{
      console.log(`API: Found images: ${learningModels}`);
      res.status(200);
      res.send(JSON.stringify(learningModels));
    })
});

//  photos/:photoid -- GET to find
router.get('/:LMid', (req, res, next)=>{
  LMService.read(req.params.LMid)
    .then((learningModels)=>{
      console.log(`API: Found images: ${learningModels}`);
      res.status(200);
      res.send(JSON.stringify(learningModels));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});

//  /photos -- POST to create
router.post('/', upload.array(), async (req, res, next)=>{
  var learningModel = {           //defines sources of data to be passed into model via req object
    title: req.body.title,
    description: req.body.description
  }
  try{
    const LMSave = await LMService.create(learningModel);
    res.status(201);  //signifies "success, created!"
    res.send(JSON.stringify(LMSave));
  }catch(err){
    console.log(err);
    throw new Error("LearningModelSaveError", learningModel);
  }

});

//  /photos -- PUT to update
router.put('/:LMid', (req, res, next)=>{
  console.log(`putting ${req.params.LMid}`);
  let putData = req.body;
  LMService.update(req.params.LMid, putData)
    .then((updatedLM)=>{
      res.status(200);
      res.send(JSON.stringify(updatedLM));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});

//  /photos/:photoid -- DELETE to erase
router.delete('/:LMid', (req, res, next)=>{
  console.log(`deleting ${req.params.LMid}`);
  let putData = req.body;
  LMService.delete(req.params.LMid)
    .then((deletedLM)=>{
      res.status(200);
      res.send(JSON.stringify(deletedLM));
    })
    .catch((err)=>{
      res.status(404);
      res.end();
    })
});




module.exports = router;
