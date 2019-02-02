/**
 * Auth Service
 * This service will handle all the task related to authentication.
 */

const jwt = require('jsonwebtoken');
const request = require('request');
const http = require('http');
const crypto = require('crypto');
const SendOtp = require('sendotp');

const UserModel = require('../models/customer');
const OtpModel = require('../models/otp');
const TokenModel = require('../models/token');

const pkg = require('../package');
const Error = require('../errors');
const constant = require('../config/constant');
const Config = require('../config');
const apiHandler = require('../apiHandler');

// OTP CONFIGURATIONS
const sendOtp = new SendOtp(Config.authKey);
sendOtp.setOtpExpiry(1); //in minutes


class AuthService {

  /**
   * AUTH MIDDLEWARE: VERIFY TOKEN
   */
  async auth(req, res, next) {
    console.log("authorization === ", req.headers.authorization);
    
    try {
      let headerToken = req.headers.authorization
      if (headerToken) {
        let f1 = headerToken.split('Bearer');
        let encrypt = f1[1];
        let token = encrypt.trim();
        if (token) {
          console.log("token");
          jwt.verify(token, constant.secretKey, (err, decode) => {
            if (err) {
              apiHandler(req, res, Promise.reject(Error.badRequest(err)));
            } else {
              // console.log('data = ', data);
              req.body.decodeUserId = decode._id;
              next();
            }
          });
        }
        else {
          return Promise.reject(Error.badRequest('token required!'));
        }
      }
      else {
        return Promise.reject(Error.badRequest('token required!'));
      }
    } catch (err) {
      return Promise.reject(err);
    }
  };

  async findByMobile(mobileNo) {
    try {
      let user = await UserModel.findOne({ mobileNo });
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async findByEmail(email) {
    try {
      let user = await UserModel.findOne({ email: email, emailVerified: true });
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async findByUserId(userId) {
    try {
      let user = await UserModel.findOne({ socialId: userId });
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async findByToken(token) {
    try {
      let decode;
      decode = jwt.verify(token, pkg.config.secret);
      let user = await UserModel.findOne({ _id: decode._id });
      return user;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async generateToken(user) {
    try {
      let token = jwt.sign({ _id: user._id, role: user.role }, constant.secretKey, {
        expiresIn: constant.expiresIn,
        issuer: constant.issuer
      })
      return token;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * GENERATE HEXA TOKEN
   */
  async generateHexaToken() {
    try {
      let token = await crypto.randomBytes(48);
      return token.toString('hex');
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async generateOtp() {
    try {
      let random = Math.floor(100000 + Math.random() * 900000);
      return random;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }



  async verify(userId, otp) {
    try {
      let data = await OtpModel.findOne({ userId: userId, expired: false });
      // let currentTime = await new Date();
      // let time = await currentTime.getMinutes();
      // console.log('current', time);
      // console.log(data.time);
      // if(time <= data.time) {
      //   data.expired = true; 
      //   await data.save();
      //   return Promise.reject(Error.badRequest('OTP is incorrect.'));
      // }
      if (!data || data.otp !== Number(otp)) {
        return Promise.reject(Error.badRequest('OTP is incorrect.'));
      }
      data.expired = true;
      await data.save();
      return { message: 'Verified successfully.' };
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  // async verifyToken(userId, token) {
  //   try {
  //     let data = await TokenModel.findOne({ userId: userId, expired: false });
  //     if (!data || data.token !== String(token)) {
  //       return Promise.reject(Error.badRequest('Token is incorrect.'));
  //     }
  //     data.expired = true;
  //     await data.save();
  //     return { message: ' Verified successfully.' };
  //   } catch (err) {
  //     console.log(err);
  //     return Promise.reject(err);
  //   }
  // }

  /**
   * VERIFY EMAIL TOKEN
   */
  async verifyEmailToken(userId, token) {
    try {
      let data = await TokenModel.findOne({ userId: userId, expired: false, token: token });
      if (data) {
        data.expired = true;
        await data.save();
        return data;
      } else {
        return Promise.reject(Error.badRequest('Token is incorrect or already verify!'));
      }
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * VERIFY OTP ON MOBILE
   */

  async verifyOtp(mobileNo, otp) {
    try {
      return new Promise((resolve, reject) => {
        sendOtp.verify(mobileNo, otp, (err, data) => {
          if (err)
            reject(err);
          else
            resolve(data);
        })
      })
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  /**
   * SEND OTP ON MOBILE
   */

  async sendOtp(mobileNo) {
    try {
      return new Promise((resolve, reject) => {
        sendOtp.send(mobileNo, 'COLLOBO', (err, data) => {
          console.log('err = ', err, " \n data ", data);
          if (err)
            reject(err);
          else
            resolve(data);
        })
      })
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  // async sendOtp(mobileNo) {
  //   return await request.post(constant.SEND_OTP_PATH + mobileNo + '&otp=' + '', function (res) {
  //     console.log(res)
  //     return res;
  //   });
  // }
}

module.exports = new AuthService();
