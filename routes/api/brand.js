const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Brand = require('../../controllers/brand');

router.get('/list', async (req, res) => {
  try {
    let result = new Brand();
    let response = await result.getBrand();
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    let result = new Brand();
    let response = await result.getDetails(req.params.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});


//@Akshay Gaba
router.post('/create', async (req, res) => {
  try {
    let brand = new Brand();
    if (!req.files.imagePath) {
      return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
    }
    let imagePath = req.files.imagePath;
    let response = await brand.create(req.body, imagePath);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/update', async (req, res) => {
  try {
    let result = new Brand();
    let response = await result.updateBrand(req.body);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete', async (req, res) => {
  try {
    let result = new Brand();
    const response = await result.deleteBrand(req.body.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;
