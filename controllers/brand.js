/**
* Brand Controller
*
* @Definations :: Brand Controller defines to perform various operations with help of Brand Model
**/
const fs = require('fs');
const Error = require('../errors');
const BrandModel = require('../models/brand');

class Brand {

  /**
  * @description :: Get All brand
  * @param void
  * @returns brand
  */
  async getBrand() {
    try {
      let result = await BrandModel.find({ active: true }).populate('categoryId');
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Get details of a brand
  * @param {Number} id id of the brand
  * @returns brand 
  */
  async getDetails(id) {
    try {
      let brand = await BrandModel.findOne({ id: id }).populate("categoryId");
      if (!brand) {
        return Promise.reject(Error.badRequest('Brand is not found.'));
      }
      return brand;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save  brand   Details.
  * @param {String} name name of the brand 
  * @param {String} categoryId id of the brand
  * @param {Boolean} active active  the brand
  * @returns {JSON} brand 
  */
  async create(data) {
    try {
      let brand = new BrandModel({
        name: data.name,
        active: data.active,
        categoryId: data.categoryId
      });
      let result = await brand.save();
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Update brand details
  * @param {String} name name of brand
  * @param {String} id id of brand 
  * @returns {JSON} brand 
  */
  async updateBrand(body) {
    try {
      let brand = await BrandModel.findOne({ id: body.id });
      if (!brand) {
        return Promise.reject(Error.badRequest('Brand not found.'));
      }
      if (body.name) {
        brand.name = body.name;
      }
      if (body.active) {
        brand.active = body.active;
      }
      if (body.categoryId) {
        brand.categoryId = body.categoryId
      }
      let data = await brand.save();
      return data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Delete a brand.
   * @param {Number} id id of the brand
   * @returns {JSON} message
   */
  async deleteBrand(id) {
    try {
      let brand = await BrandModel.findOne({ id: id });
      if (!brand) {
        return Promise.reject(new Error().badRequest('brand attributes not found.'));
      }
      console.log(brand._id);
      await BrandModel.remove({ id: brand.id });
      return { message: "Deleted successfully." };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = Brand;
