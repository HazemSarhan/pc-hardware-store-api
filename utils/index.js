const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser.js');
const checkPermission = require('./checkPermissions.js');
const paginate = require('./paginate.js');
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermission,
  paginate,
};
