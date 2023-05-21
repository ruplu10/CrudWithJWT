const express = require('express');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// EJS view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes for rendering dynamic EJS views
app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/products', (req, res) => {
  const token = req.headers['authorization'];
  let products = [];

  if (token) {
    try {
      const user = jwt.verify(token, config.jwtSecret);
      if (user) {
        // Perform database query to get products
        products = [
          { name: 'Product 1', description: 'Description 1', price: 10 },
          { name: 'Product 2', description: 'Description 2', price: 20 },
          { name: 'Product 3', description: 'Description 3', price: 30 },
        ];
      }
    } catch (error) {
      // Token verification failed
    }
  }

  res.render('products', { products });
});

// Start the server
const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
