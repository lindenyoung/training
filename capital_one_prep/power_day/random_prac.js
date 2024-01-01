class AccountTokenization {
  constructor(id, balance, sensitive) {
    this.id = id;
    this.balance = balance;
    this.sensitive = sensitive;
  }

  // THIS IS BLANK
  accountService(accounts) { // O(n + m) time - the find method takes m time, but does not depend on length of accounts array so not quadratic
    const updatedAccounts = accounts.map((account) => new AccountTokenization(account.id, account.balance, account.sensitive))
    const sensitiveAccounts = updatedAccounts.filter((account) => account.sensitive === true)
    const requests = sensitiveAccounts.map((account) => new TokenServiceRequest(account.id, account))
    const responses = TokenService.prototype.tokenService(requests)

    for (const account of sensitiveAccounts) {
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

// THIS IS BLANK
class TokenService { // O(n) time
  tokenService(tokenServiceRequests) {
    const responses = tokenServiceRequests.map((request) => {
      const token = 'tkn_' + request.data.id
      return new TokenServiceResponse(request.trackingId, token)
    })

    return responses
  }
}

const accounts1 = [new AccountTokenization("1234",12,true), new AccountTokenization("2233",22, false)]
const response1 = AccountTokenization.prototype.accountService(accounts1)
// this should be true:
// 'tkn_' + accounts[0].id === response[0].id
console.log(accounts1[0].id) // '1234'
console.log(response1[0].id) // 'tkn_1234'



/* BANK ACCOUNT OOP PROBLEM */
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

  getKthHighest(k) {
    const sortedAccounts = Object.values(this.accounts).sort((a, b) => b.transactionTotal - a.transactionTotal)

    let count = 1,
        kthHighestTotal = sortedAccounts[0].transactionTotal

    for (let i = 1; i < sortedAccounts.length && count < k; i++) {
      if (sortedAccounts[i].transactionTotal !== kthHighestTotal) {
        kthHighestTotal = sortedAccounts[i].transactionTotal
        count++
      }
    }

    const kthHighestAccounts = sortedAccounts.filter((account) => account.transactionTotal === kthHighestTotal)
    const result = kthHighestAccounts.map((account) => [account.id, account.transactionTotal])

    return result
  }
}

const acc1 = new BankAccount(1)
console.log(acc1.deposit(10))
console.log(acc1.deposit(5))
console.log(acc1)


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

// O(n log(log(n))) time complexity
const countPrimes = (n) => {
  if (n < 2) return 0

  const seenNums = new Array(n + 1).fill(false)
  let result = 0

  for (let num = 2; num <= n; num++) {
    if (seenNums[num] === true) continue // skip seen nums
    result++

    // update all multiples of curr num to seen
    for (let multiple = num * num; multiple <= n; multiple += num) {
      seenNums[multiple] = true
    }
  }

  return result
}

console.log(countPrimes(10)) // -> 4
console.log(countPrimes(20)) // -> 8
console.log(countPrimes(23)) // -> 8 or 9 depending on < or <=

const threeQuestionMarks = (str) => {
  if (str.length < 5) return false

  let leftNum = -1,
      questionMarkCount = 0,
      isValid = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const rightNum = Number(char)

    // if currChar is a digit
    if (rightNum >= 0) {
      // check for 3 question marks and valid left digit
      if (leftNum >= 0 && questionMarkCount === 3) {
        // check if nums sum to ten
        if (leftNum + rightNum === 10) isValid = true
        else return false
      }

      questionMarkCount = 0
      leftNum = rightNum
    } else if (char === '?') questionMarkCount++
  }

  return isValid
}
// true test cases
console.log(threeQuestionMarks("arrb6???4xxb15???eee5"))
console.log(threeQuestionMarks("acc?7??sss?3rr1??????5"))
console.log(threeQuestionMarks("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(threeQuestionMarks("a9???1???9???177?9"))
// false test cases
console.log(threeQuestionMarks("aa6?9"))
console.log(threeQuestionMarks("8???2???9"))
console.log(threeQuestionMarks("10???0???10"))
console.log(threeQuestionMarks("aa3??oiuqwer?7???2"))