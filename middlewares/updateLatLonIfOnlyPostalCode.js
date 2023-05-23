const ErrorStatus = require('../utils/errorStatus.js')
const getGeoLocationByPostalCode = require('../utils/geoUtils.js')


const updateLatLonIfOnlyPostalCode = async (req, res, next) => {
    console.log('starting middleware updateLatLonIfOnlyPostalCode')

    try {
        const { postalCode, latitude, longitude } = req.body
        if(!latitude || !longitude){
            if(postalCode){
                const { lat, lon} = await getGeoLocationByPostalCode(postalCode)
                req.body.latitude = lat
                req.body.longitude = lon
            }
        }
       
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = updateLatLonIfOnlyPostalCode;

