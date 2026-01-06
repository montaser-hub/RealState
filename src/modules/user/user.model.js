import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    minlength: 3,
    maxlength: 10,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: Date
  },
  photo: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['agent', 'admin', 'manager', 'guest', 'broker'],
    default: 'guest',
  },
  contactNumber: {
    type: String
  },
  AlternativePhone: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // hide the password when returning the user document
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  status: {
    type: String,
    enum: ['active', 'banned', 'deleted'],
    default: 'active',
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  bannedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   //this point to cuerrent query
//   this.find({ status: { $eq: 'active' } });
//   next();
// });
//function to check if the inserted password is equle to the current password by using instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp; //True means changed(day or the time at which token is issued is greater than the change timestamp)
  }
  //False means Not changed(day or the time at which token is issued is less than the change timestamp)
  return false;
};
/**
 * Generates and sets a password reset token and expiry time on the user.
 * @returns {string} The unhashed reset token (to send to user email)
 */
userSchema.methods.changedPasswordRestToken = function () {
  //generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  })

const User = mongoose.model('User', userSchema);

export default User;
