"use strict"

const Purchase = require('./Purchase')

module.exports.createPurchase = (user, product, discount) => {
  const price = discount.percentage
    ? product.price - (product.price * discount.percentage / 100)
    : product.price

  return new Purchase(
    null,
    price,
    discount.percentage || 0,
    null,
    null,
    user,
    product,
    discount
  )
}
