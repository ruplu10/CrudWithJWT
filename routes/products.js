const express = require('express');
const { check, validationResult } = require('express-validator');
const { authenticateToken, authorizeRole } = require('../middlewares/auth');
const Product = require('../models/product');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) =>
 {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post(
  '/',
  [
    authenticateToken,
    authorizeRole('ADMIN'),
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('price').notEmpty().withMessage('Price is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    };

    try {
      const newProduct = await Product.create(product);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  [
    authenticateToken,
    authorizeRole('ADMIN'),
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('price').notEmpty().withMessage('Price is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    };

    try {
      await Product.update(id, updates);
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.delete('/:id', [authenticateToken, authorizeRole('ADMIN')], async (req, res) => {
  const id = req.params.id;

  try {
    await Product.delete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
