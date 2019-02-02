/**
* Category Controller
*
* @Definations :: Category Controller defines to perform various operations with help of Category Model
**/
const fs = require('fs');
const Error = require('../errors');
const AttributeModel = require('../models/attribute');
const json2csv = require('json2csv').parse;

class CategoryAttributes {

  /**
  * @description :: Get All Category Attributes
  *
  * @param void
  * @returns category attributes
  */
  async getCategoryAttributes() {
    try {
      let result = await AttributeModel.find({ active: true }).populate('category');
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Get details of a category attributes
  *
  * @param {Number} id id of the category attributes
  * @returns category attributes
  */
  async getDetails(id) {
    try {
      let category = await AttributeModel.findOne({ id: id }).populate("categoryId");
      if (!category) {
        return Promise.reject(Error.badRequest('Category Attribute is not found.'));
      }
      return category;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save  Category Attributes  Details.
  * @param {String} name name of the Category Attributes
  * @param {String} categoryId id of the Category
  * @param {Boolean} active active  the Category Attributes
  * @returns {JSON} category attributes
  */
  async create(data) {
    try {
      let attributeSet = [];
      data.attributeSet.forEach(element => {
        attributeSet.push(element);
      });
      let categoryAttributeData = new AttributeModel({
        active: data.active,
        attributeSet : attributeSet
      });
      let result = await categoryAttributeData.save();
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Update category attributes details.
  *
  * @param {String} name name of category attributes
  * @param {String} id id of category 
  * @returns {JSON} category attributes
  */
  async updateCategoryAttributes(body, attributeId) {
    try {
      // let category = await attributesModel.findOne({ id: body.id });
      // if (!category) {
      //   return Promise.reject(new Error().badRequest('Category Attributes not found.'));
      // }
      // if (body.name) {
      //   category.name = body.name;
      // }
      // if (body.active) {
      //   category.active = body.active;
      // }
      // if (body.categoryId) {
      //   category.categoryId = body.categoryId
      // }
      let attribute = await AttributeModel.findOne({_id : attributeId});
      let patches = body.patches || [];
      let result = await attribute.patch(patches, function callback(err) {
          if (err) return next(err);
          return attribute;
        });
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Delete a category attributes.
   * @param {Number} id id of the category attributes
   * @returns {JSON} message
   */
  async deleteCategoryAttributes(id) {
    try {
      let category = await AttributeModel.findOne({ id: id });
      if (!category) {
        return Promise.reject(new Error().badRequest('Category attributes not found.'));
      }
      console.log(category._id);
      await attributesModel.remove({ id: category.id });
      return { message: "Deleted successfully." };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  /**
   * @description:: Export Attribute Data in a csv
   * @param {id} id 
   */
  async exportToCsv(id) {
    let attributes = await AttributeModel.findById({ _id: id });
    var attributeSet = JSON.parse(JSON.stringify(attributes, null, '\t'))["attributeSet"];

    var fieldNames = [];
    for (var key in attributeSet[0]) {
      fieldNames.push(key);
    }
    var csv = json2csv(attributeSet, fieldNames);

    return csv;



  }


}

module.exports = CategoryAttributes;
