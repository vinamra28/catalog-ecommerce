/**
 * Supplier Controller
 * This controller is responsible for defining the actions related to supplier entity.
 */

const SupplierModel = require('../models/supplier');
const Error = require('../errors');

class Supplier {

  /**
   * @description :: Get all suppliers.
   * @param void
   * @returns {JSON} suppliers
   */
  async list() {
    try {
      let supplier = await SupplierModel.find({}, "-__v");
      return supplier;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Get supplier details.
   * @param {String} supplierId _id of the supplier
   * @returns {JSON} supplierDetails
   */
  async details(supplierId) {
    try {
      let supplier = await SupplierModel.findOne({_id: supplierId}, "-__v");
      if(!supplier) {
        return Promise.reject(new Error().badRequest('Supplier not found.'));
      }
      return supplier;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Add new supplier.
   * @param {String} companyName
   * @param {String} firstName
   * @param {String} lastName
   * @param {String} title
   * @param {String} address
   * @param {String} city
   * @param {String} state
   * @param {Number} postalCode
   * @param {String} country
   * @param {Number} contactNo
   * @param {String} email
   * @param {String} url
   * @returns {JSON} supplier
   */
  async add(companyName, firstName, lastName, title, address, city, state, postalCode, country, contactNo, email, url) {
    try {
      let supplier = new SupplierModel({
        companyName,
        firstName,
        lastName,
        title,
        address,
        city,
        state,
        postalCode,
        country,
        contactNo,
        email,
        url
      });
      supplier = await supplier.save();
      return supplier;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Update supplier details.
   * @param {String} supplierId _id of the supplier
   * @param {String} companyName
   * @param {String} firstName
   * @param {String} lastName
   * @param {String} title
   * @param {String} address
   * @param {String} city
   * @param {String} state
   * @param {Number} postalCode
   * @param {String} country
   * @param {Number} contactNo
   * @param {String} email
   * @param {String} url
   * @returns {JSON} supplier
   */
  async update(supplierId, companyName, firstName, lastName, title, address, city, state, postalCode, country, contactNo, email, url) {
    try {
      let supplier = await SupplierModel.findOne({ _id: supplierId });
      if(!supplier) {
        return Promise.reject(new Error().badRequest('Supplier not found.'));
      }
      if(companyName) {
        supplier.companyName = companyName;
      }
      if(firstName) {
        supplier.firstName = firstName;
      }
      if(lastName) {
        supplier.lastName = lastName;
      }
      if(title) {
        supplier.title = title;
      }
      if(address) {
        supplier.address = address;
      }
      if(city) {
        supplier.city = city;
      }
      if(state) {
        supplier.state = state;
      }
      if(postalCode) {
        supplier.postalCode = postalCode;
      }
      if(country) {
        supplier.country = country;
      }
      if(contactNo) {
        supplier.contactNo = contactNo;
      }
      if(email) {
        supplier.email = email;
      }
      if(url) {
        supplier.url = url;
      }
      supplier = await supplier.save();
      return supplier;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * @description :: Delete a supplier.
   * @param {String} supplierId _id of the supplier
   * @returns {JSON} message
   */
  async delete(supplierId) {
    try {
      if(!supplierId) {
        return Promise.reject(new Error().badRequest('Please enter supplier ID.'));
      }
      let supplier = await SupplierModel.findOne({ _id: supplierId });
      if(!supplier) {
        return Promise.reject(new Error().badRequest('Supplier not found.'));
      }
      await SupplierModel.remove({ _id: supplierId });
      return { message: 'Deleted successfully.' };
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = new Supplier();
