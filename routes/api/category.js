const express = require('express');
const router = express.Router();
const Error = require('../../errors');
const apiHandler = require('../../apiHandler');
const Category = require('../../controllers/category');
const objectId = require('mongoose').Types.ObjectId;


router.get('/getCategory', async (req, res) => {
  try {
    let category_service = new Category();
    let response = await category_service.getCategory();
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

router.post('/getcategories', async (req, res) => {
  try {
    let category_service = new Category();
    let response = await category_service.getCategories(req.params.id);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

//CREATE CATEGORY : POOJA
router.post('/createCategory', async (req, res) => {
  try {
    let category_service = new Category();

    // if (!req.files || !req.files.featuredImage || !req.files.icon ||
    //   !req.files.categorySectionImage || !req.files.megaMenuImage ||
    //   !req.files.categoryDetailImage) {
    //   return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
    // }
    let response = await category_service.create(req);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});

// router.post('/createCategory', async (req, res) => {
//   try {
//     let category_service = new Category();

//     if (!req.files || !req.files.featuredImage || !req.files.icon ||
//       !req.files.categorySectionImage || !req.files.megaMenuImage ||
//       !req.files.categoryDetailImage) {
//       return apiHandler(req, res, Promise.reject(Error.badRequest('File not found.')));
//     }
//     let response = await category_service.create(req.body, req.files);
//     return apiHandler(req, res, Promise.resolve(response));
//   } catch (err) {
//     console.log(err);
//     return apiHandler(req, res, Promise.reject(err));
//   }
// });

//Pooja
router.post('/update', async (req, res) => {
  try {
    let category_service = new Category();
    let response = await category_service.updateCategory(req);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});
// router.patch('/update/:categoryId', async (req, res) => {
//   try {
//     let category_service = new Category();
//     let image, icon;
//     if (req.files && req.files.thumbnailImage) {
//       image = req.files.thumbnailImage;
//     }
//     if (req.files && req.files.icon) {
//       icon = req.files.icon;
//     }
//     let response = await category_service.updateCategory(req.params.categoryId, req.body, image, icon);
//     return apiHandler(req, res, Promise.resolve(response));
//   } catch (err) {
//     console.log(err);
//     return apiHandler(req, res, Promise.reject(err));
//   }
// });

router.delete('/delete', async (req, res) => {
  try {
    let category_service = new Category();
    const response = await category_service.deleteCategory(req.body.categoryId);
    return apiHandler(req, res, Promise.resolve(response));
  } catch (err) {
    console.log(err);
    return apiHandler(req, res, Promise.reject(err));
  }
});


router.get('/fetch', async (req, res) => {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var queryString = "{";
  if (req.query.productId) {
    var idList = req.query.productId.split(",").map(function (val) { return "ObjectId(" + val + ")"; });;
    console.log(idList);
    if (idList.length === 1) {
      queryString += "_id :[" + idList + "],";
    } else {
      queryString += "_id" + ": { $in :[" + idList + "]},";;
    }
  }
  if (req.query.productName) {
    var productNameList = req.query.productName.split(",");
    if (productNameList.length === 1) {
      queryString += "name:" + productNameList + ",";
    } else {
      queryString += "name" + ": { $in :[" + productNameList + "]},";;
    }
  }
  if (req.query.sku) {
    var skuList = req.query.sku.split(",");
    if (skuList.length === 1) {
      queryString += "sku:" + skuList + ",";
    } else {
      queryString += "sku" + ": { $in :[" + skuList + "]},";;
    }
  }
  if (req.query.price) {
    var priceList = req.query.price.split(",");
    if (priceList.length === 1) {
      queryString += "price:" + priceList + ",";
    } else {
      queryString += "price" + ": { $in :[" + priceList + "]},";;
    }

  }

  queryString = queryString.slice(0, -1);
  queryString += "}";

  console.log(queryString);

  var pagination = {}
  if (pageNo < 0 || pageNo === 0) {
    err = { "error": true, "code": 400, "message": "invalid page number, should start with 1" };
    return apiHandler(req, res, Promise.reject(err));
  }
  pagination.skip = size * (pageNo - 1);
  pagination.limit = size;
  try {
    let category_service = new Category();
    const response = await category_service.findByCategoryId(queryString, pagination);
    return apiHandler(req, res, Promise.resolve(response));

  } catch (err) {
    return apiHandler(req, res, Promise.reject(err));
  }

});

module.exports = router;
