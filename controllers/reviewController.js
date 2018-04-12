var multer = require('multer');
var LModel = require('../models/learningModelModel');


class LModelService{

  // list photos
  static list(){
    return LModel.find({}) // looks for objects via Photo model
      .then((learningModel)=>{
        return learningModel; // returns photo object to function call
      })
  };

  // find photos
  static read(id){
    return LModel.findById(id) // detects match in DB and passes object
      .then((learningModel)=>{
        return learningModel; // returns photo object to function call
      })
  };

  // generate new photo based on model
  static create(obj){
     var learningModel = new LModel(obj); // generates new model based on photoModel
     return learningModel.save(); //saves to DB
  }

  //   update
  static update(id, data){
      return LModel.findById(id)   // finds photo in DB and passes to promise
       .then((learningModel)=>{
         learningModel.set(data);
         learningModel.save();  // saves to DB
         return learningModel;
       });
  }

  //  delete
  static delete(id){
    return LModel.findByIdAndRemove({_id: id})   // matches via URL params passed in via function's parameter
      .then((obj)=>{
        return obj;
    })
  }

}

module.exports.LModelService = LModelService;
