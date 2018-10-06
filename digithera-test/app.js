const Sequelize = require('sequelize')
const UserFactory = require('./lib/UserFactory')
const Transaction = require('./lib/Transaction')
const TransactionFactory = require('./lib/TransactionFactory')

const sequelize = new Sequelize('digithera_test', 'root', 'supersecure', {
  host: 'localhost',
  dialect: 'mysql'
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to DB')
  })
  .catch(err => {
    console.error(err)
  })

/**
 * Application entry point if app.js is called directly.
 *
 * @param {string[]} argv
 */
exports.main = async (argv) => {
  const userFactory = new UserFactory(sequelize)
  const transactionFactory = new TransactionFactory(sequelize)
  try {
    const user = await userFactory.find('lucas')
    console.log('Found user: ', user)

    const transactions = await transactionFactory.getStatementForUser(user)
    console.log(
      `Transactions for user ${user.username} (balance: ${Transaction.getBalanceFormatted(transactions)})`,
      transactions
    )

    const balance = argv[2] || 0
    const usersWithBalanceGreaterThan = await userFactory.findUsersWithBalanceGreaterThan(balance)
    console.log(`Users with balance greater than ${balance}: `, usersWithBalanceGreaterThan)
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[1] === __filename) {
  exports.main(process.argv)
}
