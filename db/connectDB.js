require('dotenv').config()
const mongoose = require('mongoose');

async function connectDB() {
      try {
          await mongoose.connect(process.env.MONGO_URI);
          return console.log('connected to MongoDB')
      } catch (error){
          console.log('error while connecting do MongoDB')
          console.log(error)
      }
    }

module.exports = connectDB




