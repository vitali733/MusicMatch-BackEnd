const FryCollection = require('../models/frySchema.js')
const ErrorStatus = require('../utils/errorStatus.js')

const createFry = async (req, res, next) => {
try{
    console.log('createFry triggered')
    const newFry = await FryCollection.create(req.body)
    if(!newFry) throw new ErrorStatus('createFry failed', 500); 
    return res.status(201).send(newFry)
} catch(error){
   next(error)
}
}

const getAllFries = async (req, res, next) => {
    try{
        const allFries = await FryCollection.find()
        if (!allFries) throw new ErrorStatus('No fries found!', 404);
        return res.json(allFries)
    } catch (error) {
        next(error)
    }
}

const deleteOneFry = async (req, res, next) => {
    try{
        const { id } = req.params;
        const deletedFry = await FryCollection.findByIdAndDelete(id)
        console.log('Fry has been deleted: ' + id)
        return res.json(deletedFry)
    } catch (error) {
        next(error)
    }
  }

const updateOneFry = async (req, res, next) => {
    try{
        const { id } = req.params;
        const   { title, author, comments, date, imgURL } = req.body
        const updatedFry = await FryCollection.findByIdAndUpdate(
            id, 
            { title, author, comments, date, imgURL },
            { new: true, runValidators: true }
        )
        console.log('Fry has been updated: ' + id)
        return res.json(updatedFry)
    } catch (error) {
       next(error)
    }
  }

module.exports = { getAllFries, createFry, deleteOneFry, updateOneFry }

