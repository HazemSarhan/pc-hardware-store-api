require('dotenv').config();
const connectDB = require('../db/connect');
const Category = require('../models/Category');
const jsonCategories = require('./categories.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Category.deleteMany();
    await Category.create(jsonCategories);
    console.log('Categoires from JSON file has been added!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
