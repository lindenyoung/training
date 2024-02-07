/* BANK ACCOUNT OOP PROBLEM */

// create account and deposit
// transfer
// getKthHighest
// method to process commands / tests

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
    return this.accounts[to].deposit(amount)
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

  // O(n log(n)) bc of sort
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
console.log(manager1.getKthHighestActivity(2)) // [['one', 60], ['four', 60]]

const manager2 = new AccountManager()
const testCommands = [["CREATEACCOUNT" , "Account1"], ["CREATEACCOUNT" , "Account2"],["DEPOSIT" , "Account1", "100"], ["DEPOSIT" , "Account2", "200"], ["TRANSFER" , "Account1", "Account2", 50], ["GETKTHHIGHESTACTIVITY", 2]]
console.log(manager2.processCommands(testCommands))
console.log(manager2)

class AccountTokenization {
  constructor(id, balance, sensitive) {
    this.id = id
    this.balance = balance
    this.sensitive = sensitive
  }

  // THIS IS BLANK
  // O(n + m) time - the find method takes m time, but does not depend on length of accounts array so not quadratic
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

/*
1. Count primes (Sieve of Eratosthenes)
2. Sum of numbers separated by 3 question marks (multiple solutions in Discord channel)
3. Count letters (see Kevin’s post for code solution)
4. Two sum closest target
*/

// n: number
// output: number
// 10 -> 3, 5, 7, 9 = 4
// 20 -> 8
// 23 -> 9

// brute force approach: O(n^2) time complexity
// declare count var
// for loop from 2 to n (inclusive)
  // declare var to keep track of if currNum is a prime (boolean)
  // for each num, need to check to see if it's divisible by any num from 2 to currNum (sqrt of currNum is small optimization)
    // if divisible by any num, break from inner for loop bc currNum is not prime
  // increment count if boolean is true

// optimized approach: O(n log(log(n)))
// single for loop, using an array of booleans to track each num we've seen, updating all multiples of currNum as we go along
// for loop from 2 to n (inclusive)
  // if we've already seen currNum, skip (bc it's not a prime)
  // increment primes count (haven't seen num so it must be a prime - not divisible by any num less than itself)
  // update all multiples of currNum in our placeholder array since we've "seen" them

  const countPrimes = (n) => {
  // edge cases
  if (n < 2) return 0

  // initialize vars
  let count = 0
  const seenNums = new Array(n + 1).fill(false)

  // iterate
  for (let i = 2; i <= n ; i++) {
    if (seenNums[i] === true) continue
    count++

    for (let mult = i * i; mult <= n; mult += i) {
      seenNums[mult] = true
    }
  }

  return count
}

console.log(countPrimes(10))
console.log(countPrimes(20))
console.log(countPrimes(23))

// str: string
// output: boolean

// brute force approach: O(n^2)
// for loop iterating over input str
  // for each element, check if it's a digit
  // if so, then start second for loop at i + 1
    // until second element is a digit, we need to count question marks and skip letters
    // when we reach another digit, check if we have 3 question marks and then the sum of digits to determine if valid pair

// optimized approach: O(n)
// use a sliding window between digits, reset after finding a digit and checking for valid conditions

const questionMarks = (str) => {
  // edge cases?
  if (str.length < 5) return false

  // initialize vars
  let isValid = false,
      leftDigit = -1, // left pointer of window
      questionMarkCount = 0

  // iterate
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const charNum = Number(str[i]) // will either be a number or NaN type

    // stop expanding window when we reach a digit
    if (charNum >= 0) {
      // check question mark count and that we have a valid left digit to compare with
      if (leftDigit >= 0 && questionMarkCount === 3) {
        if (leftDigit + charNum === 10) isValid = true
        else return false
      }

      // reset window
      leftDigit = charNum
      questionMarkCount = 0
    // increment question mark count
    } else if (char === '?') {
      questionMarkCount++
    }
  }

  // return
  return isValid
}

