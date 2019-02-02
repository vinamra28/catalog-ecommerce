/**
 * Cart API
 * 
 * @Definition :: Defines controller end points for Cart operations  
 */
const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Cart = require('../../controllers/cart');
const objectId = require('mongoose').Types.ObjectId;

/**
 * TODO
// const app = require('express')();
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);

// const store = new MongoDBStore({
//     uri: 'mongodb://localhost:27017/db',
//     collection: 'sessions'
// });

// app.use(session({
//   secret: 'secret session key',
//   resave: false,
//   saveUninitialized: true,
//   store: store,
//   unset: 'destroy',
//   name: 'session cookie name'
// }));
 */

// show all the products present in the cart
router.get('/fetch/:id', async (req, res) => {
  try {
    let cartService = new Cart();
    let response = await cartService.getCartByUser(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    console.error(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

// add a product to the cart
router.post('/add/:id', async (req, res) => {
  try {
    let cartService = new Cart();
    let response = await cartService.addToCart(req.params.id, req.body);
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    console.error(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

//remove a product from the cart
router.post('/remove/:id', async (req, res) => {
  try {
    let cartService = new Cart();
    let response = await cartService.removeFromCart(req.params.id, req.body);
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    console.error(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

//empty the cart
router.post('/empty/:id', async (req, res) => {
  try {
    let cartService = new Cart();
    let response = await cartService.emptyCart(req.params.id);
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

//update the quantity of the product in the cart
router.post('/update/:id', async (req, res) => {
  try {
    let cartService = new Cart();
    let response = await cartService.updateQty(req.params.id, req.body);
    apiHandler(req, res, Promise.resolve(response));
  }
  catch (err) {
    console.log(err);
    apiHandler(req, res, Promise.reject(err));
  }
});

module.exports = router;