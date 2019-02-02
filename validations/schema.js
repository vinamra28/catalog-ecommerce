const Joi = require('joi');

const userSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email({ minDomainAtoms: 2}).required(),
        mobileNo: Joi.number().integer().required(),
        password: Joi.string().required()
    });

module.exports = {
    '/add': userSchema
}