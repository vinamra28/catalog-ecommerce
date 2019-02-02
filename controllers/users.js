const Error = require('../errors');
const UserModel = require('../models/users');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const AuthService = require('../services/AuthService');
const MailService = require('../services/MailService');
const Config = require('../config');
const Customer = require('./customer');
const Vendor = require('./vendor');
const Methods = require('../util/method');
const OtpModel = require('../models/otp');
const TokenModel = require('../models/token');


class User {

    /**
     * ADD USER : CUSTOMER : SELF
     */
    async addCustomerSelf(req, res) {
        console.log('addCustomerSelf');

        // let user = {
        //     email: 'poojachauhan.wonderpillars@gmail.com',
        //     _id: '5b990b1c349f3f0ffd0782bb'
        // }
        // let token = await AuthService.generateHexaToken();
        // await MailService.sendTokenEmail(user, token, res);

        let { firstName, lastName, email, gender, mobileNo } = req;
        if (firstName && lastName && email && gender && mobileNo && (req.isAuto || req.password)) {
            let newObj = {
                name: firstName + " " + lastName,
                email: email,
                isEmail: true,
                mobileNo: mobileNo,
                isMobile: true
            };
            let condition = [{ email: email }, { mobileNo: mobileNo }];
            try {
                const result = await UserModel.findOne({ $or: condition });
                if (result) {
                    return Promise.reject(Error.badRequest('this user already registered!'));
                }
                var salt = bcrypt.genSaltSync(2);

                if (req.isAuto) {
                    newObj.password = bcrypt.hashSync(Config.defaultPassword, salt);
                }
                else {
                    newObj.password = bcrypt.hashSync(req.password, salt);
                }
                let user = new UserModel(newObj);

                user = await UserModel.create(user);
                let customer = await Customer.addCustomerSelf(req, user._id);
                let token = await AuthService.generateHexaToken();
                let tokenData = {
                    userId: user._id,
                    token: token
                }
                await AuthService.sendOtp(mobileNo);
                await MailService.sendTokenEmail(user, token, res);
                await TokenModel.create(tokenData);
                return {
                    userId: user._id,
                    message: "OTP and Token sent successfully on mobileNo & email."
                }
            } catch (err) {
                console.log(err);
                return Promise.reject(err);
            }
        } else {
            return Promise.reject(Error.badRequest('incomplete parameters!'));
        }
    }

