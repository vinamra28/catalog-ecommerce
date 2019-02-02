const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const AttributesValue = require('../../controllers/attributeValue');

router.get('/list', async (req, res) => {
  try {
    let attribute_service = new AttributesValue();
    let response = await attribute_service.getAttributeValue();
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    let attribute_service = new AttributesValue();
    let response = await attribute_service.getDetails(req.params.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/create', async (req, res) => {
  try {
    let attribute_service = new AttributesValue();
    let response = await attribute_service.create(req.body);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/update', async (req, res) => {
  try {
    let attribute_service = new AttributesValue();
    let response = await attribute_service.updateAttributesValue(req.body);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete', async (req, res) => {
  try {
    let attribute_service = new AttributesValue();
    const response = await attribute_service.deleteAttributeValue(req.body.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;
