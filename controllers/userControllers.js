require('dotenv').config()
const UserCollection = require('../models/userSchema');
const ErrorStatus = require('../utils/errorStatus');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { getGeoLocationByPostalCode } = require('../utils/geoUtils.js')
const getMatchedUsers = require('../utils/matchUtils.js')
const asyncHandler = require("express-async-handler")


///
const login = async (req, res, next) => {
    try {
        console.log('executing controller login')
        const { email, password } = req.body;
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
            maxAge: 1000 * 60 * 60 * 12,
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

// allUsers for user search // don't find yourself: .find({ _id: { $ne: req.users._id } }) but can't access req.users._id right now might be auth issue
//api/user?search=...

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await UserCollection.find(keyword);
    res.send(users);
  });

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

  const addSkinTerest = async (req, res, next) => {
    try{
        const { userId } = req
        const { interest, skill, description, level } = req.body
        if(!interest && !skill) throw new ErrorStatus('no interest or skill provided',400)             
        const { interests, skills } = await UserCollection.findById(req.userId);

        if(interest){
            if(interests.some(i=>i.name === interest)) throw new ErrorStatus('interest already exists',400)      

            interests.push({"name": interest, "description": description?description:''})
           
            const updatedUser = await UserCollection.findByIdAndUpdate(
                userId, 
                { 
                    interests
                },
                { new: true, runValidators: true }
            )  

            return res.status(200).json(updatedUser)
        }

        if(skill){
            if(skills.some(i=>i.name === skill)) throw new ErrorStatus('skill already exists',400)      
    
            skills.push({"name": skill, "description": description?description:'', "level": level?level:1})
           
            const updatedUser = await UserCollection.findByIdAndUpdate(
                userId, 
                { 
                    skills
                },
                { new: true, runValidators: true }
            )  

            return res.status(200).json(updatedUser)
        }                
         
    } catch (error) {
       next(error)
    }
  }

  const deleteSkinTerest = async (req, res, next) => {
    try{
        console.log('deleteSkinterest fired')
        const { userId } = req
        const { interest, skill } = req.body

        console.log('deleted skill: ' + skill)

        if(!interest && !skill) throw new ErrorStatus('no interest or skill provided',400)      
                
        let { interests, skills } = await UserCollection.findById(req.userId);

        if(interest){
            if(!interests.some(i=>i.name === interest)) throw new ErrorStatus('cant be deleted because interest does not exist',400)      
           
            interests = interests.filter(i => i.name !== interest)
           
            const updatedUser = await UserCollection.findByIdAndUpdate(
                userId, 
                { 
                    interests
                },
                { new: true, runValidators: true }
            )  
            
            return res.status(200).json(updatedUser)
        }

        if(skill){
            if(!skills.some(i=>i.name === skill)) throw new ErrorStatus('skill already exists',400)  
            
            skills = skills.filter(i => i.name !== skill)
               
            const updatedUser = await UserCollection.findByIdAndUpdate(
                userId, 
                { 
                    skills
                },
                { new: true, runValidators: true }
            )  

            return res.status(200).json(updatedUser)
        }                
        
         
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
const getUsersAround = async (req, res, next) => {
    try {    
        if(!req.usersAround) throw new ErrorStatus('could not find users around', 500) 
        return res.json(req.usersAround)
    } catch (error) {
        next(error)
    }
  }

//
const getMatches = async (req, res, next) => {
    try {
        const { usersAround } = req   
        const { interests, skills } = await UserCollection.findById(req.userId);
        const resultArr = []
        
        if(interests.length === 0 && skills.length === 0) throw new ErrorStatus('authenticated User has neither interessts nor skills', 500)
        
        //ii match
        interests.forEach(i => {
            const arr = getMatchedUsers(usersAround, 'ii', i.name, 'interests');
            arr.forEach(e => resultArr.push(e))
        })
        
        //is match
        interests.forEach(i => {
            const arr = getMatchedUsers(usersAround, 'is', i.name, 'skills');
            arr.forEach(e => resultArr.push(e))
        })
        
        //si match
        skills.forEach(i => {
            const arr = getMatchedUsers(usersAround, 'si', i.name, 'interests');
            arr.forEach(e => resultArr.push(e))
        })
        
        //ss match
        skills.forEach(i => {
            const arr = getMatchedUsers(usersAround, 'ss', i.name, 'skills');
            arr.forEach(e => resultArr.push(e))
        })
       
        // get set of unique id´s from resultArr
        const idSet = new Set(resultArr.map(m => m._id.toHexString()))
        const uniqueIdArr = Array.from(idSet)

        //--- formating matachresult ---

        //built structure for final result array
        const formattedResultArr = uniqueIdArr.map(i => {
            return {
                user: {
                    _id: i,
                    matches: null      
                }
            }
        })

        //fill final result array
        formattedResultArr.forEach(i => {
            i.user.matches = resultArr.filter(m => m._id == i.user._id ).map(m => {
                return { matchType: m.matchType, searchTag: m.searchTag }
            } )
        }
        )
        
        // sort for decending amount of matches
        formattedResultArr.sort((a, b) => b.user.matches.length - a.user.matches.length);

        return res.send( formattedResultArr )
    } catch (error) {
        next(error)
    }
}

const testController = async (req, res, next) => {
    try {    
        console.log('Testcontroller: Hello!')
        return res.send('Testcontroller: Hello!')
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
      allUsers,
      getUserById,
      getUsersAround,
      getMatches,
      testController,
      addSkinTerest,
      deleteSkinTerest
    }


/*

*/