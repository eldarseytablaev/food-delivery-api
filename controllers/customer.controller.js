const { Router } = require('express');
const httpErrors = require('http-errors');
const { customerService } = require('../services');
const { customerValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class CustomerController {
  /**
   * @param {module:service.CustomerService} customerService
   * @param {module:validator.CustomerValidator} customerValidator
   */
  constructor (customerService, customerValidator) {
    /** @type {module:service.CustomerService}
     * @private */
    this._service = customerService;

    /** @type {module:validator.CustomerValidator}
     * @private */
    this._validator = customerValidator;
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @return {Promise<*>}
   */
  async create (req, res, next) {
    const errors = await this._validator.check(req);
    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }
    const { name, address } = req.body;
    const result = await this._service.create({ name, address });
    res.json(result);
  }

  async updateOne (req, res, next) {
    const errors = await this._validator.check(req);
    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    const { id } = req.params;
    const { name, address } = req.body;
    const result = await this._service.updateOne(id, { name, address });
    res.json(result);
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'Customer not found'));
    }
    res.json(result);
  }

  async findAll (req, res, next) {
    const errorsPagination = await this._validator.checkPagination(req);
    if (!errorsPagination.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errorsPagination.array())));
    }
    const { limit, offset } = req.query;
    const result = await this._service.findAll(limit, offset);
    res.json(result);
  }

  async deleteOne (req, res) {
    const { id } = req.params;
    await this._service.deleteOne(id);
    res.status(204).send();
  }

  async deleteAll (req, res) {
    await this._service.deleteAll();
    res.status(204).send();
  }
}
const customerController = new CustomerController(customerService, customerValidator);

const customer = Router();

// Create customer
customer.post('', async (req, res, next) => {
  await customerController.create(req, res, next);
});

// Update customer
customer.patch('/:id(\\d+)', async (req, res, next) => {
  await customerController.updateOne(req, res, next);
});

// Get customer by id
customer.get('/:id(\\d+)', async (req, res, next) => {
  await customerController.findOne(req, res, next);
});

// Get many customers
customer.get('', async (req, res, next) => {
  await customerController.findAll(req, res, next);
});

customer.delete('/:id', async (req, res) => {
  await customerController.deleteOne(req, res);
});

customer.delete('', async (req, res) => {
  await customerController.deleteAll(req, res);
});

module.exports = { customer };
