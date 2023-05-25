require('dotenv').config()
const { insideCircle } = require('geolocation-utils')
const axios = require('axios'); 
const UserCollection = require('../models/userSchema');

const geoKey = process.env.GEOAPIFY_KEY

//
const getGeoLocationByPostalCode = async (postalCode) => {
    // arguments must be strings!   
    try {
      countryCode = 'de'
      const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${postalCode}&lang=en&limit=10&type=postcode&filter=countrycode:${countryCode}&apiKey=${geoKey}`)
      return response.data.features[0].properties
    } catch (error) {
      console.log(error);
    }
  }

//
const checkUserWithinRadius = (centerLat, centerLon, targetLat, targetLon, radius) => {
  try {

    if(targetLat && targetLon ){
        //unit of radius:  meters
        const center = {lat: centerLat, lon: centerLon} //number
        const targetLocation = {lat: targetLat, lon: targetLon} //number
        return insideCircle(targetLocation, center, radius)
    } else {return false}

  } catch (error) {
    console.log(error)
  }
}

//
const findUsersWithinRadius = async (centerLat, centerLon, radius) => {
  try {
    
      const allUsers = await UserCollection.find()
      const foundUsers = allUsers.filter(u => checkUserWithinRadius(centerLat, centerLon, u.latitude, u.longitude, radius) )
      return foundUsers
  } catch (error) {
     console.log(error)
  }
}

// PLACEHOLDER GETLOCATIONBYADRESS


 module.exports = { getGeoLocationByPostalCode, checkUserWithinRadius, findUsersWithinRadius }


