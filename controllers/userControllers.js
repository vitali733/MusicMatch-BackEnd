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

const createUser = async(req, res, next) => {
    try {
        const { firstName, lastName, email, password, postalCode, adress } = req.body
        if(!firstName || !lastName || !email || !password || !postalCode) throw ErrorStatus('missing fields', 400)
        
        const hash = await bcrypt.hash(password, 10);

        const { _id } = await UserCollection.create({
            firstName,
            lastName,
            email,
            password: hash,
            postalCode,
            adress
        })

        token = jwt.sign({ _id }, process.env.JWT_SECRET)

        return res.cookie('token', token, { httpOnly: true }).sendStatus(201)
    } catch (error) {
        next(error)
    }
}

const getOneUser = async (req, res, next) => {
    try {
        const { id } = req.userId;
        console.log('id to update: ' + id)
        const foundUser = await UserCollection.findById(req.userId);
        res.status(200).json(foundUser)
    } catch (error) {
        next(error)
    } 
} 

const updateUser = async (req, res, next) => {
    try{
       
        const   { firstName, lastName, address, postalCode } = req.body
        const updatedUser = await UserCollection.findByIdAndUpdate(
            id, 
            { firstName, lastName, address, postalCode },
            { new: true, runValidators: true }
        )
        console.log('user has been updated: ' + id)
        return res.json(updatedUser)
    } catch (error) {
       next(error)
    }
  }

  




module.exports = {createUser, getOneUser, login, updateUser}