"use strict"

const Discount = require('./Discount')
const Product = require('./Product')
const Purchase = require('./Purchase')
const Transaction = require('./Transaction')

module.exports = class TransactionFactory {
  /**
   * @param {Sequelize} databaseConnection
   */
  constructor(databaseConnection) {
    this.databaseConnection = databaseConnection
  }

  /**
   * @param {module.User} user
   * @returns {Promise<Transaction[]>}
   */
  async getStatementForUser (user) {
    // This should probably be masked behind an ORM!
    const transactions = await this.databaseConnection
      .query(
        `
          SELECT
            transactions.id AS transaction_id,
            transactions.user_id,
            amount,
            transactions.created_at AS transaction_created_at,
            purchases.id AS purchase_id,
            purchases.discount_percentage AS purchase_discount,
            purchases.created_at AS purchase_created_at,
            purchases.updated_at AS purchase_updated_at,
            products.id AS product_id,
            products.name AS product_name,
            products.price AS product_price,
            products.created_at AS product_created_at,
            products.updated_at AS product_updated_at,
            discounts.id AS discount_id,
            discounts.percentage AS discount_percentage,
            discounts.created_at AS discount_created_at,
            discounts.updated_at AS discount_updated_at
          FROM transactions
          LEFT JOIN purchases on transactions.id = purchases.transaction_id
          LEFT JOIN products ON purchases.product_id = products.id
          LEFT JOIN discounts ON purchases.discount_id = discounts.id
          WHERE transactions.user_id = ?
        `,
        { replacements: [ user.id ], type: this.databaseConnection.QueryTypes.SELECT }
      )

    return transactions.map(t => {
      const product = t.product_id
        ? new Product(t.product_id, t.product_name, t.product_price, t.product_created_at, t.product_updated_at)
        : Product.NullProduct()

      const discount = t.discount_id
        ? new Discount(t.discount_id, t.discount_percentage, t.discount_created_at, t.discount_updated_at)
        : Discount.NullDiscount()

      const purchase = t.purchase_id
        ? new Purchase(
          t.purchase_id,
          Math.abs(t.amount),
          t.purchase_discount,
          t.purchase_created_at,
          t.purchase_updated_at,
          user,
          product,
          discount
        )
        : Purchase.NullPurchase()

      return new Transaction(t.transaction_id, t.amount, t.transaction_created_at, user, purchase)
    })
  }

  /**
   * @param {module.Purchase} purchase
   * @return {module.Transaction}
   */
  static createFromPurchase (purchase) {
    return new Transaction(
      null,
      -purchase.amount,
      null,
      purchase.user,
      purchase
    )
  }
}
