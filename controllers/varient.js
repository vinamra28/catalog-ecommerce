/**
* Varient Controller
*
* @Definations :: Varient Controller defines to perform various operations with help of Varient Model
* */
const fs = require('fs');
const Error = require('../errors');
const VarientModel = require('../models/varient');

class Varient {
  /**
  * @description :: Get All Varient
  * @param void
  * @returns varient
  */
  async getVarient() {
    try {
      const result = await VarientModel.find({ active: true ,  }).populate('categoryId').populate('attributeId');
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Get details of a varient
  * @param {Number} id id of the varient
  * @returns varient
  */
  async getDetails(id) {
    try {
      const result = await VarientModel.findOne({ id ,  }).populate('categoryId').populate('attributeId');
      if (!result) {
        return Promise.reject(new Error().badRequest('Varient is not found.'));
      }
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save  Varient Details
  * @param {String} name name of the Varient
  * @param {String} categoryId id of the Category
  * @param {String} attributeId id of the Attribute
  * @param {Boolean} active active  the Varient
  * @returns {JSON} Varient Model
  */
  async create(data) {
    try {
      const varientData = new VarientModel({
        name: data.name,
        active: data.active,
        categoryId: data.categoryId,
        attributeId: data.attributeId,
      });
      const result = await varientData.save();
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
    * @description :: Update Varient details.
    * @param {String} name name of category attributes
    * @param {Number} id id of category
    * @param {Number} id id of attribute
    * @returns {JSON} varient
    */
  async updateVarient(body) {
    try {
      const result = await VarientModel.findOne({ id: body.id, });
      if (!result) {
        return Promise.reject(new Error().badRequest('Varient not found.'));
      }
      if (body.name) {
        result.name = body.name;
      }
      if (body.active) {
        result.active = body.active;
      }
      if (body.categoryId) {
        result.categoryId = body.categoryId;
      }
      if (body.attributeId) {
        result.attributeId = body.attributeId;
      }
      const data = await result.save();
      return data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
     * @description :: Delete a Varient.
     * @param {Number} id id of the varient
     * @returns {JSON} message
     */
  async deleteVarient(id) {
    try {
      const result = await VarientModel.findOne({ id ,  });
      if (!result) {
        return Promise.reject(new Error().badRequest('Varients not found.'));
      }
      await VarientModel.remove({ id: result.id ,  });
      return { message: 'Deleted successfully.', };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = Varient;
