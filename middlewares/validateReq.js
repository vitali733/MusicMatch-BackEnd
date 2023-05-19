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
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('No firstname sent')
      .matches(/^[a-zA-Z\s.]*$/)
      .withMessage('Name must contain only characters')
      .isLength({ max: 25 })
      .withMessage('Firstname must be up to 25 characters long'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('No lastname sent')
      .matches(/^[a-zA-Z\s.]*$/)
      .withMessage('Lastname must contain only characters')
      .isLength({ max: 25 })
      .withMessage('Name must be up to 25 characters long'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('No email sent')
      .matches(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)
      .withMessage('invalid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('No password sent')
      //passowrd requires at least one digit. The password must be at least 6 characters long, but no more than 32.
      .matches(/^(?=.*[0-9]).{6,32}/)
      .withMessage('invalid password. must contain at least one digit. length: 6-32 characters.'),
      body('address')
        .trim(),
        //.matches(/^[a-zA-Z0-9.]*$/)
        //.withMessage('address must not contain special characters beside dots "."'),
    body('postalCode')
      .trim()
      .notEmpty()
      .withMessage('No postalCode sent')
      //!!!! this match currently only works in germany !!!!
      .matches(/^[0-9]{5}$/)
      .withMessage('not a valid (german) postal code'),
    checkErrors,
  ];


module.exports = { checkErrors, checkId, checkRegister }