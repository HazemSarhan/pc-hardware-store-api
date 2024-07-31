const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermission,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(StatusCodes.OK).json({ users, userCounter: users.length });
};

const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id: ${userId}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new CustomError.BadRequestError(
      'Please provide a valid username and email'
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { username, email },
    { new: true, runValidators: true }
  ).select('-password');

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide old and new password'
    );
  }

  const user = await User.findById(req.user.userId);
  const isCorrectPassword = await user.comparePassword(oldPassword);
  if (!isCorrectPassword) {
    throw new CustomError.UnauthenticatedError('Invalid Creditnials');
  }

  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Password has been changed successfully!' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
