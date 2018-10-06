"use strict"

const Discount = require('../lib/Discount')
const Product = require('../lib/Product')
const PurchaseFactory = require('../lib/PurchaseFactory')
const User = require('../lib/User')

describe("The PurchaseFactory class", () => {

  it("should correctly apply discounts to the product price", () => {
    const discountPercent = 25
    const discount = new Discount(null, discountPercent, null, null)
    const product = new Product(null, 'A thing', 10000, null, null)
    const user = User.NullUser()
    const purchase = PurchaseFactory.createPurchase(user, product, discount)

    expect(purchase.amount).toBe(7500)
    expect(purchase.discountApplied).toBe(discountPercent)
  })

  it("should apply no discounts to the product price if no discount is given", () => {
    const discount = Discount.NullDiscount()
    const product = new Product(null, 'A thing', 10000, null, null)
    const user = User.NullUser()
    const purchase = PurchaseFactory.createPurchase(user, product, discount)

    expect(purchase.amount).toBe(10000)
    expect(purchase.discountApplied).toBe(0)
  })
})
