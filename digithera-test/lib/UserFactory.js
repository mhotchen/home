"use strict"

const User = require('./User')

module.exports = class UserFactory {
  /**
   * @param {Sequelize} databaseConnection
   */
  constructor(databaseConnection) {
    this.databaseConnection = databaseConnection
  }

  /**
   * @param {string} username
   */
  async find (username) {
    const users = await this.databaseConnection
      .query(
        `
          SELECT users.*, SUM(transactions.amount) AS balance
          FROM users
          LEFT JOIN transactions ON transactions.user_id = users.id
          WHERE username = ?
          GROUP BY users.id
          LIMIT 1
        `,
        { replacements: [username], type: this.databaseConnection.QueryTypes.SELECT }
      )
    return users.length ? this.convertResultToDomain(users)[0] : null
  }

  /**
   * @param {number} amount
   * @returns {Promise<User[]>}
   */
  async findUsersWithBalanceGreaterThan (amount) {
    const users = await this.databaseConnection
      .query(
        `
          SELECT users.*, SUM(transactions.amount) AS balance
          FROM users
          LEFT JOIN transactions ON transactions.user_id = users.id
          GROUP BY users.id
          HAVING balance > ?
        `,
        { replacements: [amount], type: this.databaseConnection.QueryTypes.SELECT }
      )
    return this.convertResultToDomain(users)
  }

  /**
   * @param {object[]} results
   * @returns {User[]}
   */
  convertResultToDomain (results) {
    return results.map(user =>
      new User(user.id, user.username, user.email, user.created_at, user.updated_at, user.balance || null)
    )
  }
}
