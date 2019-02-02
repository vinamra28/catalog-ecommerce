const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Varient = require('../../controllers/varient');

router.get('/list', async (req, res) =>{
  try {
    let result = new Varient();
    let response = await result.getVarient();
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.get('/details/:id', async (req, res) =>{
  try {
    let result = new Varient();
    let response = await result.getDetails(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/create', async (req, res) =>{
  try {
    let result = new Varient();
    let response = await result.create(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/update', async (req, res) => {
  try {
    let result = new Varient();
    let response = await result.updateVarient(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete', async (req, res) => {
  try {
    let result = new Varient();
    const response = await result.deleteVarient(req.body.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch(err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;
