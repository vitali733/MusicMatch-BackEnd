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

const checkRegister = [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('No email sent')
      .isEmail()
      .withMessage('invalid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('No password sent')
      //passowrd requires at least one digit. The password must be at least 6 characters long, but no more than 32.
      .matches(/^(?=.*[0-9]).{6,32}/)
      .withMessage('invalid password. must contain at least one digit. length: 6-32 characters.'),
    checkErrors
  ];

const checkLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('No email sent')
    .isEmail()
    .withMessage('invalid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('No password sent')
    //passowrd requires at least one digit. The password must be at least 6 characters long, but no more than 32.
    .matches(/^(?=.*[0-9]).{6,32}/)
    .withMessage('invalid password. must contain at least one digit. length: 6-32 characters.'),
  checkErrors
];

/*
const checkRadiusSearch = [
  body('lat')
    .notEmpty()
    .withMessage('missing field: lat/latitude')
    .matches(/^[-+]?([1-8]?[0-9]{1}\.\d+|90(\.0+)?|0)$/)
    .withMessage('not a valid latitude'),
  body('lon')
    .notEmpty()
    .matches(/^[-+]?([1-7]?[0-9]{1,2}\.\d+|180(\.0+)?|0)$/)
    .withMessage('not a valid longitude'),
  body('radius')
    .exists()
    .withMessage('radius must be not falsy / undefined / null')
    .isInt()
    .withMessage('radius must be a an integer'),
  checkErrors
]
*/


/*
const checkUpdateUser = [
body('firstName')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('No firstname sent')
  .matches(/^[a-zA-Z\s.]*$/)
  .withMessage('Name must contain only characters')
  .isLength({ max: 25 })
  .withMessage('Firstname must be up to 25 characters long'),
body('lastName')
  .trim()
  .optional()
  .notEmpty()
  .withMessage('No lastname sent')
  .matches(/^[a-zA-Z\s.]*$/)
  .withMessage('Lastname must contain only characters')
  .isLength({ max: 25 })
  .withMessage('Name must be up to 25 characters long'),
body('address')
  .trim()
  .optional(),
  //.matches(/^[a-zA-Z0-9.]*$/)
  //.withMessage('address must not contain special characters beside dots "."'),
body('postalCode')
  .trim()
  .notEmpty()
  .withMessage('No postalCode sent')
  //!!!! this match currently only works in germany !!!!
  .matches(/^[0-9]{5}$/)
  .withMessage('not a valid (german) postal code'),
checkErrors
]
*/

module.exports = { checkErrors, checkId, checkRegister, checkLogin }