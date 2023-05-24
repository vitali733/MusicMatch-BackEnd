const ErrorStatus = require('../utils/errorStatus.js')
const characteristicsObj = require('../resources/characteristics.json')


const checkCharacteristics = (req, res, next) => {

    try {

        if(req.body.interests || req.body.skills ){
            const { characteristics } = characteristicsObj
            const { interests, skills } = req.body    

            if(req.body.interests){
              
                for(let i = 0; i < interests.length; i++){
                    if(!characteristics.includes(interests[i].name)){
                        throw new ErrorStatus ('interest not in characteristicsPool', 400)
                    } 
                }
            }
    
            if(req.body.skills){
                
                for(let i = 0; i < skills.length; i++){
                    if(!characteristics.includes(skills[i].name)){
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

