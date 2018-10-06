"use strict"

module.exports = class Discount {
  /**
   * @param {number} id
   * @param {number} percentage
   * @param {string} createdAt
   * @param {string} updatedAt
   */
  constructor (id, percentage, createdAt, updatedAt) {
    this.id = id
    this.percentage = percentage
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  /**
   * @returns {module.Purchase}
   * @constructor
   */
  static NullDiscount () {
    return new this(null, null, null, null)
  }
}
