const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const Users = require('../../controllers/users');
const apiHandler = require('../../apiHandler');
//const {check, validationResult} = require('express-validator/check');
const SchemaValidator = require('../../validations/validator');

const validateRequest = SchemaValidator(false);


/**
 * ADD USER : CUSTOMER 
 */

router.post('/addcustomer', validateRequest, async (req, res) => {
    try {
        if (req.body.createdBy === 'admin') {
            let response = await Users.addCustomerByAdmin(req.body);
            apiHandler(req, res, Promise.resolve(response));
        } else if (req.body.createdBy === 'self') {
            console.log('self');
            let response = await Users.addCustomerSelf(req.body, res);
            apiHandler(req, res, Promise.resolve(response));
        }
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * ADD USER : VENDOR : BY ADMIN
 */
router.post('/addvendor', validateRequest, async (req, res) => {
    try {
        if (req.body.createdBy === 'admin') {
            let response = await Users.addVendorByAdmin(req);
            console.log('response = ', response)
            apiHandler(req, res, Promise.resolve(response));
        } else if (req.body.createdBy === 'self') {
            console.log('self');
            let response = await Users.addVendorSelf(req.body, res);
            apiHandler(req, res, Promise.resolve(response));
        }
        else{
            apiHandler(req, res, Promise.reject(Error.badRequest('incomplete parameters!')));
        }
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
})

/**
 * NORMAL LOGIN FOR ALL TYPE OF USERS
 */
router.post('/login', async (req, res) => {
    try {
        let response = await Users.login(req.body);
        apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * 
 */
router.post('/sociallogin', async (req, res) => {
    try {
        let response = await Users.socialLogin(req.body);
        apiHandler(req, res, Promise.resolve(response));
        // let { loginType } = req.body;
        // if (!loginType)
        //     apiHandler(req, res, Promise.reject(Error.badRequest('incomplete parameter!')));
        // if (loginType === 'facebook') {
        //     let response = await Users.facebookLogin(req.body);
        //     apiHandler(req, res, Promise.resolve(response));
        // }

    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * UPDATE EMAIL CONDITIONALLY
 */
router.post('/updateemail', async (req, res) => {
    try {
        let response = await Users.updateEmail(req.body);
        apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * VERIFY MOBILE NUMBER
 */
router.post('/verifyotp', async (req, res) => {
    try {
        let response = Users.verifyOtp(req.body);
        apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * RESEND OTP ON MOBILE NUMBER
 */
router.post('/resendotp', async (req, res) => {
    try {
        let response = Users.resendOtp(req.body);
        apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});

/**
 * VERIFY EMAIL_ID
 */
router.get('/verifyemail/:userId/:token', async (req, res) => {
    try {
        let response = Users.verifyEmail(req.params);
        apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        apiHandler(req, res, Promise.reject(err));
    }
});






module.exports = router;
