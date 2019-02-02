const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const Customer = require('../../controllers/customer');
const apiHandler = require('../../apiHandler');
//const {check, validationResult} = require('express-validator/check');
const SchemaValidator = require('../../validations/validator');
const authService = require('../../services/AuthService');

const validateRequest = SchemaValidator(false);

/**
 * GET ALL CUSTOMERS RECORDS : ADMIN
 */
router.post('/getallcustomers', authService.auth, async (req, res) => {
  try {
    let response = await Customer.getAllUsersDetails(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

/**
 * ADD ADDRESS
 */
router.post('/addaddress', authService.auth, async (req, res) => {
  try {
    let response = await Customer.addAddress(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

/**
 * UPDATE ADDRESS
 */

router.post('/updateaddress', async (req, res) => {
  try {
    let response = await Customer.updateAddress(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

/**
 * GET USER DETAILS
 */

router.get('/getuserdetails', async (req, res) => {
  console.log('hellp')
  try {
    let response = await Customer.getUserDetails(req.query);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
})

/**
 * UPDATE USER DETAILS
 */

router.post('/updatecustomer', async (req, res) => {
  try {
    let response = await Customer.updateCustomer(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
})


router.get('/get', async (req, res) => {
  try {
    // let Customer = new User();
    let response;
    if (req.query.id) {
      response = await Customer.CustomerDetails(req.query.id);
    } else {
      response = await Customer.list();
    }
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/login', async (req, res) => {
  try {
    let response = await Customer.login(req.body.email, req.body.password);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/add', validateRequest, async (req, res, next) => {
  try {
    // let Customer = new User();
    let response = await Customer.add(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});



router.patch('/update/:id', async (req, res) => {
  try {
    // let Customer = new User();
    let response = await Customer.update(
      req.params.id,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.mobileNo,
      req.body.CustomerName,
    );
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

router.patch('/changepass/', async (req, res) => {
  try {
    // let Customer = new User();
    let response = await Customer.changeUserPassword(req.body);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    // let Customer = new User();
    let response = await Customer.delete(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/forget-password', async function (req, res) {
  try {
    // var Customer = new User();
    await Customer.forgetPassword(req.body.email);
    res.send({ message: "Mail sent." });
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});





module.exports = router;
