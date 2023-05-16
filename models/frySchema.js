const mongoose = require('mongoose');
const { Schema } = mongoose;

const frySchema = new Schema({
    // String is shorthand for {type: String}
    title: {
        type: String,
        required: [true , 'Title is required']
    }, 
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    comments: {
        type: String
    },
    date: { 
        type: Date, default: Date.now 
    },
    imgURL:{
        type: String,
        required: [true, 'image URL is required']
    } 

  });

  const Fries = mongoose.model('Fries', frySchema);

  module.exports = Fries