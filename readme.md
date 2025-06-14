# E-Commerce Application

A full-stack e-commerce application built with React + Vite frontend and Node.js + Express backend, featuring user authentication, product management, shopping cart, and order processing.

## 🚀 Features

### Frontend (React + Vite)

- **Modern React Development**: Built with React 19.1.0 and Vite for fast development
- **Routing**: React Router DOM for navigation
- **HTTP Client**: Axios for API communication
- **Notifications**: React Toastify for user feedback
- **Styling**: Modern CSS with responsive design
- **Hot Module Replacement**: Instant updates during development

### Backend (Node.js + Express)

- **RESTful API**: Complete REST API with Express.js
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer middleware for image uploads
- **Cloud Storage**: Cloudinary integration for image management
- **Security**: Password hashing with bcryptjs, CORS protection
- **Admin Panel**: Dedicated admin routes and controllers

### Core Functionality

- ✅ User registration and authentication
- ✅ Product catalog with search and filtering
- ✅ Shopping cart management
- ✅ Order processing and tracking
- ✅ Admin dashboard for management
- ✅ Image upload for products
- ✅ Stock management
- ✅ Order status updates

## 🏗️ Project Structure

```
bootcampday1/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── context/         # React context providers (empty)
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Application styles
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Public assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── eslint.config.js     # ESLint configuration
│   └── .env                 # Environment variables
│
└── backend/                 # Node.js + Express backend
    ├── src/
    │   ├── controllers/     # Route controllers
    │   │   ├── admin.controllers.js      # Admin operations
    │   │   ├── cart.controllers.js       # Cart management
    │   │   ├── order.controllers.js      # Order processing
    │   │   ├── product.controllers.js    # Product CRUD
    │   │   └── user.controllers.js       # User authentication
    │   ├── models/          # MongoDB schemas
    │   │   ├── cart.model.js             # Cart schema
    │   │   ├── order.model.js            # Order schema
    │   │   ├── product.model.js          # Product schema
    │   │   └── user.model.js             # User schema
    │   ├── routes/          # API routes
    │   │   ├── admin.routes.js           # Admin endpoints
    │   │   ├── cart.routes.js            # Cart endpoints
    │   │   ├── order.routes.js           # Order endpoints
    │   │   ├── product.routes.js         # Product endpoints
    │   │   └── user.routes.js            # User endpoints
    │   ├── middleware/      # Custom middleware
    │   │   ├── auth.middleware.js        # Authentication middleware
    │   │   └── multer.middleware.js      # File upload middleware
    │   ├── utils/           # Utility functions
    │   │   ├── cloudinary.js             # Cloudinary configuration
    │   │   ├── datauri.js                # File to data URI converter
    │   │   └── seedAdmin.js              # Admin user seeder
    │   ├── db/              # Database configuration
    │   │   └── index.js                  # MongoDB connection
    │   ├── app.js           # Express app configuration
    │   └── index.js         # Server entry point
    ├── public/              # Static files
    │   └── temp/            # Temporary file storage
    ├── package.json         # Backend dependencies
    └── .env                 # Environment variables
```

## 🛠️ Technology Stack

### Frontend

- **React** 19.1.0 - Modern React framework
- **Vite** 6.3.5 - Fast build tool and dev server
- **React Router DOM** 7.6.2 - Client-side routing
- **Axios** 1.9.0 - HTTP client for API calls
- **React Toastify** 11.0.5 - Toast notifications
- **ESLint** - Code linting with React hooks support

### Backend

- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.15.2 - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie parsing middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd bootcampday1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*
PORT=3000
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_API_URL=http://localhost:3000
```

## 🏃‍♂️ Running the Application

### Development Mode

**Backend:**

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3000`

**Frontend:**

```bash
cd frontend
npm run dev
```

Client runs on `http://localhost:5173`

### Production Build

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout
- `GET /api/v1/user/profile/:id` - Get user profile
- `PATCH /api/v1/user/profile/edit` - Edit user profile

### Product Endpoints

- `GET /api/v1/product/` - Get all products
- `GET /api/v1/product/:id` - Get product by ID
- `POST /api/v1/product/` - Add new product (Admin only)
- `PATCH /api/v1/product/:id` - Update product (Admin only)
- `DELETE /api/v1/product/:id` - Delete product (Admin only)

### Cart Endpoints

- `GET /api/v1/cart/` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove/:productId` - Remove item from cart
- `DELETE /api/v1/cart/clear` - Clear entire cart

### Order Endpoints

- `POST /api/v1/order/` - Create new order
- `GET /api/v1/order/my-orders` - Get user orders
- `GET /api/v1/order/:id` - Get order by ID
- `PUT /api/v1/order/:orderId/cancel` - Cancel order

### Admin Endpoints

- `GET /api/v1/admin/orders` - Get all orders
- `GET /api/v1/admin/dashboard-stats` - Get dashboard statistics
- `PATCH /api/v1/admin/orders/:orderId/status` - Update order status

## 🔑 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **User Role**: Can browse products, manage cart, place orders
- **Admin Role**: Full CRUD operations on products, order management, user management

### Default Admin Account

- **Email**: admin@gmail.com
- **Password**: admin123

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- CORS protection
- Input validation
- Secure cookie handling

## 📱 Frontend Features

- Responsive design for mobile and desktop
- Modern React hooks and functional components
- Context API ready for state management
- Toast notifications for user feedback
- Clean and intuitive UI

## 🗃️ Database Schema

### User Model

- name, username, email, password, phone, role
- Password hashing middleware
- Authentication methods

### Product Model

- name, description, price, image, stock, unit
- Timestamps for creation/updates

### Cart Model

- User reference
- Array of items (product, quantity)
- Population with product details

### Order Model

- User reference
- Items array with product details
- Order total, shipping address, phone
- Order status tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Cart persistence across sessions needs implementation
- Advanced product filtering not yet implemented
- Payment gateway integration pending

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced product search and filtering
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Real-time order tracking
- [ ] Multi-language support
- [ ] Advanced admin analytics
