const ErrorStatus = require('../utils/errorStatus.js')
const CharacteristicCollection = require('../models/characteristicSchema.js')

const checkSkinTerest = async (req, res, next) => {

    try {
                
        const { interest, skill } = req.body   
        console.log(`checkSkinTerest skill: (${skill})`)
        if(!interest && !skill) throw new ErrorStatus('no interest or skill sent',400)

        const  characteristics  = await CharacteristicCollection.find()
        
        //now only for german language
        const charArr = characteristics.map(e => e.de)
        
        if(interest){
            if(!charArr.includes(interest)) throw new ErrorStatus('unknown interest',400)
        }

        if(skill){
            if(!charArr.includes(skill)) throw new ErrorStatus('unknown skill',400)
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = checkSkinTerest;

