"use strict"

module.exports = class Product {
  /**
   * @param {number} id
   * @param {string} name
   * @param {number} price
   * @param {string} createdAt
   * @param {string} updatedAt
   */
  constructor (id, name, price, createdAt, updatedAt) {
    this.id = id
    this.name = name
    this.price = price
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  /**
   * @returns {number}
   */
  get priceFormatted () {
    return this.price ? this.price / 100 : 0
  }

  /**
   * @returns {module.Product}
   * @constructor
   */
  static NullProduct () {
    return new this(null, null, null, null, null)
  }
}
