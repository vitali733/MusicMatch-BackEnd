require('dotenv').config()
const UserCollection = require('../models/userSchema');
const ErrorStatus = require('../utils/errorStatus');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) throw new ErrorStatus('missing login fields', 400)

        //.select('+password') is needed to get the field because in the userSchema it was defined with "select: false"
        foundUser = await UserCollection.findOne({email}).select('+password')
        if(!foundUser) throw new ErrorStatus('User not found', 404);

        const compare = await bcrypt.compare(password, foundUser.password);
        if(!compare) throw new ErrorStatus('password does not match', 401);

        const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET)

        res.cookie('token', token, { httpOnly: true }).sendStatus(200)
        return console.log('user login successful')
    } catch (error) {
        next(error)
    }
}

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

const createUser = async(req, res, next) => {
    try {
        const { firstName, lastName, email, password, postalCode, address } = req.body
              
        if(!firstName || !lastName || !email || !password || !postalCode) throw ErrorStatus('missing fields', 400)
        
        const hash = await bcrypt.hash(password, 10);

        const { _id } = await UserCollection.create({
            firstName,
            lastName,
            email,
            password: hash,
            postalCode,
            address
        })

        token = jwt.sign({ _id }, process.env.JWT_SECRET)

        return res.sendStatus(201).send('user successfully registered')
    } catch (error) {
        next(error)
    }
}

const getLoggedInUser = async (req, res, next) => {
    try {
        const foundUser = await UserCollection.findById(req.userId);
        return res.status(200).json(foundUser)
    } catch (error) {
        next(error)
    } 
}

const getUserById = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const foundUser = await UserCollection.findById(req.params.id);
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

const updateUser = async (req, res, next) => {
    try{
        const { 
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



module.exports = {createUser, getLoggedInUser, login, updateUser, deleteUser, logout, getAllUsers, getUserById }


/*

*/