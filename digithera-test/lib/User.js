"use strict"

module.exports = class User {
  /**
   * @param {number} id
   * @param {string} username
   * @param {string} email
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {number|null} balance
   */
  constructor (id, username, email, createdAt, updatedAt, balance = null) {
    this.id = id
    this.username = username
    this.email = email
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.balance = balance
  }

  /**
   * @returns {number}
   */
  get balanceFormatted () {
    return this.balance ? this.balance / 100 : 0
  }

  /**
   * @returns {module.User}
   * @constructor
   */
  static NullUser() {
    return new this(null, null, null, null, null, null)
  }
}
