"use strict"

const Discount = require('../lib/Discount')
const Product = require('../lib/Product')
const Purchase = require('../lib/Purchase')
const TransactionFactory = require('../lib/TransactionFactory')
const User = require('../lib/User')

describe("The Transaction class", () => {
  it("should create a negative transaction from a purchase", () => {
    const cost = 10000
    const purchase = new Purchase(
      null,
      cost,
      0,
      null,
      null,
      User.NullUser(),
      Product.NullProduct(),
      Discount.NullDiscount()
    )

    const transaction = TransactionFactory.createFromPurchase(purchase)
    expect(transaction.amount).toBe(-cost)
  })
})
