const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('The URL is not valid');
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.message('The email is not valid');
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .message({
        'string.min': 'The name field needs at least 2 characters',
        'string.max': 'The maximum length of the name field is 30 characters',
        'string.empty': 'The name field is empty',
      }),
    about: Joi.string().min(2).max(30).message({
      'string.min': 'The about field needs at least two characters',
      'string.max': 'The maximum length of the about field is 30 characters',
      'string.empty': 'The about field is empty',
    }),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().custom(validateEmail),
    password: Joi.strign().min(8).required().messages({
      'string.min': 'The password field needs at least 8 characters',
      'string.empty': 'The password field is empty',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Your password needs to be at least 8 characters',
      'string.empty': 'Please enter a password',
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Invalid Card ID');
      }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Invalid User ID');
      }),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The name field needs at least 2 characters',
      'string.max': 'The maximum length of the name field is 30 characters',
      'string.empty': 'The name field is empty',
    }),
    link: Joi.string().custom(validateURL),
  }),
});

const validateRequestAuth = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required().messages({
        'string.empty': 'Authorization required',
      }),
    })
    .unknown(true),
});

module.exports = {
  validateLogin,
  validateUser,
  validateRequestAuth,
  validateUserId,
  validateCardId,
  validateCard,
};
