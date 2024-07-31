const express = require('express');
const router = express.Router();
const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router
  .route('/')
  .post([authenticatedUser, authorizePermissions('admin')], createCategory)
  .get(getAllCategories);

router
  .route('/:id')
  .get(getCategoryById)
  .patch([authenticatedUser, authorizePermissions('admin')], updateCategory)
  .delete([authenticatedUser, authorizePermissions('admin')], deleteCategory);

module.exports = router;
