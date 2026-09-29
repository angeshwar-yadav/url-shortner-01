const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
    originalUrl:{
        type:String,
        required: true
    },
    shortCode:{
        type:String,
        required:true,
        unique:true
    },
    clicks:{
        type:Number,
        default:0
    }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }});
  const URL = mongoose.model('URL', urlSchema);
  module.exports = URL;