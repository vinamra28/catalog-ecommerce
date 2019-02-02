/**
* Vendor Controller
*
* @Definations :: Vendor is a user who can perform multiple actions
**/
const Error = require('../errors');
const UploadService = require('../services/FileUpload');
const DeliveryModel = require('../models/deliveryMan');

class DeliveryaMan {

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

    async addDeliveryMan(req, storeId, vendorId) {
        try {
            let req1 = req.body;
            let { deliveryName, deliveryMobileNo, deliveryIdProof } = req1;

            let newObj = {
                name: deliveryName,
                mobileNo: deliveryMobileNo,
                idProof: deliveryIdProof,
                storeId: storeId,
                vendorId: vendorId
            }
            if (req1.deliveryImage)
                newObj.image = req1.deliveryImage;
            if (req1.deliveryEmail)
                newObj.email = req1.deliveryEmail

            let delivery = new DeliveryModel(newObj);
            delivery = await DeliveryModel.create(delivery);
            return delivery;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
}

module.exports = new DeliveryaMan();
