/**
* Attribute Value Controller
*
* @Definations :: Attribute Value Controller defines to perform various operations with help of Attribute Value Model
**/
const fs = require('fs');
const Error = require('../errors');
const AttributeValue = require('../models/attributeValue');

class AttributesValue {

  /**
  * @description :: Get All Attribute Value
  *
  * @param void
  * @returns  attributes value
  */
  async getAttributeValue() {
    try {
      let result = await AttributeValue.find({active: true}).populate('categoryattributes');
      return result;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Get details of a  attributes value
  *
  * @param {Number} id id of the  attributes value
  * @returns  attributes value model
  */
  async getDetails(id) {
    try {
      let value = await AttributeValue.findOne({id: id}).populate("attributeId");
      if(!value) {
        return Promise.reject(new Error().badRequest('Attribute value is not found.'));
      }
      return value;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save   Attributes Value  Details.
  * @param {String} name name of the  Attributes Value
  * @param {String} categoryId id of the Attributes Value
  * @param {Boolean} active active  the  Attributes Value
  * @returns {JSON}  attributes value
  */
  async create(data) {
    try {
      let attributeValueData = new AttributeValue({
        name: data.name,
        active: data.active,
        attributeId: data.attributeId
      });
      let result = await attributeValueData.save();
      return result;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

    /**
    * @description :: Update  attributes value details.
    *
    * @param {String} name name of  attributes value
    * @param {String} id id of category 
    * @returns {JSON}  attributes value
    */
    async updateAttributesValue(body) {
      try {
        let value = await AttributeValue.findOne({id: body.id});
        if(!value) {
          return Promise.reject(new Error().badRequest('Category Attributes not found.'));
        }
        if(body.name) {
            value.name = body.name;
        }
        if(body.active) {
            value.active = body.active;
        }
        if(body.attributeId){
            value.attributeId = body.attributeId
        }
        let data = await value.save();
        return data;
      } catch(err) {
        console.log(err);
        return Promise.reject(err);
      }
    }

    /**
     * @description :: Delete a  attributes value
     * @param {Number} id id of the  attributes value
     * @returns {JSON} message
     */
    async deleteAttributeValue(id) {
      try {
        let value = await AttributeValue.findOne({id: id});
        if(!value) {
          return Promise.reject(Error.badRequest('Attributes value not found.'));
        }
        await AttributeValue.remove({_id: value._id});
        return {message: "Deleted successfully."};
      } catch(err) {
        console.log(err);
        return Promise.reject(err);
      }
    }
}

module.exports = AttributesValue;
