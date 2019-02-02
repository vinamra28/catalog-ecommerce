const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const Admin = require('../../controllers/adminController');
const apiHandler = require('../../apiHandler');

// get all user records
router.get('/get', async (req, res) => {
  try {
    let admin = new Admin();
    let response;
    if (req.query.id) {
      response = await admin.adminDetailsById(req.query.id);
    }
    else {
      response = await admin.list();
    }
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});




router.post('/login', async (req, res) => {
  try {
    let admin = new Admin();
    let response = await admin.findByCredentials(req.body.email, req.body.password);
    apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    apiHandler(req, res, Promise.reject(err));
  }
});
//  admin signup page
// router.post('/add', async (req, res, next)=> {
//   try {
//     console.log(req.body.firstName)
//     let user = new Admin();
//   	let response = await user.add(
//       req.body.firstName, 
//       req.body.lastName, 
//       req.body.email, 
//       req.body.mobileNo, 
//       req.body.userName, 
//       req.body.password);
//     apiHandler(req, res, Promise.resolve(response));
//   } catch(err) {
//     apiHandler(req, res, Promise.reject(err));
//   }
// });
// // admin update 
// router.patch('/update/:id' , async (req, res) => {
//   try {
//     let admin = new Admin();
//   	let response = await admin.update(req.body, req.params.id);
//   	apiHandler(req, res, Promise.resolve(response));
//   } catch(err) {
//     apiHandler(req, res, Promise.reject(err));
//   }
// });

// router.patch('/changepass/' , async (req, res) => {
//   try {
//     let admin = new Admin();
//   	let response = await admin.changeAdminPassword(req.body);
//   	apiHandler(req, res, Promise.resolve(response));
//   } catch(err) {
//     apiHandler(req, res, Promise.reject(err));
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   try {
//     let admin = new Admin();
//   	let response = await admin.delete(req.params.id);
//   	apiHandler(req, res, Promise.resolve(response));
//   } catch(err) {
//     apiHandler(req, res, Promise.reject(err));
//   }
// });

// router.post('/forget-password', async function(req, res) {
//   try {
//     var admin = new Admin();
//     await admin.forgetPassword(req.body.email);
//     res.send({ message:"Mail sent." });
//     } catch (err) {
//       apiHandler(req, res, Promise.reject(err));
//     }
// });






module.exports = router;
