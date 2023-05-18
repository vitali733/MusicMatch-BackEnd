const { SchemaType } = require('mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const characteristicSchema = new Schema({
    // String is shorthand for {type: String}
    characteristik: [{
        name: String
    }]
  });

  const UserCollection = mongoose.model('Characteristic', userSchema);

  module.exports = UserCollection

