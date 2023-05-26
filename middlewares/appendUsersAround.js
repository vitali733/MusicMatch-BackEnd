const ErrorStatus = require('../utils/errorStatus.js')
const UserCollection = require('../models/userSchema');
const { findUsersWithinRadius } = require('../utils/geoUtils.js')


///!!! trying to exclude own _id
const appendUsersAround = async (req, res, next) => {
    try {

        const { userId } = req

        const { latitude, longitude, settings} = await UserCollection.findById(userId);

        if(!latitude || ! longitude) throw new ErrorStatus('no geo information for user found', 400)
        
        const usersAround = await findUsersWithinRadius( latitude, longitude, settings.radius)

        //exclude authUser in result
        const filteredUsersAround = usersAround.filter( u => u._id != userId )
        
        req.usersAround = filteredUsersAround
       
        next();
    } catch (error) {
        next(error)
    }
  }

  module.exports = appendUsersAround;