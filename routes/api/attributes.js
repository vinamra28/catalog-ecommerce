const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Attributes = require('../../controllers/attributes');


router.get('/list', async (req, res) => {
  try {
    let category_service = new Attributes();
    let response = await category_service.getCategoryAttributes();
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    let category_service = new Attributes();
    let response = await category_service.getDetails(req.params.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/create', async (req, res) => {
  try {
    let attribute_service = new Attributes();
    let response = await attribute_service.create(req.body);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/update/:attributeId', async (req, res) => {
  try {
    let category_service = new Attributes();
    let response = await category_service.updateCategoryAttributes(req.body, req.params.attributeId);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete', async (req, res) => {
  try {
    let category_service = new Attributes();
    const response = await category_service.deleteCategoryAttributes(req.body.attributeId);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/exportToCsv', async (req, res) => {
  console.log("Exporting to CSV");
  try {
    let attribute_service = new Attributes();
    const response = await attribute_service.exportToCsv(req.query.attributeId);

    res.setHeader('Content-disposition', 'attachment; filename=Attribute Data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(response);
    //return return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }

});

module.exports = router;
