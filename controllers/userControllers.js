require('dotenv').config()
const UserCollection = require('../models/userSchema');
const ErrorStatus = require('../utils/errorStatus');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { findUsersWithinRadius, getGeoLocationByPostalCode } = require('../utils/geoUtils.js')
const CharacteristicCollection = require('../models/characteristicSchema.js')

///
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if(!email || !password) throw new ErrorStatus('missing login fields', 400)

        //.select('+password') is needed to get the field because in the userSchema it was defined with "select: false"
        const foundUser = await UserCollection.findOne({email}).select('+password')
        if(!foundUser) throw new ErrorStatus('User not found', 404);

        const compare = await bcrypt.compare(password, foundUser.password);
        if(!compare) throw new ErrorStatus('password does not match', 401);

        const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET)
        console.log(token);

        return  res.cookie('token', token, { 
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            sameSite: 'none',
            secure: true
        }).sendStatus(200)

    } catch (error) {
        next(error)
    }
}

///
const logout = (req, res, next) => {
    try {
      res
        .clearCookie('token', { path: '/', sameSite: 'none', secure: true })
        .sendStatus(200)
        .send('logout successfull');
    } catch (error) {
      next(error);
    }
};

///
const createUser = async(req, res, next) => {
    try {
        const { email, password } = req.body
              
        if(!email || !password) throw new ErrorStatus('missing fields', 400)
        
        const hash = await bcrypt.hash(password, 10);

        const { _id } = await UserCollection.create({
            email,
            password: hash
        })

        token = jwt.sign({ _id }, process.env.JWT_SECRET)

        return res.sendStatus(201)
    } catch (error) {
        next(error)
    }
}

///
const getLoggedInUser = async (req, res, next) => {
    try {
        const foundUser = await UserCollection.findById(req.userId);
        return res.status(200).json(foundUser)
    } catch (error) {
        next(error)
    } 
}

///
const getUserById = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const foundUser = await UserCollection.findById(req.params.id);
        return res.status(200).json(foundUser)
    } catch (error) {
        next(error)
    }
}

///
const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await UserCollection.find()
        return res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
}

//
const updateUser = async (req, res, next) => {
    try{
        let { 
            firstName,
            lastName,
            address,
            postalCode,
            latitude,
            longitude,
            imgUrl,
            userDescription,
            interests,
            skills,
            bookMarks,
            settings
        } = req.body

        // if no geodata get and write them from postalCode
        if( (!latitude || !longitude) && postalCode){  
            const { lat, lon } = await getGeoLocationByPostalCode(postalCode)
            latitude = lat
            longitude = lon
        }

        const { userId } = req

        const updatedUser = await UserCollection.findByIdAndUpdate(
            userId, 
            { 
                firstName,
                lastName,
                address,
                postalCode,
                latitude,
                longitude,
                imgUrl,
                userDescription,
                interests,
                skills,
                bookMarks,
                settings
            },
            { new: true, runValidators: true }
        )  

        return res.json(updatedUser)
         
    } catch (error) {
       next(error)
    }
  }

///
const deleteUser = async (req, res, next) => {
    try{
        const { userId } = req
        const deletedUser = await UserCollection.findByIdAndDelete(userId)
        console.log('User has been deleted: ' + userId)
        return res.json(deletedUser)
    } catch (error) {
        next(error)
    }
  }

//
const getUsersWithinRadius = async (req, res, next) => {
    try {
        const { latitude, longitude, settings} = await UserCollection.findById(req.userId);

        if(!latitude || ! longitude) throw new ErrorStatus('no geo information for user found', 400)
        
        const foundUsers = await findUsersWithinRadius( latitude, longitude, settings.radius)
        return res.json(foundUsers)
    } catch (error) {
        next(error)
    }
  }

  //
const getMatches = async (req, res, next) => {
    try {

        res.send('soon youll get matches!')
    } catch (error) {
        next(error)
    }
}

const testController = async (req, res, next) => {
    try {
        console.log('started testController')

        const searchTag = 'Drums'
        const matchType = 'ii'

        const iiResult = []

        const userIds = await UserCollection.find({'interests.name' : searchTag }, '_id' )

        userIds.forEach(u => {
            iiResult.push({_id: u._id, searchTag: searchTag, matchType: matchType })
        })
    
      
        

        res.send(  iiResult )
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createUser,
     getLoggedInUser,
      login,
      updateUser,
      deleteUser,
      logout,
      getAllUsers,
      getUserById,
      getUsersWithinRadius,
      getMatches,
      testController
    }


/*

*/