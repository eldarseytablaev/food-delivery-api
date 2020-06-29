const { check, validationResult } = require('express-validator');
const { commonValidator } = require('./common.validator');

/**
 * @memberOf module:validator
 * @class
 * @instance
 * @extends CommonValidator
 */
class RestaurantValidator extends commonValidator.CommonValidator {
  /**
   * @param {Request} req
   * @return {Promise<Result<ValidationError>>}
   */
  async check (req) {
    const minChars = 6;
    await check('name', `Name must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    await check('name', 'Name is empty').not().isEmpty().run(req);

    await check('picture', `picture must be at least ${minChars} characters long`).isLength({ min: minChars }).run(req);
    await check('picture', 'picture is empty').not().isEmpty().run(req);
    return validationResult(req);
  }
}

/**
 * @type {module:validator.RestaurantValidator}
 */
RestaurantValidator.prototype.RestaurantValidator = RestaurantValidator;

const restaurantValidator = new RestaurantValidator();

module.exports = { restaurantValidator };
