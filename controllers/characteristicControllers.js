const CharacteristicCollection = require('../models/characteristicSchema');


const getAllCharacteristics = async (req, res, next) => {
    try {
        const allChar = await CharacteristicCollection.find()
        return res.status(200).json(allChar)
    } catch (error) {
        next(error)
    }
}



module.exports = { getAllCharacteristics }


