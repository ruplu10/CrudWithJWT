const pool = require('../db');

class Product {
  static async create(product) {
    const query =
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *';
    const values = [product.name, product.description, product.price];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    const query = 'SELECT * FROM products';

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    const query = 'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4';
    const values = [updates.name, updates.description, updates.price, id];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1';
    const values = [id];

    try {
      await pool.query(query, values);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
