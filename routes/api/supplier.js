const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Supplier = require('../../controllers/supplier');

router.get('/list', async (req, res) =>{
  try {
    let response = await Supplier.list();
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/details/:id', async (req, res) =>{
  try {
    let response = await Supplier.details(req.params.supplierId);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/create', async (req, res) =>{
  try {
    let response = await Supplier.add(
      req.body.companyName,
      req.body.firstName,
      req.body.lastName,
      req.body.title,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.postalCode,
      req.body.country,
      req.body.contactNo,
      req.body.email,
      req.body.url
    );
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/update', async (req, res) => {
  try {
    let response = await Supplier.update(
      req.body.supplierId,
      req.body.companyName,
      req.body.firstName,
      req.body.lastName,
      req.body.title,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.postalCode,
      req.body.country,
      req.body.contactNo,
      req.body.email,
      req.body.url
    );
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const response = await Supplier.delete(req.body.supplierId);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;
