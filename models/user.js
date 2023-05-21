const pool = require('../db');

class User {
  static async create(user) {
    const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
    const values = [user.username, user.password, user.role];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
