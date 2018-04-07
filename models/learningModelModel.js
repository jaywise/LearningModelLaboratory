var mongoose = require ("mongoose");

//get access to Schema constructor
var Schema = mongoose.Schema;

var schema = new Schema({
  description: {type: String, required: false},
  title: {type: String, required: false},
  createdAt: {type: Date},
  updatedAt: {type: Date}
});

// shows creations/edits upon save to DB
schema.pre('save', function(next){
  if(!this.createdAt){
    this.createdAt = new Date();
  }else{
    this.updatedAt = new Date();
  }
  next();
});

//export the model with associated name and Schema
module.exports = mongoose.model("learningModel", schema);
