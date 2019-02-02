const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');

// set up auth middleware

auth = (req, res, next) => {
	const token = req.header("x-auth");
	return AuthService.findByToken(token).then((user) => {
		req.user = user;
		next();
	}).catch((err) => {
		console.log(err);
		apiHandler(req, res, Promise.reject(err));
	});
};

const userRoutes = require('./api/users');
const customerRoutes = require('./api/customer');
const adminRoutes = require('./api/admin');
const categoryRoutes = require('./api/category');
const attributesRoutes = require('./api/attributes');
const attributesValueRoutes = require('./api/attributeValue');
const varientRoutes = require('./api/varient');
const brandRoutes = require('./api/brand');
const supplierRoutes = require('./api/supplier');
const specificationRoutes = require('./api/specification');
const productRoutes = require('./api/product');
const bannerRoutes = require('./api/banner');
const cartRoutes = require('./api/cart');

router.use('/admin/', adminRoutes);
router.use('/user/', userRoutes);
router.use('/customer/', customerRoutes);
router.use('/category/'/*, auth*/, categoryRoutes);
router.use('/categoryattributes/'/*, auth*/, attributesRoutes);
router.use('/attributevalue/', /*auth,*/ attributesValueRoutes);
router.use('/varient/', auth, varientRoutes);
router.use('/brand/', /*auth,*/ brandRoutes);
router.use('/supplier/', auth, supplierRoutes);
router.use('/specification', specificationRoutes);
router.use('/product', productRoutes);
router.use('/banner', bannerRoutes);
router.use('/cart',cartRoutes);

module.exports = router;
