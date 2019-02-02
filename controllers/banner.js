/**
* Banner Controller
*
* @Definations :: Banner Controller defines to perform various operations with help of Banner Model
**/
const fs = require('fs');
const Error = require('../errors');
const BannerModel = require('../models/banner');
const UploadService = require('../services/FileUpload');
const ImageModel = require('../models/image');
const ObjectId = require('mongoose').Types.ObjectId;

class Banner {
    //@ Kushagra

    /**
    * @description :: Save new banner.
    * @param {String} name name of the banner 
    * @param {Number} size.width  of the banner
    * @param {Number} size.height  of the banner
    * @param {String} redirectUrl redirectUrl the banner
    * @param {Number} duration in seconds
    * @param {String} target -enum: ['same window', 'new window']
    * @returns {JSON} banner 
    */
    async createBanner(bannerDetails, imagesArray) {
        try {
            let uploadedImages;
            let uploadedImagesIds = [];
            if (imagesArray ) {
                uploadedImages = await this.uploadImagesArray(imagesArray);
                uploadedImages.ops.forEach(model => {
                    uploadedImagesIds.push(ObjectId(model._id));
                });
            }
            const banner = new BannerModel({
                name: bannerDetails.name,
                size: {
                    width: JSON.parse(bannerDetails.size).width,
                    height: JSON.parse(bannerDetails.size).height
                },
                photos: uploadedImagesIds,
                redirectUrl: bannerDetails.redirectUrl,
                duration: bannerDetails.duration,
                target: bannerDetails.target
            });
            const res = await banner.save();
            return res;
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    }

    /**
    * @description :: get banner by id.
    * @param {String} id id of the banner
    */
    async getBannerById(bannerId) {
        try {
            const banner = await BannerModel.findOne({ _id: bannerId });
            if (!banner) {
                return Promise.reject(Error.badRequest('Banner not found.'));
            }
            return banner;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async getAllBanners() {
        try {
            const banners = await BannerModel.find({});
            if (!banners.length > 0) {
                return Promise.reject(Error.badRequest('Banners not found.'));
            }
            return banners;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async updateBannerById(bannerId, body) {
        try {            
            let banner = await BannerModel.findByIdAndUpdate(bannerId, body);
            const res = await banner.save();
            return res;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async deleteBannerById(bannerId) {
        try {
            let banner = await BannerModel.findOne({ id: bannerId });
            if (!banner) {
                return Promise.reject(new Error().badRequest('No banner found.'));
            }
            console.log(banner._id);
            await BannerModel.remove({ id: banner.id });
            return { message: "Deleted successfully." };
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async uploadImagesArray(imagesArray) {
        try {

            let uploadedImages = [];
            for (const image of imagesArray) {
                let uploadedImagePath = await UploadService.upload(image);
                let imageDocument = new ImageModel({
                    filename: uploadedImagePath,
                    isPrimaryImage: null
                });
                uploadedImages.push(imageDocument);
            }
            let result = await ImageModel.collection.insertMany(uploadedImages, { ordered: true });
            return result;
        } catch (err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

}

module.exports = Banner;


