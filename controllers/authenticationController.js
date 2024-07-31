const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  // Check for email availablity
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new CustomError.BadRequestError('Email is already exists!');
  }

  // Set the first registerd user as an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'customer';

  // Create new user
  const user = await User.create({ username, email, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Please Provide a valid email and password'
    );
  }

  // email validation
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Creditnials');
  }

  // password validation
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Creditnials');
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'user has been logged out successfully!' });
};

module.exports = {
  register,
  login,
  logout,
};
