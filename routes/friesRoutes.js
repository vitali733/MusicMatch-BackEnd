const express = require('express')
const { getAllFries, createFry, deleteOneFry, updateOneFry } = require('../controllers/fryControllers')
const friesRouter = express.Router()
const { checkId } = require('../middlewares/validateReq.js')

friesRouter.route('/fries').get(getAllFries)
friesRouter.route('/fries/:id').delete(checkId, deleteOneFry).put(updateOneFry)
friesRouter.route('/createfry').post(createFry)

module.exports = friesRouter



