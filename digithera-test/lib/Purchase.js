"use strict"

const Discount = require('./Discount')
const Product = require('./Product')

module.exports = class Purchase {
  /**
   * @param {number} id
   * @param {number} amount
   * @param {number} discountApplied
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {module.User} user
   * @param {module.Product} product
   * @param {module.Discount} discount
   */
  constructor (id, amount, discountApplied, createdAt, updatedAt, user, product, discount) {
    this.id = id
    this.amount = amount
    this.discountApplied = discountApplied
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.user = user
    this.product = product
    this.discount = discount
  }

  /**
   * @returns {number}
   */
  get amountFormatted () {
    return this.amount ? this.amount / 100 : 0
  }

  /**
   * @returns {number}
   */
  get discountAppliedFormatted () {
    return this.discountApplied ? this.discountApplied / 100 : 0
  }

  /**
   * @returns {module.Purchase}
   * @constructor
   */
  static NullPurchase () {
    return new this(null, null, null, null, null, null, Product.NullProduct(), Discount.NullDiscount())
  }
}
