const ErrorStatus = require('../utils/errorStatus.js')
const CharacteristicCollection = require('../models/characteristicSchema.js')

const checkCharacteristics = async (req, res, next) => {

    try {

        if(req.body.interests || req.body.skills ){
            const  characteristics  = await CharacteristicCollection.find()
            const { interests, skills } = req.body   
            
            //now only for german language
            const charArr = characteristics.map(e => e.de)

            if(req.body.interests){
              
                for(let i = 0; i < interests.length; i++){
                    if(!charArr.includes(interests[i].name)){
                        throw new ErrorStatus ('interest not in characteristicsPool', 400)
                    } 
                }
            }
    
            if(req.body.skills){
                
                for(let i = 0; i < skills.length; i++){
                    if(!charArr.includes(skills[i].name)){
                        throw new ErrorStatus ('skill not in characteristicsPool', 400)
                    } 
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = checkCharacteristics;