// true
console.log(questionMarks("arrb6???4xxb15???eee5"))
console.log(questionMarks("acc?7??sss?3rr1??????5"))
console.log(questionMarks("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(questionMarks("a9???1???9???177?9"))
// false
console.log(questionMarks("aa6?9"))
console.log(questionMarks("8???2???9"))
console.log(questionMarks("10???0???10"))
console.log(questionMarks("aa3??oiuqwer?7???2"))

// nums: number[]
// output: [number, number]

// brute force approach: O(n^2)
// nested for loop solution
// for each number in input array, start a second for loop to then check all other nums in array for sum / diff

// optimized approach: O(n log(n))
// sort + two pointers solution

const twoSumClosestToTarget = (nums, target) => {
  // edge cases?
  if (nums.length < 2) return 'error: need at least two nums in input array!'

  nums.sort((a, b) => a - b)

  // initialize vars
  let result = [], // update result as we go
      minDiff = Infinity, // track minimum difference seen so far
      left = 0, // left pointer
      right = nums.length - 1 // right pointer

  // iterate until pointers have crossed
  while (left < right) {
    // grab sum
    const sum = nums[left] + nums[right]

    // edge case where sum is equal to our target
    if (sum === target) {
      result = [nums[left], nums[right]]
      minDiff = 0
      break
    }

    // grab curr diff and compare with min diff, updating result / min diff as needed
    const currDiff = Math.abs(target - sum)

    if (currDiff < minDiff) {
      result = [nums[left], nums[right]]
      minDiff = currDiff
    }

    // move one pointer based on comparing curr sum with target
    if (sum < target) left++
    else if (sum > target) right--
  }

  // return
  return result
}

console.log(twoSumClosestToTarget([5, 1, 2, 3, 4], 10)) // [4, 5]
console.log(twoSumClosestToTarget([-1, 2, 1, -4], 4)) // [1, 2]
console.log(twoSumClosestToTarget([1, 5, 2, 3, 7], 12)) // [5, 7]

// O(n)
const preProcessCharacterFrequencyUsingMap = (str) => {
  // edge cases?
  if (!str) return 'error: invalid or empty input'

  // initialize our result map
  const resultMap = new Map()

  // iterate over input str (creating frequency maps at each index)
  for (let i = 0; i < str.length; i++) {
    // for each index, grab a copy of the previous index's map
    const tempMap = new Map(resultMap.get(i - 1) || new Map())
    // update the curr char's frequency
    tempMap.set(str[i], (tempMap.get(str[i]) || 0) + 1)
    // add map for curr index to our result map
    resultMap.set(i, tempMap)
  }

  // return result map
  return resultMap
}

// must be O(1) lookup
const characterFrequencyUsingMap = (map, target, start, end) => {
  // given a map of the frequency count at each index of given string
  // access the end index map, then the target char to get target frequency at end of our window
  // access the index prior to start index, then the target char to get target frequency before our window (or 0)
  const result = (map.get(end)?.get(target) || 0) - (map.get(start - 1)?.get(target) || 0)
  return result
}

const c1Map = preProcessCharacterFrequencyUsingMap('capitalone')
console.log(c1Map)
console.log(characterFrequencyUsingMap(c1Map, 'a', 1, 4)) // --> 1
console.log(characterFrequencyUsingMap(c1Map, 'a', 0, 5)) // --> 2

/*
---------------------------------------------------------------------------
          THE BRAND NEW ALGO I GOT ASKED IN MY JANUARY POWER DAY
---------------------------------------------------------------------------
*/

class FileSystem {
  constructor() {
    this.files = {}
  }

  addFile(fileName) {
    if (fileName in this.files) return false
    this.files[fileName] = true
    return true
  }

  deleteFile(fileName) {
    if (!(fileName in this.files)) return false
    delete this.files[fileName]
    return true
  }

  copyFile(fileName, toDirectory) {
    // what were the edge / false cases here?
    if (toDirectory[toDirectory.length - 1] !== '/') return false

    const directory = toDirectory.slice(1) // remove first slash '/'
    const newFilePath = directory + fileName

    if (newFilePath in this.files) return false
    this.files[newFilePath] = true
    return true
  }
}

const testFileSystem = new FileSystem()
console.log(testFileSystem.addFile('file_one'))
console.log(testFileSystem.addFile('file_one'))
console.log(testFileSystem.deleteFile('file_two'))
// console.log(testFileSystem.deleteFile('file_one'))
console.log(testFileSystem.addFile('file_two'))
console.log(testFileSystem.addFile('dir_one/file_three'))
console.log(testFileSystem)
console.log(testFileSystem.copyFile('file_one', '/dir_one/'))
console.log(testFileSystem)
