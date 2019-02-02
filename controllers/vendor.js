/**
* Vendor Controller
*
* @Definations :: Vendor is a user who can perform multiple actions
**/
const fs = require('fs');
const Error = require('../errors');
const VendorModel = require('../models/vendor');
const UploadService = require('../services/FileUpload');
const Store = require('./store');
const moment = require('moment');

class Vendor {

    /**
    * @description :: Save vendor details.
    * @param {String} id _id of the Category
    * @param {String} name name of the Category
    * @param {String} shortDescription shortDescription of the Category
    * @param {String} longDescription longDescription of the Category
    * @param {String} icon icon of the Category
    * @param {String} imagePath imagePath of the Category
    * @param {String} pageTitle  pageTitle of the Category
    * @param {Number} parentId parentId of the Category
    * @param {String} metaKeyword  metaKeyword of the Category
    * @param {String} metaDescription metaDescription  the Category
    * @param {String} url  url of the Category
    * @param {Boolean} active active  the Category
    * @returns {JSON} category
    */

    async create(data, imagePath, iconPath) {
        try {
            let image = await UploadService.upload(imagePath);
            let icon = await UploadService.upload(iconPath);
            let categoryData = new CategoryModel({
                name: data.name,
                shortDescription: data.shortDescription,
                longDescription: data.longDescription,
                icon: icon,
                imagePath: image,
                pageTitle: data.pageTitle,
                parentId: data.parentId,
                metaKeyword: data.metaKeyword,
                metaDescription: data.metaDescription,
                url: data.url,
                active: data.active
            });
            let result = await categoryData.save();
            return result;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async addVendorByAdmin(req, userId) {
        let req1 = req.body;
        console.log('files===========> ', req.files)
        try {
            let { gender, city, state, country, pinCode } = req1;
            let newObj = {
                gender: gender,
                userId: userId,
                city: city,
                state: state,
                country: country,
                pinCode: pinCode,
                created_at: moment(new Date()).format('YYYY-MM-DD') + "T00:00:00.000"
            };

            //general information
            if (req.files && req.files.profilePic) {
                let profilePic = await UploadService.upload(req.files.profilePic);
                newObj.profilePic = profilePic;
            }
            if (req.files && req.files.panCardImage) {
                let panCardImage = await UploadService.upload(req.files.panCardImage);
                newObj.panCardImage = panCardImage;
            }
            if (req1.streetAddress)
                newObj.streetAddress = req1.streetAddress.toLowerCase();
            if (req1.landMark)
                newObj.landMark = req1.landMark;
            if (req1.aadhaarCardNo)
                newObj.aadhaarCardNo = req1.aadhaarCardNo;
            if (req1.panCard)
                newObj.panCard = req1.panCard;
            if (req1.alternateMobileNo)
                newObj.alternateMobileNo = req1.alternateMobileNo;

            let vendor = new VendorModel(newObj);
            vendor = await VendorModel.create(vendor);

            //store information  

            if (req1.isStore) {
                let store = await Store.addStore(req, userId, vendor._id);
                return { message: "vendor created successfully!" }
            }

            return { message: "vendor created successfully!" }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }


    /**
    * @description :: Get all category
    *
    * @param void
    * @returns category
    */
    async getCategory() {
        try {
            let result = await CategoryModel.find({ active: true }, "name categoryId parentId url -_id");
            return result;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
    * @description :: Get details of a category
    *
    * @param {Number} id id of the category
    * @returns category
    */
    async getDetails(id) {
        try {
            let category = await CategoryModel.findOne({ categoryId: id });
            if (!category) {
                return Promise.reject(new Error().badRequest('Category is not found.'));
            }
            return category;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }



    /**
    * @description :: Update category details.
    *
    * @param {JSON} body
    * @param {JSON} imagePath details of the uploaded image
    * @param {JSON} iconPath details of the uploaded icon
    * @returns {JSON} category
    */
    async updateCategory(body, imagePath, iconPath) {
        try {
            let category = await CategoryModel.findOne({ categoryId: body.categoryId });
            if (!category) {
                return Promise.reject(new Error().badRequest('Category not found.'));
            }
            let UploadService = new UploadService();
            if (body.name) {
                category.name = body.name;
            }
            if (body.active) {
                category.active = body.active;
            }
            if (imagePath) {
                await UploadService.removeImages(category.imagePath);
                let image = await UploadService.upload(imagePath);
                category.imagePath = image;
            }
            if (body.shortDescription) {
                category.shortDescription = body.shortDescription;
            }
            if (body.longDescription) {
                category.longDescription = body.longDescription;
            }
            if (iconPath) {
                await UploadService.removeImages(category.icon);
                let icon = await UploadService.upload(iconPath);
                category.icon = icon;
            }
            if (body.url) {
                category.url = body.url;
            }
            if (body.metaKeyword) {
                category.metaKeyword = body.metaKeyword;
            }
            if (body.metaDescription) {
                category.metaDescription = body.metaDescription;
            }
            if (body.pageTitle) {
                category.pageTitle = body.pageTitle;
            }
            let data = await category.save();
            return data;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * @description :: Delete a category.
     * @param {Number} id id of the category
     * @returns {JSON} message
     */
    async deleteCategory(id) {
        try {
            let category = await CategoryModel.findOne({ categoryId: id });
            if (!category) {
                return Promise.reject(new Error().badRequest('Category not found.'));
            }
            let UploadService = new UploadService();
            await UploadService.removeImages(category.imagePath);
            await UploadService.removeImages(category.icon);
            await CategoryModel.remove({ _id: category._id });
            return { message: "Deleted successfully." };
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
}

module.exports = new Vendor();