    /**
     * ADD USER : CUSTOMER : BY ADMIN
     */
    async addCustomerByAdmin(req) {
        try {
            let { firstName, lastName, mobileNo, gender } = req;

            if (firstName && lastName && mobileNo && gender && (req.isAuto || req.password)) {
                var salt = bcrypt.genSaltSync(2);
                var newPassword;
                if (req.isAuto) {
                    newPassword = bcrypt.hashSync(Config.defaultPassword, salt);
                }
                else {
                    newPassword = bcrypt.hashSync(req.password, salt);
                }
                let newObj = {
                    // name: firstName.toLowerCase() + " " + lastName.toLowerCase(),
                    name: firstName + " " + lastName,
                    mobileNo: mobileNo,
                    password: newPassword,
                    mobileVerified: true,
                    isMobile: true,
                    createdBy: 'admin'
                };
                let condition = [{
                    mobileNo: mobileNo
                }];
                if (req.email) {
                    condition.push({ email: req.email.toLowerCase() })
                    newObj.email = req.email.toLowerCase();
                    newObj.isEmail = true;
                    newObj.emailVerified = true;
                }

                console.log('condition = ', condition)
                const result = await UserModel.findOne({ $or: condition });
                console.log('result = ', result);
                if (result) {
                    return Promise.reject(Error.badRequest('this user already registered!'));
                }

                let user = new UserModel(newObj);
                user = await UserModel.create(user);
                let customer = await Customer.addCustomerByAdmin(req, user._id);
                return { message: "user created successfully!" }

            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'));
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }

    }

    /**
     * ADD USER : VENDOR : BY ADMIN
     */
    async addVendorByAdmin(req) {
        try {
            let req1 = req.body
            let { name, gender, city, state, country, pinCode, mobileNo } = req1;
            if (name && gender && city && state && country && pinCode && mobileNo
                && (req1.isAuto || req1.password) && (!req1.isStore || (req1.storeCompanyName && req1.storeMobileNo
                    && req1.storeAddressProof && req1.storePanCard && req1.storeBankAccountNo
                    && req1.storeBankName && req1.storeIfsc && req.files.storePanCardImage && req1.storeGstNo
                    && req1.storeAddress && req1.storeCity && req1.storeZipCode && req1.storeCountry
                    && req1.storeLat && req1.storeLong && (!req1.isDeliveryMan || (req1.deliveryName
                        && req1.deliveryMobileNo && req1.deliveryIdProof))))) {

                console.log('req = ', req.body)
                // user info

                let newObj = {
                    name: name,
                    mobileNo: mobileNo,
                    mobileVerified: true,
                    isMobile: true,
                    createdBy: 'admin',
                    status: 'pending',
                    role: 'vendor'
                };
                let condition = [{
                    mobileNo: mobileNo
                }];
                if (req1.email) {
                    condition.push({ email: req1.email.toLowerCase() })
                    newObj.email = req1.email;
                    newObj.isEmail = true;
                    newObj.emailVerified = true;
                }
                console.log('condition = ', condition)
                const result = await UserModel.findOne({ $or: condition });
                console.log('result = ', result);
                if (result) {
                    return Promise.reject(Error.badRequest('this user already registered!'));
                }
                var salt = bcrypt.genSaltSync(2);

                if (req1.isAuto) {
                    newObj.password = bcrypt.hashSync(Config.defaultPassword, salt);
                }
                else {
                    newObj.password = bcrypt.hashSync(req.password, salt);
                }

                let user = new UserModel(newObj);
                user = await UserModel.create(user);
                console.log('user = ', user);
                let vendor = await Vendor.addVendorByAdmin(req, user._id);
                return { message: "user created successfully!" }

            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'));
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * UPDATE EMAIL CONDITIONALLY
     */
    async updateEmail(req) {
        try {
            let { email, _id } = req;
            if (email && _id) {
                let user = await UserModel.findOne({ _id: _id });
                if (user) {
                    if (user.isEmail)
                        return Promise.reject(Error.badRequest("email can't be changed!"));
                    else {
                        let emailUser = await UserModel.findOne({ email: email });
                        if (emailUser) {
                            return Promise.reject(Error.badRequest("email already registered!"))
                        } else {
                            user.email = email;
                            let saveUser = await user.save();
                            if (saveUser)
                                return { message: "user updated successfully!" }
                        }
                    }
                } else {
                    return Promise.reject(Error.notFound('user not found!'));
                }
            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'))
            }
        } catch (err) {
            console.log('err in updateCustomer', err);
            return Promise.reject(Error.internal(err));
        }
    }

    /**
     * VERIFY MOBILE NUMBER
     */
    async verifyOtp(req) {
        let { userId, otp } = req;
        try {
            if (userId && otp) {
                let user = await UserModel.findOne({ _id: userId, isMobile: true });
                if (user) {
                    let res = await AuthService.verifyOtp(user.mobileNo, otp);
                    if (res.type === 'error')
                        return Promise.reject(Error.badRequest(res.message));
                    if (res.type === 'success') {
                        user.mobileVerified = true;
                        let saveUser = await user.save();
                        return {
                            message: res.message
                        }
                    }
                } else {
                    return Promise.reject(Error.notFound('user not found!'));
                }
            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'));
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * RESEND OTP 
     */
    async resendOtp(req) {
        let { userId } = req;
        try {
            if (userId) {
                let user = await UserModel.findOne({ _id: userId, isMobile: true });
                if (user) {
                    await AuthService.sendOtp(user.mobileNo);
                    return {
                        userId: user._id,
                        message: "OTP sent successfully on mobileNo!"
                    }
                } else {
                    return Promise.reject(Error.notFound('user not found!'));
                }
            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'));
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * VERIFY EMAIL_ID
     */
    async verifyEmail(req) {
        let { userId, token } = req;
        try {
            await AuthService.verifyEmailToken(userId, token);
            let user = await UserModel.findOne({ _id: userId });
            if (!user) {
                return Promise.reject(Error.badRequest('user not found!'));
            }
            if (!user.emailVerified) {
                user.emailVerified = true;
                user = await user.save();
            }
            return {
                message: user.email + ' ' + 'verified successfully!'
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    /**
     * NORMAL LOGIN
     */
    async login(req) {
        let { password } = req;
        try {
            let condition = {};
            if (req.mobileNo) {
                condition.mobileNo = req.mobileNo;
                condition.mobileVerified = true;
            }
            if (req.email) {
                condition.email = req.email;
                condition.emailVerified = true;
            }
            let user = await UserModel.findOne(condition, { password: 0 });
            if (!user) {
                return Promise.reject(Error.badRequest('please verify your emailId first before login!'));
            }
            if (!user || !bcrypt.compare(password, user.password)) {
                return Promise.reject(Error.badRequest('invalid credentials!'));
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

    /**
     * SOCIAL LOGIN : FACEBOOK
     */
    async socialLogin(req) {
        try {
            let { userType, firstName, lastName, gender } = req;
            if (userType && firstName && lastName && gender && (req.email || req.mobileNo)) {
                let condition = {};
                if (req.email) {
                    condition.email = req.email.toLowerCase();
                    condition.emailVerified = true;
                }
                if (req.mobileNo) {
                    condition.mobileNo = req.mobileNo;
                    condition.mobileVerified = true;
                }

                let user = await UserModel.findOne(condition, { password: 0 });
                if (user) {
                    console.log('user exist');
                    let token = await AuthService.generateToken(user);
                    console.log('token = ', token);
                    return {
                        user,
                        token
                    }
                } else {
                    console.log('user not exist');
                    let newObj = {
                        name: firstName + " " + lastName,
                        signupType: userType
                    };
                    if (req.email) {
                        newObj.email = req.email.toLowerCase();
                        newObj.emailVerified = true;
                    }
                    if (req.mobileNo) {
                        newObj.mobileNo = req.mobileNo;
                        newObj.mobileVerified = true;
                    }
                    let newUser = new UserModel(newObj);

                    newUser = await UserModel.create(newUser);
                    let customer = await Customer.addCustomerSelf(req, newUser._id);
                    let token = await AuthService.generateToken(newUser);
                    console.log('token = ', token);
                    return {
                        newUser,
                        token
                    }
                }

            } else {
                return Promise.reject(Error.badRequest('incomplete parameters!'));
            }
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }













    async changeUserPassword({ id, oldPassword, newPassword }) {
        try {
            let result = await UserModel.findOne({ _id: id });
            if (!result) {
                return Promise.reject(new Error.notFound('User not found.'));
            }
            if (!bcrypt.compareSync(oldPassword, result.password)) {
                return Promise.reject(new Error().badRequest('Old Password is incorrect'));
            }
            let saltRounds = 2;
            let data = await bcrypt.hash(newPassword, saltRounds);
            newPassword = data;
            let updated = await UserModel.findByIdAndUpdate(id, { $set: { password: newPassword } }, { new: true });
            return updated;
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    async delete(id) {
        try {
            let user = await UserModel.findOne({ _id: id });
            if (!user) {
                return Promise.reject(new Error().badRequest('User is not found.'));
            }
            await UserModel.remove({ _id: id });
            return { message: 'Deleted successfully.' };
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    }

    // async login(email, password) {
    //     try {
    //         let user = await UserModel.findOne({ email: email, emailVerified: true });
    //         if (!user) {
    //             return Promise.reject(Error.badRequest('Please verify your emailId first before login!'));
    //         }
    //         if (!user || !bcrypt.compareSync(password, user.password)) {
    //             return Promise.reject(new Error().badRequest('Invalid credentials.'));
    //         }
    //         let token = await AuthService.generateToken(user);
    //         console.log(user);
    //         return {
    //             user,
    //             token
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         return Promise.reject(err);
    //     }
    //}


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

module.exports = new User();
