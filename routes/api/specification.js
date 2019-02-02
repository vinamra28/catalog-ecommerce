const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Specification = require('../../controllers/specification');



router.get('/fetch/:id', async (req, res) => {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var pagination = {}
    if (pageNo < 0 || pageNo === 0) {
        err = { "error": true, "code": 400, "message": "invalid page number, should start with 1" };
        return apiHandler(req, res, Promise.reject(err));
    }
    pagination.skip = size * (pageNo - 1);
    pagination.limit = size;
    try {
        let specification_service = new Specification();
        let response = await specification_service.getCategorySpecification(req.params.id, pagination);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.log(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});


router.post('/addSpecification/:id', async (req, res) => {
    try {
        let specification_service = new Specification();
        let response = await specification_service.addSpecification(req.body, req.params.id);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.log(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});
module.exports = router;

router.delete('/deleteSpecification/:id', async (req, res) => {
    try {
        let specification_service = new Specification();
        let response = await specification_service.deleteSpecification(req.body, req.params.id);
        return apiHandler(req, res, Promise.resolve(response));
    } catch (err) {
        console.log(err);
        return apiHandler(req, res, Promise.reject(err));
    }
});