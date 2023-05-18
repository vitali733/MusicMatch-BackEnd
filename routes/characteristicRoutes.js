const characteristicRouter = require('express').Router()
const { getAllCharacteristics } = require('../controllers/characteristicControllers.js')


//mounted on '/users' in server.js
characteristicRouter.route('/characteristics').get(getAllCharacteristics)

module.exports = characteristicRouter