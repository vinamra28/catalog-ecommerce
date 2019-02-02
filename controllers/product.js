/**
 * Product Controller
 * 
 * @Definitions :: Product Controller specifies operations to perform with the help of Product model
 */

const fs = require('fs');
const Error = require('../errors');
//var searchable = require('mongoose-searchable');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const BrandModel = require('../models/brand');
const ImageModel = require('../models/image');
const UploadService = require('../services/FileUpload');
const ObjectId = require('mongoose').Types.ObjectId;


class Product {
    /**
     * @description :: Get all products for listing
     * 
     * @param  void
     * @returns product list
     */
    async getProductListing() {
        try {
            let result = await ProductModel.find({}, { name: 1, title: 1, subtitle: 1, photos: 1 });
            if (!result) {
                return Promise.reject(new Error().badRequest('No Products found'));
            }
            return result;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

    async createProduct(data, imagesArray) {
        try {
            let uploadedImages;
            let uploadedImagesIds = [];
            let categoriesArray = [];
            let sellingDetailSchema;
            if (imagesArray) {
                uploadedImages = await this.uploadImagesArray(imagesArray);
                uploadedImages.ops.forEach(model => {
                    uploadedImagesIds.push(ObjectId(model._id));
                });
            }
            if (data.categories) {
                categoriesArray = this.createCategoriesArray(data.categories);
            }
            if (data.sellingDetails) {
                sellingDetailSchema = this.createSellingDetailsSchema(data.sellingDetails);
            }
            let variations = [];
            if (data.variations) {
                data.variations.forEach(element => {
                    variations.push({
                        productId: ObjectId(element)
                    })
                });
            }
            let product = new ProductModel.ProductModel({
                title: data.title,
                subtitle: data.subtitle,
                brandId: data.brandId,
                displayOnHomeScreen: data.displayOnHomeScreen,
                photos: uploadedImagesIds,
                categories: categoriesArray,
                sellingDetails: sellingDetailSchema,
                variations: variations
            });

            let result = await product.save();
            return result;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }

    }

    async getProductSearchList(params) {
        let criteria = {};
        if (params.productId) {
            criteria["_id"] = ObjectId(params.productId);
        }
        if (params.title) {
            criteria["title"] = { "$regex": params.title, "$options": 'i' };
        }
        if (params.price) {
            let priceRange = params.price;
            let prices = priceRange.split("-", 2);
            criteria["sellingDetails.price"] = { "$gt": parseInt(prices[0]), "$lt": parseInt(prices[1]) };
        }
        if (params.sku) {
            criteria["sku"] = { "$regex": params.sku, "$options": 'i' };
        }
        try {
            console.log(criteria);
            let result = await ProductModel.ProductModel.find(criteria);
            return result;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }


    }


    async fetchProducts(searchKey) {
        var categoryIds = []
        let categoryResult = await CategoryModel.find({}, { _id: 1 }).or([{ "name": { $regex: searchKey, $options: 'i' } }]);
        categoryResult.forEach(function (doc) { categoryIds.push(doc._id) });

        var brandIds = [];
        let brandResult = await BrandModel.find({}, { _id: 1 }).or([{ "name": { $regex: searchKey, $options: 'i' } }]);
        brandResult.forEach(function (doc) { brandIds.push(doc._id) });

        let resultProduct = await ProductModel.ProductModel.find({}, { name: 1, title: 1, subtitle: 1, photos: 1 })
            .or([{ "title": { $regex: searchKey, $options: 'i' } }]).or([{ "categoryId": { $in: categoryIds } }]).or([{ "brandId": { $in: brandIds } }]);

        if (!resultProduct) {
            return Promise.reject(new Error().badRequest('No Products found'));
        }
        return resultProduct;
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }


    async uploadImagesArray(imagesArray) {
        try {
            //let uploadService =  UploadService();
            let uploadedImages = [];
            for (const image of imagesArray) {
                let uploadedImagePath = await UploadService.upload(image);
                //Promise.resolve(uploadedImagePath);
                let imageDocument = new ImageModel({
                    filename: uploadedImagePath,
                    isPrimaryImage: imagesArray.indexOf(image) === 0
                });
                uploadedImages.push(imageDocument);
            }
            //Promise.all(uploadedImages);
            let result = await ImageModel.collection.insertMany(uploadedImages, { ordered: true });
            return result;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

    async fetchProductsByCategory(categoryId) {
        try {
            let products = await ProductModel.ProductModel.find({ "categories.categoryId": categoryId });
            if (Object.keys(products).length === 0) {
                console.log("No Products Found")
                return Promise.reject(Error.badRequest('No Products found'));
            }
            return products;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }

    }

    createCategoriesArray(categoriesArrayArg) {
        let categoriesArray = [];
        for (let i = 0; i < categoriesArrayArg.length; i++) {
            let category = {
                categoryId: categoriesArrayArg[i],
                isPrimary: i === 0
            };
            categoriesArray.push(category);
        }

        return categoriesArray;
    }

    createSellingDetailsSchema(sellingDetailsArgs) {
        let sellingDetails = new ProductModel.SellingDetailSchema({
            duration: sellingDetailsArgs.duration,
            listingTime: sellingDetailsArgs.listingTime,
            price: sellingDetailsArgs.price,
            quantity: sellingDetailsArgs.quantity,
            returnOption: sellingDetailsArgs.returnOption
        });

        return sellingDetails;
    }
}

module.exports = Product;