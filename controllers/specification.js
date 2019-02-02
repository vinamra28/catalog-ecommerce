/**
* Specification Controller
*
* @Definations :: Specification Controller defines to perform various operations with help of specification Model
**/
const fs = require('fs');
const Error = require('../errors');
const SpecificationsModel = require('../models/specification');
const ObjectId = require('mongoose').Types.ObjectId;



class CategorySpecification {


    /**
     * @description get all specification for the category selected
     * @param {Number} id id of the category 
     * @returns specification of the category
     */
    async getCategorySpecification(id, pagination) {
        try {
            let specification = await SpecificationsModel.find({ parentCategoryId: ObjectId(id) })
                .skip(pagination.skip)
                .limit(pagination.limit);
            if (!specification) {
                return Promise.reject(Error.badRequest('No Specification found.'));
            }
            return specification;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * @description add new description in a category
     * 
     * @param {data} data 
     * @param {id} id 
     */
    async addSpecification(data, id) {
        try {
            let specificationData = new SpecificationsModel({
                parentCategoryId: id,
                title: data.title,
                fieldType: data.fieldType,
                mandatory:data.mandatory,
                values: data.values
            });

            let result = await specificationData.save();
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /** 
     * @description delete specfication
     * 
     * @param {data} data 
     * @param {id} id 
     */
    async deleteSpecification(data, id) {
        try {
            let response = await SpecificationsModel.remove({ parentCategoryId: ObjectId(id), title: { $in: data.titles } });
            console.log(response);
           // Site.deleteMany();
            return response;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }

    }

}
module.exports = CategorySpecification;