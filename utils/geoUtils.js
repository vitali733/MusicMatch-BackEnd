require('dotenv').config()
const { insideCircle } = require('geolocation-utils')
const axios = require('axios'); 
const UserCollection = require('../models/userSchema');

const geoKey = process.env.GEOAPIFY_KEY

//
const getGeoLocationByPostalCode = async(postalCode, countryCode) => {
    // arguments must be strings!   
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${postalCode}&lang=en&limit=10&type=postcode&filter=countrycode:${countryCode}&apiKey=${geoKey}`)
      return response.data.features[0].properties
    } catch (error) {
      console.log(error);
    }
  }

//
const checkUserWithinCircle = (centerLat, centerLon, targetLat, targetLon, radius) => {
  try {
   const center = {lat: centerLat, lon: centerLon} //number
   const targetLocation = {lat: targetLat, lon: targetLon} //number
   //unit of radius:  meters

    return insideCircle(targetLocation, center, radius)
  } catch (error) {
    console.log(error)
  }
}

//
const findUsersWithinCircle = async (centerLat, centerLon, radius) => {
  try {
      const allUsers = await UserCollection.find()
      const foundUsers = allUsers.filter(e => checkUserWithinCircle(centerLat, centerLon, e.latitude, e.longitude, radius) )
      return foundUsers
  } catch (error) {
     console.log(error)
  }
}

// PLACEHOLDER GETLOCATIONBYADRESS


 module.exports = { getGeoLocationByPostalCode, checkUserWithinCircle, findUsersWithinCircle }


