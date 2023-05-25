require('dotenv').config()
const UserCollection = require('../models/userSchema');
const ErrorStatus = require('../utils/errorStatus');
const { findUsersWithinRadius, getGeoLocationByPostalCode } = require('../utils/geoUtils.js')
const CharacteristicCollection = require('../models/characteristicSchema.js')



//IMPLEMENT MATCH ALGORITHM ii

// (1) get interest array of "A" User
// (2) get all B users
// (3) get interest array from single B user
// (4) two iterations and compare: 
//      I: iterate through B users 
//      II: iterate through B users interests 
//      III: save B users id {_id: number, matchType: string, searchTag: string} in new array iiArr
// (3) UserCompare: if there is one interest match

//IMPLEMENT MATCH ALGORITHM ii







const getLoggedInUser = async (req, res, next) => {
    try {
        const foundUser = await UserCollection.findById(req.userId);
        return res.status(200).json(foundUser)
    } catch (error) {
        next(error)
    } 
}

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await UserCollection.find()
        return res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
}

