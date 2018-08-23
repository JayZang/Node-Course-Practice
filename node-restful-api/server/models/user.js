const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decode;

  try{
    decode = jwt.verify(token, 'MySecret');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.methods.toJSON = function() {
  var user = this;

  return _.pick(user, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'MySecret').toString()

  user.tokens.push({
    access,
    token
  })

  return user.save()
          .then(() => {
            return token;
          })
}

UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        return next();
      })
    })
  } else {
    return next();
  }
})

var User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
