"use strict"

const Purchase = require('../lib/Purchase')
const Transaction = require("../lib/Transaction")
const User = require('../lib/User')

describe("The Transaction class", () => {

  it("should correctly format the amount when requesting the formatted amount", () => {
    const transaction = new Transaction(1, 100000, '', User.NullUser(), Purchase.NullPurchase())

    expect(transaction.amountFormatted).toBe(1000.00)
  })

  it("should sum up the balance of a list of transaction correctly", () => {
    const transactions = [
      new Transaction(1, 100000, '', User.NullUser(), Purchase.NullPurchase()),
      new Transaction(2, -10000, '', User.NullUser(), Purchase.NullPurchase()),
      new Transaction(3,   9999, '', User.NullUser(), Purchase.NullPurchase())
    ]

    expect(Transaction.getBalance(transactions)).toBe(99999)
  })

  it("should sum the balance to 0 for an empty transaction list", () => {
    expect(Transaction.getBalance([])).toBe(0)
  })
})
