const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');
const message = require('../common/message')

class AuthService {
  constructor() { }

  async userSignUp(userDetail) {
    let existUser = await User.findOne({ username: userDetail.username });
    if (!existUser) {
      var user = new User(userDetail);
      return await user.save();
    } else {
      throw new Error(message.ALREADY_EXISTS)
    }
  }

  async userLogin(userDetail) {
    let user = await User.findOne({ username: userDetail.username });
    if (!user) {
      throw new Error(message.INVALID_EMAIL_PASSWORD);
    } else {
      let isPasswordMatched = false;
      isPasswordMatched = await bcrypt.compare(userDetail.password, user.password);
      if (!isPasswordMatched) {
        throw new Error(message.INVALID_EMAIL_PASSWORD);
      }
      let hashedPassword = this.hashPassword(userDetail);
      if (hashedPassword) {
        let payload = { id: user._id, role: user.role };
        var token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: config.EXPIRES_IN });
        return { user, token }
      }
    }
  }

  async hashPassword(user) {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, config.SALT_TYPE, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      });
    })

  }
}

module.exports = AuthService;