// Given several bank accounts with balance, account_id, and is_sensitive attributes.
// Go through all the bank accounts and if they are is_sensitive (True), tokenize them using a Tokenize service that has TokenServiceRequest and TokenServiceResponse class objects
// If we’re dealing with sensitive bank accounts (sensitive = True), then append ‘tkn_’ + account.id (e.g “tkn_1234”) to account

class Account {
  constructor(id, balance, sensitive) {
    this.id = id;
    this.balance = balance;
    this.sensitive = sensitive;
  }

  accountService(accounts) { // O(n + m) time - the find method takes m time, but does not depend on length of accounts array so not quadratic
    // get sensitive accounts
    const updatedAccounts = accounts.map((account) => new Account(account.id, account.balance, account.sensitive)) // map creates a new array with new references
    const sensitiveAccounts = updatedAccounts.filter((account) => account.sensitive === true)
    // get token service requests for those accounts
    const requests = sensitiveAccounts.map((account) => new TokenServiceRequest(account.id, account))
    // call tokenService on those requests
    const responses = TokenService.prototype.tokenService(requests)

    // return what? let's say an array of accounts where all sensitive accounts have been tokenized
    for (const account of sensitiveAccounts) { // the filter method preserves references to updatedAccounts array, so updating account.id here updates it in our return array
      const matchedResponse = responses.find((response) => response.trackingId === account.id)
      if (matchedResponse) account.id = matchedResponse.token
    }

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

class TokenService { // O(n) time
  tokenService(tokenServiceRequests) {
    // for each request, make a tokenized id value and create a response
    const responses = tokenServiceRequests.map((request) => {
      const tokenizedId = 'tkn_' + request.data.id // data = new Account(id, balance, sensitive)
      return new TokenServiceResponse(request.trackingId, tokenizedId)
    })

    // send back the responses
    return responses
  }
}

const accounts1 = [new Account("1234","12",true), new Account("2233","22", false), new Account("0505", "25", true)]
const response1 = Account.prototype.accountService(accounts1)

// let's assume the accountService output should be an array of tokenized? accounts
console.log(accounts1[0].id) // '1234'
console.log(response1[0].id) // 'tkn_1234'
console.log(accounts1[1].id) // '2233'
console.log(response1[1].id) // '2233'
// shapes / models
console.log(accounts1)
console.log(response1)

/* -------------------------------------------------------- */
        /* OOP - ACCOUNT / DEPOSIT / TRANSFER / KTH */
/* -------------------------------------------------------- */

class BankAccount {
  constructor(id) {
    this.id = id
    this.balance = 0
    this.transactionTotal = 0
    this.activityCount = 0
  }

  deposit(amount) {
    this.balance += amount
    this.transactionTotal += Math.abs(amount)
    this.activityCount++
    return this.balance
  }
}

class BankAccountManager {
  constructor() {
    this.accounts = {}
  }

  createAccount(id) {
    if (id in this.accounts) return false
    this.accounts[id] = new BankAccount(id)
    return true
  }

  deposit(id, amount) {
    if (!(id in this.accounts)) return -1
    this.accounts[id].deposit(amount)
    return this.accounts[id].balance
  }

  transfer(from, to, amount) {
    if (
      !(from in this.accounts) ||
      !(to in this.accounts) ||
      from === to ||
      this.accounts[from].balance < amount
    ) return -1

    this.accounts[from].deposit(-1 * amount)
    this.accounts[to].deposit(amount)
    return this.accounts[from].balance
  }

  getKthHighest(n = 1) {
    const sortedAccounts = Object.values(this.accounts).sort((a, b) => b.transactionTotal - a.transactionTotal)

    let count = 1,
        nthHighestTotal = sortedAccounts[0].transactionTotal

    for (let i = 1; i < sortedAccounts.length && count < n; i++) {
      if (sortedAccounts[i].transactionTotal !== nthHighestTotal) {
        nthHighestTotal = sortedAccounts[i].transactionTotal
        count++
      }
    }

    const nthHighestAccounts = sortedAccounts.filter((account) => account.transactionTotal === nthHighestTotal)
    return nthHighestAccounts.map((account) => [account.id, account.transactionTotal, account.activityCount])
  }
}

const acc1 = new BankAccount(1)
console.log(acc1)
console.log(acc1.deposit(10))
console.log(acc1.deposit(5))

const accMgr1 = new BankAccountManager()
console.log(accMgr1)
console.log(accMgr1.createAccount(1))
console.log(accMgr1)
console.log(accMgr1.deposit(1, 10))
console.log(accMgr1.createAccount(2))
console.log(accMgr1)
console.log(accMgr1.transfer(1, 2, 5))
console.log(accMgr1)
accMgr1.createAccount(3)
accMgr1.deposit(3, 5)
console.log(accMgr1.getKthHighest(2))

/* -------------------------------------------------------- */
                  /* 3 question marks */
/* -------------------------------------------------------- */

const threeQuestionMarks = (str) => {
  if (str.length < 5) return false

  let leftNum = -1,
      questionMarkCount = 0,
      isValid = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const rightNum = Number(char)

    if (rightNum >= 0) {
      if (leftNum >= 0 && questionMarkCount === 3) {
        if (leftNum + rightNum !== 10) return false
        isValid = true
      }

      leftNum = rightNum
      questionMarkCount = 0
    } else if (char === '?') questionMarkCount++
  }

  return isValid
}

console.log(threeQuestionMarks("arrb6???4xxb15???eee5"))
console.log(threeQuestionMarks("acc?7??sss?3rr1??????5"))
console.log(threeQuestionMarks("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(threeQuestionMarks("a9???1???9???177?9"))
// false test cases
console.log(threeQuestionMarks("aa6?9"))
console.log(threeQuestionMarks("8???2???9"))
console.log(threeQuestionMarks("10???0???10"))
console.log(threeQuestionMarks("aa3??oiuqwer?7???2"))

/* -------------------------------------------------------- */
                        /* 12/24/23 */
/* -------------------------------------------------------- */

// input: number
// output: number
const numPrimes = (n) => {
  if (n < 2) return 0

  let result = 0
  const haveSeenNums = new Array(n + 1).fill(false)

  for (let num = 2; num <= n; num++) {
    // if we've already seen num, it's not a prime so continue with loop
    if (haveSeenNums[num] === true) continue

    // for each prime num, update all multiples in haveSeen array
    result++

    for (let multiple = num * num; multiple <= n; multiple += num) {
      haveSeenNums[multiple] = true
    }
  }

  return result
}

console.log(numPrimes(10)) // -> 4
console.log(numPrimes(20)) // -> 8
console.log(numPrimes(23)) // -> 9
