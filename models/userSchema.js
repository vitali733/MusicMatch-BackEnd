const { SchemaType } = require('mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    // String is shorthand for {type: String}
    firstName: {
        type: String,
        required: [true , 'First Name is required']
    }, 
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,'is not a valid email']
    },
    password: { 
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100,
        //on response the password wont come back
        select: false
    },
    address: {
        type: String,
        default: null
    },
    postalCode: {
        type: String,
        required: [true, 'postal code required'],
        match: [/^[0-9]{5}$/,'is not a valid postal code']
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    imgUrl: {
        type: String,
        default: null
    },
    userDescription: {
        type: String,
        maxlength: 500,
        default: null
    },
    interests: [{
        name: String, description: String
    }],
    skills: [{
        name: String, level: Number,  description: String
    }],
    bookMarks: [{
        type: [Schema.Types.ObjectId, 'type is not a valid mongoDB object ID']
    }],
    settings: [{
        distance: String, darkMode: Boolean
    }]
  });

  const UserCollection = mongoose.model('User', userSchema);

  module.exports = UserCollection

