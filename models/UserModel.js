const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  key: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true
  }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = {UserModel};
