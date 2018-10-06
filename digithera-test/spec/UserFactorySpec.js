"use strict"

const UserFactory = require("../lib/UserFactory")
const db = {
  QueryTypes: {
    SELECT: Symbol()
  }
}

describe("The UserFactory class", () => {

  it("should return a valid user when finding a username", async () => {
    const userFactory = new UserFactory({
      ...db,
      query(...args) {
        return new Promise(resolve => {
          setImmediate(() => {
            resolve([{
              id: 2,
              username: 'lucas',
              email: 'lucas@digithera.ai',
              created_at: '2018-08-20T09:19:41.000Z',
              updated_at: '2018-08-20T09:19:41.000Z',
              balance: '484000'
            }])
          })
        })
      }
    })
    const user = await userFactory.find('lucas')
    expect(user).toEqual(jasmine.objectContaining({ id: 2, username: 'lucas' }))
  })
  it("should return a null when no user is found", async () => {
    const userFactory = new UserFactory({
      ...db,
      query(...args) {
        return new Promise(resolve => {
          setImmediate(() => {
            resolve([])
          })
        })
      }
    })
    const user = await userFactory.find('lucas')
    expect(user).toBeNull()
  })

  it("should return a list of users with a balance over the set amount", async () => {
    const userFactory = new UserFactory({
      ...db,
      query(...args) {
        return new Promise(resolve => {
          setImmediate(() => {
            resolve([
              {
                id: 1,
                username: 'matt',
                balance: '484000'
              },
              {
                id: 2,
                username: 'lucas',
                balance: '484000'
              }
            ])
          })
        })
      }
    })

    const users = await userFactory.findUsersWithBalanceGreaterThan(100)
    expect(users.length).toBe(2)
  })
})
