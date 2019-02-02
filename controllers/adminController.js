const Error = require('../errors');
const UserModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const MailService = require('./Mail');
const generator = require('generate-password');
const AuthService = require('../services/AuthService');

class Admin {
  // get admin details
  async getAdmin() {
    try {
      const admin = await UserModel.findOne();
      if (!admin) {
        return Promise.reject(Error.badRequest('admin  not found.'));
      }
      return admin
    } catch (e) {
      // statements
      console.log(e);
      return Promise.reject(Error.internal(e));
    }
  }

  //find User By Mail
  findByEmail(email) {
    return UserModel.findOne({ email });
  }

  // find the user by his/her credential
  async findByCredentials(email, password) {
    try {
      // let user = await UserModel.findByEmail(email);
      // if (!user) {
      //   return Promise.reject(Error.badRequest('Bad Request user not found.'));
      // }
      // if (!bcrypt.compareSync(password, user.password)) {
      //   return Promise.reject(Error.badRequest('Bad Request password not found.'));
      // }
      // let token = await AuthService.generateToken(user);
      return {
        user,
        token
      }
    } catch (error) {

    }
  }

  //change user password
  async changeUserPassword(id, oldPassword, newPassword) {
    try {
      return UserModel.findOne({ _id: id }).then((user) => {
        if (!user) {
          return Promise.reject(Error.badRequest('Bad Request user not found.'));
        }
        const saltRounds = 2;
        return bcrypt.hash(newPassword, saltRounds)
          .then((pwd) => {
            console.log(pwd);
            newPassword = pwd;
            return UserModel.findByIdAndUpdate(id, { $set: { password: newPassword } }, { new: true }).then((result) => {
              const data = result.password;
              return data;
            });
          });
      });
    } catch (err) {
      console.log(err);
      return Promise.reject(Error.internal(err));
    }
  }


}

module.exports = Admin;
