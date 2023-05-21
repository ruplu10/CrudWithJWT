const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const config = require('../config');

const router = express.Router();

router.post(
  '/register',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
    check('role').isIn(['ADMIN', 'USER']).withMessage('Role is invalid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const existingUser = await User.findByUsername(req.body.username);

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = {
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
      };

      const newUser = await User.create(user);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.post(
  '/login',
  [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByUsername(req.body.username);

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ username: user.username, role: user.role }, config.jwtSecret, {
        expiresIn: '1h',
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
