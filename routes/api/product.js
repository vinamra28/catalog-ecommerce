/**
 * Product API
 * 
 * @Definition :: Defines controller end points for Product operations  
 */
const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Product = require('../../controllers/product');
const objectId = require('mongoose').Types.ObjectId;

router.get('/getProductListing', async (req, res) => {
    try {
        let productService = new Product();
        let response = await productService.getProductListing();
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.error(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});

router.get('/searchProducts', async (req, res) => {
    try {
        let productService = new Product();
        let response = await productService.getProductSearchList(req.query);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.log(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});

router.post('/create', async (req, res) => {
    try {
        let productService = new Product();
        if (!req.files.images) {
            return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
        }

        let imagesArray = req.files.images
        let response = await productService.createProduct(req.body, imagesArray);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.error(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});

router.post('/fetch', async (req, res) => {
    try {
        let productService = new Product();
        let response = await productService.fetchProducts(req.body.search);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.error(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});


router.get('/fetchByCategory/:id', async (req, res) => {
    try {
        let productService = new Product();
        let response = await productService.fetchProductsByCategory(req.params.id);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.log(err);
        return apiHandler(req, res, Promise.reject(err));
    }


});

module.exports = router;