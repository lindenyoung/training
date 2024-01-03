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

const characterFrequency = (str, target, start, end) => {
  let result = 0

  for (let i = start; i <= end; i++) {
    if (str[i] === target) result++
  }

  return result
}

const charFreqPreProcessor1 = (str) => {
  const map = {}

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (char in map) map[char].push(i)
    else map[char] = [i]
  }

  console.log(map)
  return map
}

const charFrequencyUpdated1 = (map, target, start, end) => {
  if (!(target in map)) return 0

  const targetCharIndices = map[target].filter((index) => index >= start && index <= end)
  return targetCharIndices.length
}

const charFreqPreProcessor2 = (str) => {
  const map = {} // new Map()

  for (let i = 0; i < str.length; i++) {
    // grab map for prev index
    const prevMap = {...(map[i - 1] || {})}
    // increment curr char's frequency
    prevMap[str[i]] = (prevMap[str[i]] || 0) + 1
    // update result map for curr index key
    map[i] = prevMap

    // version using a new Map() instance that would be in the for loop
    // const prevMap = new Map(map.get(i - 1) || new Map())
    // prevMap.set(str[i], (prevMap.get(str[i]) || 0) + 1)
    // map.set(i, prevMap)
  }

  console.log(map)
  return map
}

// want constant O(1) lookup time here
const charFrequencyUpdated2 = (map, target, start, end) => {
  return (map[end]?.[target] || 0) - (map[start]?.[start - 1] || 0)
  // return (map.get(end)?.get(target) || 0) - (map.get(start - 1)?.get(target) || 0) // Map instance version
}

const map1 = charFreqPreProcessor1('capitalone')
const map2 = charFreqPreProcessor2('capitalone')
console.log(characterFrequency('capitalone', 'a', 1, 4)) // 1
console.log(charFrequencyUpdated1(map1, 'a', 1, 4)) // -> 1
console.log(charFrequencyUpdated1(map1, 'a', 0, 5)) // 2
console.log(charFrequencyUpdated2(map2, 'a', 1, 4)) // 1
console.log(charFrequencyUpdated2(map2, 'a', 0, 5)) // 2

const twoSumClosestToTarget = (nums, target) => {
  if (nums.length < 2) return 'error: need at least two nums in input array'

  nums.sort((a, b) => a - b) // need to sort for two pointers approach

  let result = [],
      left = 0,
      right = nums.length - 1,
      minDiff = Infinity

  while (left < right) {
    const sum = nums[left] + nums[right]

    // edge case of sum = target
    if (sum === target) {
      result = [nums[left], nums[right]]
      minDiff = 0
      break // exit
    }

    const currDiff = Math.abs(target - sum)

    if (currDiff < minDiff) {
      result = [nums[left], nums[right]]
      minDiff = currDiff
    }

    // update one pointer
    if (sum < target) left++
    else if (sum > target) right--
  }

  return result
}

console.log(twoSumClosestToTarget([5, 1, 2, 3, 4], 10)) // -> [4, 5]
console.log(twoSumClosestToTarget([-1, 2, 1, -4], 4)) // -> [1, 2]

/* 1/3/24 practice */

// count primes
// n: number
// output: number
// 10 -> 4, 20 -> 8, 23 -> 9
const countPrimes2 = (n) => { // O(n log(log(n)))
  // edge cases
  if (n < 2) return 0 // 0 and 1 are not primes

  // declare vars
  let count = 0
  const seenNums = new Array(n + 1).fill(false) // index represents num from 2 to n

  // iterate
  // for each num, if we've already seen it then just skip it
  // otherwise, increment count and update all multiples of num to "seen"
  for (let i = 2; i <= n; i++) { // O(n)
    if (seenNums[i] === true) continue
    count++

    for (let mult = i * i; mult <= n; mult += i) { // i = 3, mult = 9, 9 += 3 = 12 += 3 = 15 etc
      seenNums[mult] = true
    }
  }


  return count
}

// 3 ???
// str: string
// output: boolean
const questionsss = (str) => {
  // edge cases
  if (str.length < 5) return false

  // initialize vars
  let leftDigit = -1,
      questionMarks = 0,
      isValid = false


  // iterate
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const rightDigit = Number(char) // will get NaN for non-digits

    // if curr char is a valid digit
    if (rightDigit >= 0) {
      // check for digit pair condition
      if (leftDigit >= 0 && questionMarks === 3) {
        // check sum of digits
        if (leftDigit + rightDigit === 10) isValid = true
        else return false
      }

      // reset window (update left pointer and questionMarks count)
      leftDigit = rightDigit
      questionMarks = 0
    // otherwise, if curr char is a question mark (we don't care about letters)
    } else if (char === '?') {
      questionMarks++
    }
  }

  return isValid
}

// true test cases
console.log(questionsss("arrb6???4xxb15???eee5"))
console.log(questionsss("acc?7??sss?3rr1??????5"))
console.log(questionsss("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(questionsss("a9???1???9???177?9"))
// false test cases
console.log(questionsss("aa6?9"))
console.log(questionsss("8???2???9"))
console.log(questionsss("10???0???10"))
console.log(questionsss("aa3??oiuqwer?7???2"))

// count letters
// str: string, target: string, start: number, end: number
// output: number
const letterCount = (map, target, start, end) => { // O(1)
  return (map.get(end)?.get(target) || 0) - (map.get(start - 1)?.get(target) || 0)

  // O(n) solution where n is the length of the map[target] value
  // if (!map[target]) return 0

  // // filter target property for valid indices based on start and end params
  // const targetIndices = map[target].filter((index) => index >= start && index <= end)
  // return targetIndices.length
}

// str: string
// output: { 'a': [1, 5] } string: number[]
const letterProcessor = (str) => { // O(n)
  const map = new Map()

  for (let i = 0; i < str.length; i++) {
    // grab prev index's map
    const prevMap = new Map(map.get(i - 1) || new Map())
    // update curr char's value
    prevMap.set(str[i], (prevMap.get(str[i]) || 0) + 1)
    // update result map to include the map for curr index
    map.set(i, prevMap)
  }

  return map

  // const map = {}

  // for (let i = 0; i < str.length; i++) {
  //   const char = str[i]

  //   if (map[char]) map[char].push(i)
  //   else map[char] = [i]
  // }

  // return map
}

console.log(letterProcessor('capitalone'))
const testMap = letterProcessor('capitalone')
console.log(letterCount(testMap, 'a', 0, 4)) // 1
console.log(letterCount(testMap, 'a', 1, 5)) // 2

// two sum closest