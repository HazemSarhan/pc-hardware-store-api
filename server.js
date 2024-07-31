// Main server packages
require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');

// Rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const rateLimter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// DB connection
const connectDB = require('./db/connect');

// Routes
const authRouter = require('./routes/authenticationRouter');
const UserRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');
const reviewRouter = require('./routes/reviewRouter');
const orderRouter = require('./routes/orderRouter');

// Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'));
app.use(express.json());
// app.use(express.static(path.join(__dirname, '/public/frontend'))); // if you need to serve frontend files
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/', // or any other temporary directory
  })
);

app.get('/', (req, res) => {
  res.send(
    `<h1>PC Hardware Store API</h1><a href="/api-docs">Documentation</a>
    <a href="/login">Login</a>`
  );
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// login page for test on browser
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/frontend', 'login.html'));
});

// Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Running
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
