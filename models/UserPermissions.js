var mongoose = require("mongoose");
var userPermission = mongoose.Schema({
  admin: [{
    type: String,
    required: true
  }],
  seller: [{
    type: String,
    required: true
  }],
  supporter: [{
    type: String,
    required: true
  }],
  customer: [{
    type: String,
    required: true
  }]
});

module.exports = mongoose.model("UserPermissions", userPermission);
