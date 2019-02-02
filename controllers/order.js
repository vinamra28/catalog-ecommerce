/**
* Order Controller
*
* @Definations :: Brand Controller defines to perform various operations with help of Order Model
**/
const fs = require('fs');
const Error = require('../errors');
const OrderModel = require('../models/order');

class Order {

  /**
  * @description :: Get All Orders
  * @param void
  * @returns order
  */
  async getOrders() {
    try {
      let result = await OrderModel.find({}).populate('userId');
      return result;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Get details of a orders
  * @param {Number} id id of the order
  * @returns order 
  */
  async getDetails(id) {
    try {
      let order = await OrderModel.findOne({id: id}).populate("orderId");
      if(!order) {
        return Promise.reject(new Error().badRequest('Order is not found.'));
      }
      return order;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
  * @description :: Save  order   Details.
  * @param {String} item, item of the order 
  * @param {String} userId, of the user
  * @param {String} transaction, transaction of the order
  * @param {String} amount, amount of the order
  * @param {String} quentity, quentity of the order
  * @returns {JSON} order 
  */
  async create({userId, item, transactionNo, amount, quentity}) {
    try {
      let order = new OrderModel({
        userId: userId,
        amount: amount,
        transactionNo: transactionNo,
        item: item,
        quentity: quentity
      });
      let result = await order.save();
      return result;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

    /**
    * @description :: Update order details
    * @param {String} item, item of the order 
    * @param {String} userId, of the user
    * @param {String} transaction, transaction of the order
    * @param {String} amount, amount of the order
    * @param {String} quentity, quentity of the order
    * @returns {JSON} order 
    */
    async update({id, item, transactionNo, amount, quentity}) {
      try {
        let order = await OrderModel.findOne({id: body.id});
        if(!order) {
          return Promise.reject(new Error().badRequest('Order not found.'));
        }
        if(item) {
          order.item = item;
        }
        if(transactionNo) {
          order.transactionNo = transactionNo;
        }
        if(amount){
          order.amount = amount
        }

        if(quentity){
            order.quentity = quentity
          }
        let data = await order.save();
        return data;
      } catch(err) {
        console.log(err);
        return Promise.reject(err);
      }
    }

    /**
     * @description :: Delete a Order.
     * @param {Number} id id of the order
     * @returns {JSON} message
     */
    async delete(id) {
      try {
        let order = await OrderModel.findOne({id: id});
        if(!order) {
          return Promise.reject(new Error().badRequest('order attributes not found.'));
        }
        await OrderModel.remove({id: order.id});
        return {message: "Deleted successfully."};
      } catch(err) {
        console.log(err);
        return Promise.reject(err);
      }
    }
}

module.exports = Order;
