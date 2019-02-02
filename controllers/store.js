/**
* Vendor Controller
*
* @Definations :: Vendor is a user who can perform multiple actions
**/
const Error = require('../errors');
const UploadService = require('../services/FileUpload');
const StoreModel = require('../models/store');
const DeliveryMan = require('./deliveryMan');

class Store {

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

    async addStore(req, userId, vendorId) {
        try {
            let req1 = req.body;
            let { storeCompanyName, storeMobileNo, storeAddressProof, storePanCard,
                storeBankAccountNo, storeBankName, storeIfsc, storeGstNo, storeAddress,
                storeCity, storeZipCode, storeCountry, storeLat, storeLong } = req1;

            let panCardImage = await UploadService.upload(req.files.storePanCardImage);
            let newObj = {
                companyName: storeCompanyName,
                mobileNo: storeMobileNo,
                addressProof: storeAddressProof,
                panCard: storePanCard,
                panCardImage: panCardImage,
                bankAccountNo: storeBankAccountNo,
                bankName: storeBankName,
                ifsc: storeIfsc,
                gstNo: storeGstNo,
                address: storeAddress,
                city: storeCity,
                zipCode: storeZipCode,
                country: storeCountry,
                lat: storeLat,
                long: storeLong,
                userId: userId,
                vendorId: vendorId
            }
            if (req1.storeAbout)
                newObj.about = req1.storeAbout;
            if (req.files.storeCompanyLogo) {
                let companyLogo = await UploadService.upload(req.files.storeCompanyLogo);
                newObj.companyLogo = companyLogo;
            }
            if (req.files.storeCompanyBanner) {
                let companyBanner = await UploadService.upload(req.files.storeCompanyBanner);
                newObj.companyBanner = companyBanner;
            }
            //<---------multiple images ----------->
            // if(req.files.storeCompanyBanner){
            //     let companyBanner = await UploadService.upload(req.files.storeCompanyBanner);
            //     newObj.companyBanner = companyBanner;
            // }
            if (req1.storeAlternateMobileNo)
                newObj.alternateMobileNo = req1.storeAlternateMobileNo;
            if (req1.storePhone)
                newObj.phone = req1.storePhone;
            if (req1.storeFax)
                newObj.fax = req1.storeFax;
            if (req1.storeEmail)
                newObj.alternateMobileNo = req1.storeEmail;
            if (req1.storeOperationHours)
                newObj.operationHours = req1.storeOperationHours;
            if (req1.storeCategory)
                newObj.productCategory = req1.storeCategory;
            if (req1.storeWebsite)
                newObj.website = req1.storeWebsite;
            if (req1.storeSupportNumber)
                newObj.supportNumber = req1.storeSupportNumber;
            if (req1.storeSupportEmail)
                newObj.supportEmail = req1.storeSupportEmail;
            if (req1.storeFacebookId)
                newObj.facebookId = req1.storeFacebookId;
            if (req1.storeTwitterId)
                newObj.twitterId = req1.storeTwitterId;
            if (req1.storeMetaKeywords)
                newObj.metaKeywords = req1.storeMetaKeywords;
            if (req1.storeMetaDescription)
                newObj.metaDescription = req1.storeMetaDescription;
            if (req1.storeState)
                newObj.state = req1.storeState;

            let store = new StoreModel(newObj);
            store = await StoreModel.create(store);

            //Delivery Man
            if (req1.isDeliveryMan) {
                let deliveryMan = DeliveryMan.addDeliveryMan(req, store._id, vendorId);
                return deliveryMan;
            }
            return store;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }
}

module.exports = new Store();
