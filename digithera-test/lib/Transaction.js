"use strict"

module.exports = class Transaction {
  /**
   * @param {number} id
   * @param {number} amount
   * @param {string} createdAt
   * @param {module.User} user
   * @param {module.Purchase} purchase
   */
  constructor (id, amount, createdAt, user, purchase) {
    this.id = id
    this.amount = amount
    this.createdAt = createdAt
    this.user = user
    this.purchase = purchase
  }

  /**
   * @returns {number}
   */
  get amountFormatted () {
    return this.amount / 100
  }

  /**
   * @param {module.Transaction[]} transactions
   * @return {number}
   */
  static getBalance (transactions) {
    return transactions
      .map(t => t.amount)
      .reduce((l, r) => l + r, 0)
  }

  /**
   * @param {module.Transaction[]} transactions
   * @return {number}
   */
  static getBalanceFormatted (transactions) {
    const balance = this.getBalance(transactions)
    return balance === 0 ? 0 : balance / 100
  }
}
