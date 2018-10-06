"use strict"

let User = require("../lib/User")

describe("The User class", () => {

  it("should return the correctly formatted balance", () => {
    const user = new User(1, 'matt', 'm@mhn.me', '2018-08-20 12:38:00Z', '2018-08-20 12:38:00Z', 10000)
    expect(user.balanceFormatted).toBeCloseTo(100.00, 2)
  })
})
