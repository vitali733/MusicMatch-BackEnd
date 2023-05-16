const { param, body, validationResult } = require('express-validator')

const checkErrors = (req, res, next) => {
    const errors = validationResult(req);
    const errorList = errors.array().map((err) => err.msg);
    return errors.isEmpty() ? next() : next(errorList);
  };

  const checkId = [
    param('id').isMongoId().withMessage('Is not a valid Mongo ID'),
    checkErrors,
  ];



module.exports = { checkErrors, checkId }