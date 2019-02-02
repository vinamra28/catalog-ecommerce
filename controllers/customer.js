const generator = require('generate-password');
const bcrypt = require('bcrypt');
const moment = require('moment');

const Error = require('../errors');
const CustomerModel = require('../models/customer');
const UserModel = require('../models/users');
const MailService = require('./Mail');
const AuthService = require('../services/AuthService');
const OtpModel = require('../models/otp');
let tokenModel = require('../models/token');

class Customer {


  //NEW APIS FOR ADMIN PANEL

  /**
   * ADD CUSTOMER : BY ADMIN
   */
  async addCustomerByAdmin(req, userId) {
    try {
      let { firstName, lastName, gender } = req;
      let newObj = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        userId: userId,
        created_at: moment(new Date()).format('YYYY-MM-DD') + "T00:00:00.000"
      };
      let address = {};
      //general information
      if (req.prefix)
        newObj.prefix = req.prefix;
      if (req.middleName)
        newObj.middleName = req.middleName;
      if (req.dob)
        newObj.dob = req.dob;
      if (req.anniversaryDob)
        newObj.anniversaryDob = req.anniversaryDob;
      if (req.alternateMobileNo)
        newObj.alternateMobileNo = req.alternateMobileNo;
      if (req.welcomeEmail)
        newObj.welcomeEmail = req.welcomeEmail;

      //address information  
      if (req.address)
        newObj.address = req.address;

      // if (req.address.prefix)
      //   address.prefix = req.address.prefix;
      // if (req.address.firstName)
      //   address.firstName = req.address.firstName;
      // if (req.address.lastName)
      //   address.lastName = req.address.lastName;
      // if (req.address.middleName)
      //   address.middleName = req.address.middleName;
      // if (req.address.company)
      //   address.company = req.address.company;
      // if (req.address.streetAddress)
      //   address.streetAddress = req.address.streetAddress;
      // if (req.address.landMark)
      //   address.landMark = req.address.landMark;
      // if (req.address.city)
      //   address.city = req.address.city;
      // if (req.address.state)
      //   address.state = req.address.state;
      // if (req.address.country)
      //   address.country = req.address.country;
      // if (req.address.zipCode)
      //   address.zipCode = req.address.zipCode;
      // if (req.address.mobileNo)
      //   address.mobileNo = req.address.mobileNo;
      // if (req.address.alternateMobileNo)
      //   address.alternateMobileNo = req.address.alternateMobileNo;
      // if (req.address.company)
      //   address.company = req.address.company;
      // if(address)
      //   newObj.address = address;


      let customer = new CustomerModel(newObj);
      customer = await CustomerModel.create(customer);
      return { message: "user created successfully!" }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }

  }

  /**
   * ADD CUSTOMER : SELF
   */
  async addCustomerSelf(req, userId) {
    let { firstName, lastName, gender } = req;

    try {
      let newObj = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        userId: userId,
        created_at: moment(new Date()).format('YYYY-MM-DD') + "T00:00:00.000"
      };
      let address = {};
      //general information
      if (req.prefix)
        newObj.prefix = req.prefix;
      if (req.middleName)
        newObj.middleName = req.middleName.toLowerCase();
      if (req.dob)
        newObj.dob = req.dob;
      if (req.anniversaryDob)
        newObj.anniversaryDob = req.anniversaryDob;
      if (req.alternateMobileNo)
        newObj.alternateMobileNo = req.alternateMobileNo;
      if (req.welcomeEmail)
        newObj.welcomeEmail = req.welcomeEmail;
      if (req.newsLetter)
        newObj.newsLetter = req.newsLetter;

      let customer = new CustomerModel(newObj);
      customer = await CustomerModel.create(customer);
      return { message: "user created successfully!" }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }

  }

  /**
   * ADD ADDRESS 
   */
  async addAddress(req) {
    let { userId, firstName, lastName, streetAddress, city, state, country, zipCode, mobileNo } = req;
    try {
      if (userId && firstName && lastName && streetAddress && city && state && zipCode && mobileNo) {
        let newObj = {
          firstName: firstName,
          lastName: lastName,
          fullname: firstName + " " + lastName,
          streetAddress: streetAddress,
          city: city,
          country: country,
          state: state,
          zipCode: zipCode,
          mobileNo: mobileNo,
        }
        let _update = {};
        if (req.prefix)
          newObj.prefix = req.prefix;
        if (req.middleName)
          newObj.middleName = req.middleName;
        if (req.company)
          newObj.company = req.company;
        if (req.landMark)
          newObj.landMark = req.landMark;
        if (req.alternateMobileNo)
          newObj.alternateMobileNo = req.alternateMobileNo;
        if (req.isBilling) {
          _update["address.$[].isBilling"] = false;
          newObj.isBilling = true;
        }

        if (req.isShipping) {
          _update["address.$[].isShipping"] = false;
          newObj.isShipping = true;
        }


        // if (req.isBilling && !req.isShipping)
        //   newObj.isShipping = false;
        // if (!req.isBilling && req.isShipping)
        //   newObj.isBilling = false;

        if (req.isBilling || req.isShipping) {
          let updateAddress = await CustomerModel.updateOne({ userId: userId }, { $set: _update })
        }

        let address = await CustomerModel.updateOne({ userId: userId }, { $push: { address: newObj } });
        return { message: "address added successfully!" }
      }
      else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * UPDATE ADDRESS
   */
  async updateAddress(req) {
    console.log('req = ', req)
    let { userId, addressId } = req;
    try {
      if (userId && addressId) {
        let newObj = {};
        let _update = {};
        if (req.prefix)
          newObj["address.$.prefix"] = req.prefix;
        if (req.firstName)
          newObj["address.$.firstName"] = req.firstName;
        if (req.lastName)
          newObj["address.$.lastName"] = req.lastName;
        if (req.middleName)
          newObj["address.$.middleName"] = req.middleName;
        if (req.company)
          newObj["address.$.company"] = req.company;
        if (req.streetAddress)
          newObj["address.$.streetAddress"] = req.streetAddress;
        if (req.landMark)
          newObj["address.$.landMark"] = req.landMark;
        if (req.city)
          newObj["address.$.city"] = req.city;
        if (req.state)
          newObj["address.$.state"] = req.state;
        if (req.country)
          newObj["address.$.country"] = req.country;
        if (req.zipCode)
          newObj["address.$.zipCode"] = req.zipCode;
        if (req.mobileNo)
          newObj["address.$.mobileNo"] = req.mobileNo;
        if (req.alternateMobileNo)
          newObj["address.$.alternateMobileNo"] = req.alternateMobileNo;
        if (req.company)
          newObj["address.$.company"] = req.company;
        if (req.alternateMobileNo)
          newObj["address.$.alternateMobileNo"] = req.alternateMobileNo;
        if (req.isBilling) {
          _update["address.$[].isBilling"] = false;
          newObj["address.$.isBilling"] = true;
        }
        if (req.isShipping) {
          _update["address.$[].isShipping"] = false;
          newObj["address.$.isShipping"] = true;
        }

        if (req.isBilling || req.isShipping) {
          let updateAddress = await CustomerModel.updateOne({ userId: userId }, { $set: _update })
        }
        let updatedAddress = await CustomerModel.updateOne({ userId: userId, "address._id": addressId },
          { $set: newObj })
        return { message: 'address update successfully!' };
      }
      else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }

  }

  /**
   * GET ALL CUSTOMERS DETAILS : BY ADMIN
   */

  async getAllUsersDetails(req) {
    let page = parseInt(req.page);
    let limit = parseInt(req.limit);
    let condition1 = {};
    let condition2 = {
      // deleted: false
    };
    try {
      if (page > 0 && limit) {
        if (req.customerId)
          condition1.customerId = { $gte: req.customerId.from, $lte: req.customerId.to }
        if (req.name) {
          let term = new RegExp(req.name, 'i');
          condition2.name = { $regex: term }
        }
        if (req.email) {
          let term = new RegExp(req.email, 'i');
          condition2.email = { $regex: term }
        }
        if (req.mobileNo) {
          let term = new RegExp(req.mobileNo);
          condition2.mobileNo = { $regex: term }
        }
        if (req.registeration) {
          let from = moment(req.registeration.from).format('YYYY-MM-DD') + "T00:00:00.000";
          let to = moment(req.registeration.to).format('YYYY-MM-DD') + "T00:00:00.000";
          condition1.created_at = { $gte: from, $lte: to };
        }
        let user = await CustomerModel.find(condition1,
          // { customerId: 1, created_at: 1, _id: 0 }
        )
          .populate({
            path: 'userId', match: { $or: [condition2] },
            //  select: { email: 1, name: 1, mobileNo: 1 }
          }).skip((page - 1) * limit).limit(limit);
        console.log('user = ', user)
        let conditionaluser = user.filter((u) => {
          return u.userId != null
        });
        user = conditionaluser ? conditionaluser : []
        // let totalRecords = await CustomerModel.countDocuments();
        let totalRecords = await CustomerModel.find(condition1).populate({ path: 'userId', match: { $or: [condition2] } });
        let conditionaltotalRecords = totalRecords.filter((u) => {
          return u.userId != null
        });
        let sendObj = {
          totalRecords: conditionaltotalRecords.length,
          userDetails: user
        }
        return sendObj;
      }
      else {
        console.log('Page and Limit error');
        return Promise.reject(Error.badRequest('page or limit not provided!'))
      }
    } catch (err) {
      console.log('error in getAlluserDetails ', err);
      return Promise.reject(Error.internal(err));
    }
  }

  /**
   * GET A CUSTOMER DETAILS BY userId
   */

  async getUserDetails(req) {
    try {
      let { userId } = req;
      if (userId) {
        let customer = await CustomerModel.findOne({ userId: userId }, { createAt: 1, address: 1 })
          .populate({ path: 'userId', select: { password: 0 } });
        if (customer) {
          return customer;
        } else {
          return Promise.reject(Error.notFound('no user found!'));
        }
      } else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }
    } catch (err) {
      console.log('err in getUserDetails', err);
      return Promise.reject(Error.internal(err));
    }

  }

  /**
   *  UPDATE USER
   */
  async updateCustomer(req) {
    try {
      let { _id } = req;
      if (_id) {
        let _update1 = {};
        let _update2 = {};

        //customer view
        if (req.type === 'delete')
          _update1.deleted = true;
        if (req.type === 'block')
          _update1.status = 'block'
        if (req.type === 'unblock')
          _update1.status = 'unblock'

        //account information

        if (req.prefix)
          _update2.prefix = req.prefix;
        if (req.middleName)
          _update2.middleName = req.middleName.toLowerCase();
        if (req.dob)
          _update2.dob = req.dob;
        if (req.anniversaryDob)
          _update2.anniversaryDob = req.anniversaryDob;
        if (req.alternateMobileNo)
          _update2.alternateMobileNo = req.alternateMobileNo;
        if (req.gender)
          _update2.gender = req.gender;
        if (req.firstName)
          _update2.firstName = req.firstName;
        if (req.lastName)
          _update2.lastName = req.lastName;

        let updatedCustomer = await CustomerModel.findOneAndUpdate({ userId: _id }, { $set: _update2 }, { new: true })
        if (req.firstName || req.lastName)
          _update1.name = updatedCustomer.firstName + " " + updatedCustomer.lastName;

        let updatedUser = await UserModel.findOneAndUpdate({ _id: _id }, { $set: _update1 });

        if (updatedUser || updatedCustomer)
          return { message: "user updated successfully!" }
        else
          return Promise.reject(Error.notFound('no user found!'));
      } else {
        return Promise.reject(Error.badRequest('incomplete parameters!'));
      }
    } catch (err) {
      console.log('err in updateCustomer', err);
      return Promise.reject(Error.internal(err));
    }
  }
























  //find User By Mail
  findByEmail(email) {
    return CustomerModel.findOne({ email });
  }

  async list() {
    try {
      let user = await CustomerModel.find();
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async adminDetails(id) {
    try {
      let user = await CustomerModel.findOne({ _id: id });
      if (!user) {
        return Promise.reject(new Error().badRequest('User is not found.'));
      }
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async add(req) {
    try {
      const result = await this.findByEmail(req.email);
      if (result) {
        return Promise.reject(Error.badRequest('this email alredy registered!'));
      }
      var salt = bcrypt.genSaltSync(2);
      var password = bcrypt.hashSync(req.password, salt);
      let user = new CustomerModel({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        mobileNo: req.mobileNo,
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
        passbookImage: req.passbookImage,
        profilePic: req.profilePic,
        panCardImage: req.panCardImage,
        productCategory: req.productCategory,
        companyStartDate: req.companyStartDate,
        gstNo: req.gstNo,
        Website: req.website
      });
      //let data = await user.save();
      let otp = await AuthService.generateOtp();
      let token = await AuthService.generateHexaToken();
      console.log('token', token);
      user = await CustomerModel.create(user);
      let otpData = {
        userId: user._id,
        otp: otp
      };
      let tokenData = {
        userId: user._id,
        token: token
      }
      await AuthService.sendOtp(req.mobileNo, otp);
      await MailService.sendTokenEmail(user, token);
      await OtpModel.create(otpData);
      await tokenModel.create(tokenData);
      return {
        userId: user._id,
        message: "OTP and Token sent successfully on mobile & email."
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async verify(userId, otp) {
    try {
      await AuthService.verifyOtp(userId, otp);
      let user = await CustomerModel.findOne({ _id: userId });
      if (!user) {
        return Promise.reject(new Error().badRequest('User not found.'));
      }
      if (!user.mobileVerified) {
        user.mobileVerified = true;
        user = await user.save();
      }
      return {
        message: user.mobileNo + ' ' + 'verified successfully'
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async verifyEmail(userId, token) {
    try {
      await AuthService.verifyToken(userId, token);
      let user = await CustomerModel.findOne({ _id: userId });
      if (!user) {
        return Promise.reject(Error.badRequest('User not found.'));
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
        user = await user.save();
      }
      return {
        message: user.email + ' ' + 'verified successfully'
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async update(req, id) {
    try {
      let user = await CustomerModel.findOne({ _id: id });
      if (!user) {
        return Promise.reject(new Error().badRequest('User is not found.'));
      }
      if (req.userName) {
        user.userName = req.userName;
      }
      if (req.firstName) {
        user.firstName = req.firstName;
      }
      if (req.lastName) {
        user.lastName = req.lastName;
      }
      if (req.email) {
        user.email = req.email;
      }
      if (req.mobileNo) {
        user.mobileNo = req.mobileNo;
      }
      if (req.userName) {
        user.userName = req.userName;
      }
      let result = await user.save();
      return result;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async changeUserPassword({ id, oldPassword, newPassword }) {
    try {
      let result = await CustomerModel.findOne({ _id: id });
      if (!result) {
        return Promise.reject(new Error().notFound('User not found.'));
      }
      if (!bcrypt.compareSync(oldPassword, result.password)) {
        return Promise.reject(new Error().badRequest('Old Password is incorrect'));
      }
      let saltRounds = 2;
      let data = await bcrypt.hash(newPassword, saltRounds);
      newPassword = data;
      let updated = await CustomerModel.findByIdAndUpdate(id, { $set: { password: newPassword } }, { new: true });
      return updated;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async delete(id) {
    try {
      let user = await CustomerModel.findOne({ _id: id });
      if (!user) {
        return Promise.reject(new Error().badRequest('User is not found.'));
      }
      await CustomerModel.remove({ _id: id });
      return { message: 'Deleted successfully.' };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async login(email, password) {
    try {
      let user = await CustomerModel.findOne({ email: email, emailVerified: true });
      if (!user) {
        return Promise.reject(Error.badRequest('Please verify your emailId first before login!'));
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return Promise.reject(new Error().badRequest('Invalid credentials.'));
      }
      let token = await AuthService.generateToken(user);
      console.log(user);
      return {
        user,
        token
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  //forget password implementations
  async forgetPassword(email) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        return Promise.reject(new Error().badRequest('Email is incorrect.'));
      }
      const password = generator.generate({
        length: 10,
        numbers: true
      });
      if (user.password) {
        let saltRounds = 2;
        let data = await bcrypt.hash(password, saltRounds);
        user.password = data;
      }
      user.save();
      var mail_service = new MailService();
      return mail_service.forgotPassword(user, password);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }





}

module.exports = new Customer();
