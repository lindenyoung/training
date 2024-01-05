/* BANK ACCOUNT OOP PROBLEM */

// build account and deposit functionality
// build transfer functionality
// build getKthHighest functionality
// build method to process commands / tests

// class for a bank account
class Account {
  constructor(id) {
    this.id = id
    this.balance = 0
    this.activity = 0
  }

  deposit(amount) {
    this.balance += amount
    this.activity += Math.abs(amount)
    return this.balance
  }
}

// class to manage bank accounts
class AccountManager {
  constructor() {
    this.accounts = {}
  }

  createAccount(id) {
    if (id in this.accounts) return false
    this.accounts[id] = new Account(id)
    return true
  }

  deposit(to, amount) {
    if (!(to in this.accounts)) return -1
    this.accounts[to].deposit(amount)
    return this.accounts[to].balance
  }

  transfer(from, to, amount) {
    if (
      !(from in this.accounts) ||
      !(to in this.accounts) ||
      from === to ||
      this.accounts[from].balance < amount
    ) return -1

    this.accounts[from].deposit(-1 * amount) // withdraw
    this.accounts[to].deposit(amount) // deposit
    return this.accounts[from].balance
  }

  getKthHighestActivity(k) {
    const sortedAccounts = Object.values(this.accounts).sort((a, b) => b.activity - a.activity)

    // get n highest activity accounts
    // return sortedAccounts.slice(0, k).map((account) => [account.id, account.activity])

    // get all accounts with nth highest activity
    let count = 1,
        nthHighestActivity = sortedAccounts[0].activity

    for (let i = 1; i < sortedAccounts.length && count < k; i++) {
      if (sortedAccounts[i].activity !== nthHighestActivity) {
        count++
        nthHighestActivity = sortedAccounts[i].activity
      }
    }

    return sortedAccounts.filter((account) => account.activity === nthHighestActivity).map((account) => [account.id, account.activity])
  }

  processCommands(commands) {
    const result = []

    for (const command of commands) {
      const operation = command[0].toUpperCase()
      const accountId = command[1] // true for the commands we need it to be true for, we'll grab separate vals for transfer

      switch (operation) {
        case 'CREATEACCOUNT':
          result.push(this.createAccount(accountId))
          break
        case 'DEPOSIT':
          const depositAmount = Number(command[2])
          result.push(this.deposit(accountId, depositAmount))
          break
        case 'TRANSFER':
          const fromAccountId = command[1],
                toAccountId = command[2],
                transferAmount = Number(command[3])
          result.push(this.transfer(fromAccountId, toAccountId, transferAmount))
          break
        case 'GETKTHHIGHESTACTIVITY':
          const k = command[1]
          result.push(this.getKthHighestActivity(k))
          break
        default:
          break
      }
    }

    return result
  }
}

const acc1 = new Account('one')
console.log(acc1.deposit(50))
console.log(acc1)
const manager1 = new AccountManager()
console.log(manager1.createAccount('one'))
console.log(manager1.deposit('one', 50))
manager1.createAccount('two')
manager1.deposit('two', 25)
console.log(manager1.transfer('one', 'two', 10))
manager1.createAccount('three')
manager1.deposit('three', 100)
manager1.createAccount('four')
manager1.deposit('four', 60)
console.log(manager1)
console.log(manager1.getKthHighestActivity(2))

const manager2 = new AccountManager()
const testCommands = [["CREATEACCOUNT" , "Account1"], ["CREATEACCOUNT" , "Account2"],["DEPOSIT" , "Account1", "100"], ["DEPOSIT" , "Account2", "200"], ["TRANSFER" , "Account1", "Account2", 50], ["GETKTHHIGHESTACTIVITY", 2]]
console.log(manager2.processCommands(testCommands))
console.log(manager2)

class AccountTokenization {
  constructor(id, balance, sensitive) {
    this.id = id;
    this.balance = balance;
    this.sensitive = sensitive;
  }

  // THIS IS BLANK
  accountService(accounts) {
    // make copy of accounts
    const updatedAccounts = accounts.map((account) => new AccountTokenization(account.id, account.balance, account.sensitive))
    // grab sensitive accounts only
    const sensitiveAccounts = updatedAccounts.filter((account) => account.sensitive === true)
    // create array of token service requests for sensitive accounts
    const requests = sensitiveAccounts.map((account) => new TokenServiceRequest(account.id, account))
    // process requests via tokenService method to get array of responses
    const responses = TokenService.prototype.tokenService(requests)
    // update sensitive accounts with tokenized id's
    for (const account of sensitiveAccounts) {
      const matchingResponse = responses.find((response) => response.trackingId === account.id)
      account.id = matchingResponse.token
    }
    // return copy of accounts
    return updatedAccounts
  }
}

class TokenServiceRequest {
  constructor(trackingId, data) {
    this.trackingId = trackingId
    this.data = data
  }
}

class TokenServiceResponse {
  constructor(trackingId, token) {
    this.trackingId = trackingId
    this.token = token
  }
}

// THIS IS BLANK
class TokenService {
  tokenService(requests) {
    // for each token service request, create a response instance with a valid token
    const responses = requests.map((request) => {
      const token = 'tkn_' + request.data.id
      return new TokenServiceResponse(request.trackingId, token)
    })
    // return array of responses
    return responses
  }
}

const accounts1 = [new AccountTokenization("1234",12,true), new AccountTokenization("2233",22, false)]
const response1 = AccountTokenization.prototype.accountService(accounts1)
const accounts2 = [new AccountTokenization("5555", 25, true), new AccountTokenization("1010", 50, false), new AccountTokenization("3333", 100, true)]
const response2 = AccountTokenization.prototype.accountService(accounts2)
// this should be true: 'tkn_' + accounts[0].id === response[0].id
console.log(accounts1[0].id) // '1234'
console.log(response1[0].id) // 'tkn_1234'
console.log(accounts2[0].id, '-', response2[0].id, '-', 'tkn_' + accounts2[0].id === response2[0].id)