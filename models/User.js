var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "seller", "supporter", "customer"],
    required: true
  }
});
userSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next()
  });
});

module.exports = mongoose.model("User", userSchema);
