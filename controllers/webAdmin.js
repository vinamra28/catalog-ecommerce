/**
 * Admin Controller
 * This file is responsible to handle admin related requests.
 */

let AdminModel = require('../models/customer');
const bcrypt = require('bcrypt');
const MailService = require('./Mail');
// const generator = require('generate-password');
const AuthService = require('../services/AuthService');
const OtpModel = require('../models/otp');
let tokenModel = require('../models/token');
const UploadService = require('../services/FileUpload');
// let AdminModel = require('../models/adminModel');
// let CategoryModel = require('../models/categoryModel');
// let InterestModel = require('../models/interestModel');
// let SubCategoryModel = require('../models/subCategoryModel');
// let EventModel = require('../models/eventModel');

class Admin {
  //find User By Mail
  findByEmail(email) {
    return AdminModel.findOne({email});
  }
  async login(email, password) {
    try {
      let admin = await AdminModel.findOne({ email: email, password: password});
      console.log(admin);
      return admin;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /* this method is written to fetch stats showing in dashboard */
  async getStats() {
    try {
      let userCount = await AdminModel.count();
    //   let categoryCount = await CategoryModel.count();
    //   let subCategoryCount = await SubCategoryModel.count();
    //   let interestCount = await InterestModel.count();
    //   let eventCount = await EventModel.count();
      return {
        userCount
      };
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async getUsers() {
    try {
      let users = await AdminModel.find({}, "_id firstName lastName username email mobileNo");
      return users;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async getCategory() {
    try {
      let category = await CategoryModel.find({}, "_id name backgroundImage");
      return category;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async getEvents() {
    try {
      let events = await EventModel.find().populate('categoryId').populate('subCategoryId');
      return events;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async getSubCategory() {
    try {
      let subCategory = await SubCategoryModel.find().populate('categoryId');
      return subCategory;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  // ===============================
  async addUser(req){
    try{
      console.log(req);
      const result = await this.findByEmail(req.email);
      if(result) {
        return Promise.reject('this email alredy registered!');
      }

      let uploadService = new UploadService();
      let passbookImage = await uploadService.upload(req.passbookImage);
      let profilePic    = await uploadService.upload(req.profilePic);
      let panCardImage  = await uploadService.upload(req.panCardImage);

      var salt = bcrypt.genSaltSync(2);
      var password = bcrypt.hashSync(req.password, salt);
      // password = hash;
      let user = new AdminModel({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        mobileNo: req.mobile,
        userName: req.userName,
        password: password,
        role: req.userRole,
        Address: req.address,
        Phone: req.phone,
        Fax: req.fax,
        companyName: req.companyName,
        pinCode: req.pinCode,
        aadharCard: req.aadharCardNumber,
        panCard: req.panCardNumber,
        bankAccountNo: req.bankAccountNumber,
        bankName: req.bankName,
        IFSC: req.ifsc,
        passbookImage: passbookImage,
        profilePic: profilePic,
        panCardImage: panCardImage,
        productCategory: req.productCategory,
        companyStartDate: req.companyStartDate,
        gstNo: req.gstNo,
        Website: req.website
      });


      let data = await user.save();
      let otp = await AuthService.generateOtp();
      let token = await AuthService.generateHexaToken();
      console.log('token', token);
      user = await AdminModel.create(user);
      let otpData = {
        userId: user._id,
        otp: otp
      };
      let tokenData = {
        userId: user._id,
        token: token
      }
      await AuthService.sendOtp(mobileNo, otp);
      await MailService.sendTokenEmail(user, token);
      await OtpModel.create(otpData);
      await tokenModel.create(tokenData);
      return {
        userId: user._id,
        message: "OTP and Token sent successfully on mobile & email."
      }
    }
    catch(err){
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = new Admin();
