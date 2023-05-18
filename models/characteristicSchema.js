const mongoose = require('mongoose');
const { Schema } = mongoose;

const characteristicSchema = new Schema({
    // String is shorthand for {type: String}
    characteristik: [{
        name: String
    }]
  });

  const CharacteristicCollection = mongoose.model('Characteristic', characteristicSchema);

  module.exports = CharacteristicCollection

