[PC Hardware Store API]
# Documentation
For detailed API documentation, visit [API Documentation](http://localhost:5000/docs).

## API Documentation

For detailed API documentation, visit [API Documentation](http://localhost:3000/docs).

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login a user
- `POST /api/v1/auth/logout` - Logout a user

### Products
- `POST /api/v1/products` - Create a new product (Admin only)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get a single product by ID
- `PATCH /api/v1/products/:id` - Update a product by ID (Admin only)
- `DELETE /api/v1/products/:id` - Delete a product by ID (Admin only)
- `POST /api/v1/products/uploadImage` - Upload an image for a product

### Categories
- `POST /api/v1/categories` - Create a new category (Admin only)
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get a single category by ID
- `PATCH /api/v1/categories/:id` - Update a category by ID (Admin only)
- `DELETE /api/v1/categories/:id` - Delete a category by ID (Admin only)

### Orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders` - Get all orders (Admin only)
- `GET /api/v1/orders/:id` - Get a single order by ID
- `PATCH /api/v1/orders/:id` - Update order status by ID (Admin only)

### Reviews
- `POST /api/v1/reviews` - Create a new review
- `GET /api/v1/reviews` - Get all reviews
- `GET /api/v1/reviews/:id` - Get a single review by ID
- `PATCH /api/v1/reviews/:id` - Update a review by ID
- `DELETE /api/v1/reviews/:id` - Delete a review by ID
- `GET /api/v1/reviews/product/:id` - Get all reviews for a single product

# Description

The PC Hardware Store API is a comprehensive backend solution for managing an e-commerce platform that specializes in selling PC hardware components. It provides a robust set of features for handling user authentication, product management, order processing, category management, and reviews. The API integrates with Stripe for payment processing and Cloudinary for image uploads.

# Features :

# User Authentication and Management

- [x] Register: Create a new user account.
- [x] Login: Authenticate a user and generate a JWT token.
- [x] Logout: Invalidate the current user session.
- [x] Get All Users: Retrieve a list of all registered users (Admin only).
- [x] Get Single User: Retrieve details of a specific user (Admin only).
- [x] Show Current User: Retrieve details of the currently authenticated user.
- [x] Update User: Update user details (username and email).
- [x] Update User Password: Change the password of the currently authenticated user.

# Product Management

- [x] Create Product: Add a new product to the catalog (Admin only).
- [x] Get All Products: Retrieve a list of all products with pagination, filtering, and sorting options.
- [x] Get Single Product: Retrieve details of a specific product.
- [x] Update Product: Update details of a specific product (Admin only).
- [x] Delete Product: Remove a product from the catalog (Admin only).
- [x] Upload Image: Upload an image for a product to Cloudinary.

# Category Management

- [x] Create Category: Add a new category (Admin only).
- [x] Get All Categories: Retrieve a list of all categories.
- [x] Get Category By ID: Retrieve details of a specific category.
- [x] Update Category: Update details of a specific category (Admin only).
- [x] Delete Category: Remove a category (Admin only).

# Order Management

- [x] Create Order: Create a new order with Stripe payment integration.
- [x] Get All Orders: Retrieve a list of all orders with product and user details (Admin only).
- [x] Get Order By ID: Retrieve details of a specific order.
- [x] Update Order Status: Update the payment status of an order (Admin only).

# Review Management

- [x] Create Review: Add a new review for a product.
- [x] Get All Reviews: Retrieve a list of all reviews.
- [x] Get Review By ID: Retrieve details of a specific review.
- [x] Update Review: Update details of a specific review.
- [x] Delete Review: Remove a review.
- [x] Get Reviews for a Product: Retrieve all reviews for a specific product.

# Technologies Used

- [x] Node.js
- [x] Express.js
- [x] MongoDB
- [x] Mongoose
- [x] Stripe API (for payment processing)
- [x] Cloudinary (for image uploads)
- [x] JWT (for authentication)
- [x] Postman (for testing API endpoints)

# Installation

1- Clone the repository:
git clone https://github.com/HazemSarhan/pc-hardware-store-api.git
cd pc-hardware-store-api

2- Install dependencies:
npm install

3- Set up environment variables:
Create a .env file in the root directory and add the following:

- [x] PORT=5000
- [x] MONGO_URI=your-mongodb-uri
- [x] JWT_SECRET=your-jwt-secret
- [x] JWT_LIFETIME=1d or 3d
- [x] STRIPE_SECRET_KEY=your-stripe-secret-key
- [x] CLOUD_NAME=your-cloudinary-cloud-name
- [x] CLOUD_API_KEY=your-cloudinary-api-key
- [x] CLOUD_API_SECRET=your-cloudinary-api-secret

4- Start the application:
npm start

# Usage

1- Register an account:
Use the /api/v1/auth/register endpoint to create a new user account.

2- Login:
Use the /api/v1/auth/login endpoint to authenticate a user and receive a JWT token.

3- Manage Products:
Use the /api/v1/products endpoints to create, read, update, and delete products. Only admin users can create, update, and delete products.

4- Manage Categories:
Use the /api/v1/categories endpoints to create, read, update, and delete categories. Only admin users can create, update, and delete categories.

5- Manage Orders:
Use the /api/v1/orders endpoints to create and view orders. Only admin users can view all orders and update order status.

6- Manage Reviews:
Use the /api/v1/reviews endpoints to create, read, update, and delete reviews. Users can leave reviews for products they have purchased.

# License

This project is licensed under the MIT License.
