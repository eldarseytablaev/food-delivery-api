const { Router } = require('express');
const httpErrors = require('http-errors');
const { courierService } = require('../services');
const { courierValidator } = require('../validators');

/**
 * @memberOf module:controller
 * @class
 * @instance
 */
class CourierController {
  /**
   * @param {module:service.CourierService} courierService
   * @param {module:validator.CourierValidator} courierValidator
   */
  constructor (courierService, courierValidator) {
    /** @type {module:service.CourierService}
     * @private */
    this._service = courierService;

    /** @type {module:validator.CourierValidator}
     * @private */
    this._validator = courierValidator;
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
    const { name } = req.body;
    const result = await this._service.create({ name });
    res.json(result);
  }

  async updateOne (req, res, next) {
    const errors = await this._validator.check(req);
    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    const { id } = req.params;
    const { name } = req.body;
    const result = await this._service.updateOne(id, { name });
    res.json(result);
  }

  async findOne (req, res, next) {
    const { id } = req.params;
    const result = await this._service.findOne(id);
    if (!result) {
      return next(new httpErrors(404, 'Courier not found'));
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
const courierController = new CourierController(courierService, courierValidator);

const courier = Router();

// Create courier
courier.post('', async (req, res, next) => {
  await courierController.create(req, res, next);
});

// Update courier
courier.patch('/:id(\\d+)', async (req, res, next) => {
  await courierController.updateOne(req, res, next);
});

// Get courier by id
courier.get('/:id(\\d+)', async (req, res, next) => {
  await courierController.findOne(req, res, next);
});

// Get many couriers
courier.get('', async (req, res, next) => {
  await courierController.findAll(req, res, next);
});

courier.delete('/:id', async (req, res) => {
  await courierController.deleteOne(req, res);
});

courier.delete('', async (req, res) => {
  await courierController.deleteAll(req, res);
});

module.exports = { courier };
