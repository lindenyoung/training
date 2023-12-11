/* -------------------------------------------------------- */
  /*
  Normal Algos:
    1. Count primes (Sieve of Eratosthenes)
    2. Sum of numbers separated by 3 question marks (multiple solutions in Discord channel)
    3. Count letters (see Kevin’s post for code solution)
    4. Two sum closest target

  OOP:
    1. Create account and deposit (see Kevin’s post for code solution)
    2. Bank account tokenization service
  */
/* -------------------------------------------------------- */

/* -------------------------------------------------------- */
                    /* COUNT PRIMES */
/* -------------------------------------------------------- */

// count primes
// Given an integer n, return the number of prime numbers that are less than n (might also be less than or equal to n, read prompt!)
// optimized sieve of eratosthenes solution, know time complexity and how to integrate into a microservice or api
const countPrimes = (n) => {
  if (n < 2) return 0

  const primes = new Array(n + 1).fill(true)
  // primes[0] = primes[1] = false // to be technically accurate but this doens't matter since we are tracking result outside of this array, would matter if we returned primes.reduce((a, b) => a + b)
  let result = 0

  for (let num = 2; num <= n; num++) { // < or <= here depending on prompt
    if (primes[num] === false) continue // skip nums we've already counted out
    result++ // increment count since we haven't seen this num before = it must prime

    // mark all multiples of currNum as seen
    for (let multiple = num * num; multiple <= n; multiple += num) { // num + num will have already been seen as a multiple of a smaller number, this needs to be <=
      primes[multiple] = false
    }
  }
  return result
 }

console.log(countPrimes(10)) // -> 4
console.log(countPrimes(20)) // -> 8
console.log(countPrimes(23)) // -> 8 or 9 depending on < or <=

const primes2 = (n) => {
  // edge cases
  if (n < 2) return 0

  // initialize vars
  const seenNums = new Array(n + 1).fill(true)
  let count = 0

  // iterate - start at 2 since 0 and 1 are not primes
  for (let num = 2; num <= n; num++) {
    // if we've seen currNum, skip it since not prime
    if (seenNums[num] === false) continue
    count++

    // now update all multiples of curr num since they are not primes
    for (let mult = num * num; mult <= n; mult += num) {
      seenNums[mult] = false
    }
  }

  return count
}

console.log(primes2(10))
console.log(primes2(20))
console.log(primes2(23))

const countPrimes2 = (n) => {
  const nums = new Array(n + 1)
  let result = 0

  for (let i = 2; i <= n; i++) {
    if (nums[i]) continue // if currNum already seen, continue to i + 1
    result++ // currNum is prime num if we haven't seen it yet

    // update multiples of currNum
    for (let j = i * i; j <= n; j += i) {
      nums[j] = 1
    }
  }

  return result
}

console.log(countPrimes2(10))
console.log(countPrimes2(20))

 // brute force solution
 // be able to initially talk through this solution but then pivot to coding the optimized solution
 const countPrimesBruteForce = (n) => {
  let count = 0

  // Loop through numbers from 2 to n (inclusive) and count primes
  for (let i = 2; i <= n; i++) {
      let isPrime = true

      // Check if i is divisible by any number from 2 to the square root of i
      for (let j = 2; j <= Math.floor(Math.sqrt(i)); j++) {
          if (i % j === 0) {
              isPrime = false
              break
          }
      }

      // if isPrime is still true, then i is a prime number
      if (isPrime) count++
  }

  return count
}

console.log(countPrimesBruteForce(10))
console.log(countPrimesBruteForce(20))

/* -------------------------------------------------------- */
              /* SUM OF NUMS SEPARATED BY ??? */
/* -------------------------------------------------------- */

/*
Promt:
Take an input string parameter and determine: For all pairs of digits where there are exactly 3 question marks between them, do all pairings add up to 10.

Test Cases
1. ("arrb6???4xxb15???eee5", True) 6???4 add up to 10 and all #4 conditions are met
2. ("acc?7??sss?3rr1??????5", True) 7??sss?3 add up to 10 as letters could be ignored and thus all #4 conditions are met
3. ("5??aaaaaaaaaaaaaaaaaaa?5?5", True) 5??aaaaaaaaaaaaaaaaaaa?5 add up to 10
4. ("9???1???9???177?9", True) 9???1 and 1???9 and 9???1 add up to 10
5. ("aa6?9", False) there's not a set of ???
6. ("8???2???9", False) 8???2 adds to 10 but 2???9 doesn't add to 11
7. ("10???0???10", False) 10???0 and 0???10 add to 10 BUT numbers are not between 1 and 9
8. ("aa3??oiuqwer?7???2", False)] 3??oiuqwer?7 adds to 10 but 7???2 does not
*/

// pinned solution in discord but I don't love it, not very readable
const threeQuestionMarks = (str) => {
  let i = 0,
      hasSet = false

  while (i < str.length) {
    if (Number(str[i]) >= 0 && Number(str[i]) <= 9) {
      if (str[i] === '0') return false

      let j = i + 1
      let count = 0

      while (j < str.length && !(Number(str[j]) >= 0 && Number(str[j]) <= 9)) {
        if (str[j] === '?') count++
        j++
      }

      if (str[j] === '0') return false
      if (count === 3) {
        hasSet = true
        if (Number(str[i]) + Number(str[j]) !== 10) return false
      }

      i = j
    } else {
      i += 1
    }
  }

  return hasSet
}

// solution from Jason Clark (he passed power day)
const threeQuestionMarksV2 = (string) => {
  let start = -1; // track start value of number bracket - start at -1 to prevent tracking from start of string before first number is found
  let markCount = 0; // track count of ? between numbers
  let validPair = false; // must have at least one valid pair summing to 10 to return true
  for (let i = 0; i < string.length; ++i) {
    // convert current string character to number base 10
    const char = parseInt(string[i], 10);
    if (char >= 0) {
      // if char is a valid number
      if (start >= 0 && markCount === 3) {
        // and start is a valid number and there are three ? between
        if (start + char === 10) {
          // and the two numbers sum to 10, we've found a valid pair
          validPair = true;
        } else {
          // but if the two numbers do NOT sum to 10, we return false
          return false;
        }
      }
      // start looking for the next valid pair at the current character
      start = char;
      markCount = 0;
    } else if (string[i] === '?') {
      // increment count of ? when found
      markCount++;
    }
  }
  return validPair;
}

// my edited version of V2
const threeQuestionMarksV3 = (str) => {
  if (str.length < 5) return false

  // initialize vars
  let leftNum = -1, // digit left of question marks
      questionMarkCount = 0,
      isValid = false // must have at least one valid pair of digits summing to 10 to be true

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const charNum = parseInt(char, 10)
    // console.log(char)
    // console.log(charNum)
    // console.log(leftNum)

    // if currChar is a num
    if (charNum >= 0) {
      // check for valid match - if start is a valid num and there are 3 ???
      if (leftNum >= 0 && questionMarkCount === 3) {
        // update return var or return false depending on sum
        if (leftNum + charNum === 10) isValid = true // chance to make this function more dynamic by adding 2nd arg target instead of hardcoding 10
        else return false
      }

      // update leftNum to currChar and reset question mark count
      leftNum = charNum
      questionMarkCount = 0
    // if currChar is a question mark (we don't care about letters so these are the only 2 top level if cases)
    } else if (char === '?') {
      questionMarkCount++
    }
  }

  return isValid
}

// true test cases
console.log(threeQuestionMarksV3("arrb6???4xxb15???eee5"))
console.log(threeQuestionMarksV3("acc?7??sss?3rr1??????5"))
console.log(threeQuestionMarksV3("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(threeQuestionMarksV3("a9???1???9???177?9"))
// false test cases
console.log(threeQuestionMarksV3("aa6?9"))
console.log(threeQuestionMarksV3("8???2???9"))
console.log(threeQuestionMarksV3("10???0???10"))
console.log(threeQuestionMarksV3("aa3??oiuqwer?7???2"))


/* -------------------------------------------------------- */
                    /* COUNT LETTERS */
/* -------------------------------------------------------- */

/*
*** Initial Prompt ***
- Given a string, a target value, and range of indices, count the number of times that target value appears in the string

Input:
str: 'capitalone'
indexStart: 1
IndexEnd: 4
target: 'a'

Output:
1
*/

// O(n) worst time complexity, O(end - start)
const charFrequency = (str, target, start, end) => {
  let result = 0

  for (let i = start; i <= end; i++) {
    if (str[i] === target) result++
  }

  return result
}

console.log(charFrequency('capitalone', 'a', 1, 4)) // -> 1
console.log(charFrequency('capitalone', 'a', 0, 5)) // -> 2

/*
*** Follow-on questions after solving initial algo ***
- Can you write a pre-processing function to create a data-structure where look-up time is faster?
- Looking for a hash map where the letters are the keys and the value is an array whose elements are the indices where that letter appears in the target string.

Input:
str: 'capitalone'

Output:
hashMap = {
 c: [0],
 a: [1, 5],
 p: [2],
 i: [3],
 t: [4],
 l: [6],
 o: [7],
 n: [8],
 e: [9]
}
*/

// O(n) time but only needs to be done once per input str
const preProcessHelper = (str) => {
  const map = {}

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (map[char]) map[char].push(i)
    else map[char] = [i]
  }

  return map
}

console.log(preProcessHelper('capitalone'))
console.log(preProcessHelper('aaabcaac'))

/*
*** Final part ***
- Rewrite the countLetters function to use the pre-processing function, same test cases as first part
*/

const charFrequencyUpdated = (map, target, start, end) => {
  if (!map[target]) return 0
  const validIndices = map[target].filter((index) => index >= start && index <= end)
  return validIndices.length
}

const charMap1 = preProcessHelper('capitalone') // doing this here instead of in updated func is the whole point of making the preprocessing func. We call it once on a given string and then can check char frequencies
console.log(charFrequencyUpdated(charMap1, 'a', 1, 4)) // -> 1
console.log(charFrequencyUpdated(charMap1, 'a', 0, 5)) // -> 2

/* -------------------------------------------------------- */
                /* TWO SUM CLOSEST TO TARGET */
/* -------------------------------------------------------- */

// two sum closest to target
// output: [num1, num2] - return the two numbers that sum to be closest to the target (not indices)
const twoSumClosestToTarget = (nums, target) => {
  if (nums.length < 2) return 'Error: input array must contain at least two numbers'

  nums.sort((a, b) => a - b)

  let result = [],
      left = 0,
      right = nums.length - 1,
      minDiff = Infinity

  while (left < right) {
    const sum = nums[left] + nums[right]

    // what to do if there is a sum === target scenario? maybe there is no need for this, ask clarifying question here
    if (sum === target) {
      result = [nums[left], nums[right]]
      minDiff = 0
      break
    }

    const currDiff = Math.abs(target - sum)

    // if curr diff is closer to target, update result and minDiff
    if (currDiff < minDiff) {
      result = [nums[left], nums[right]]
      minDiff = currDiff
    }

    // move either left or right pointer based on sum
    if (sum < target) left++
    else if (sum > target) right--
    // sum < target ? left++ : right--
  }

  return result
}

console.log(twoSumClosestToTarget([5, 1, 2, 3, 4], 10)) // -> [4, 5]
console.log(twoSumClosestToTarget([-1, 2, 1, -4], 4)) // -> [1, 2]

/* -------------------------------------------------------- */
            /* OOP - CREATE ACCOUNT AND DEPOSIT */
/* -------------------------------------------------------- */

/* -------------------------------------------------------- */
            /* 00P - BANK ACCOUNT TOKENIZATION */
/* -------------------------------------------------------- */

/* -------------------------------------------------------- */
              /* FETCH API AND CALL FUNC ON DATA */
/* -------------------------------------------------------- */

// write a fetch request to an endpoint that will return data to be used as input for the function / solution you just wrote

/* -------------------------------------------------------- */
                  /* EXTRA PRACTICE */
/* -------------------------------------------------------- */

// O(nlog(log(n))) time
const primesBaby = (n) => {
  // edge cases
  if (n < 2) return 0

  // initialize vars
  let count = 0
  const seenNums = new Array(n + 1).fill(true)

  // iterate
  for (let num = 2; num <= n; num++) {
    // skip seen nums
    if (seenNums[num] === false) continue
    count++ // if currNum hasn't been seen, it is a prime number

    // update all multiples of curNum as they are not prime
    for (let mult = num * num; mult <= n; mult += num) {
      seenNums[mult] = false
    }
  }

  return count
}

console.log(primesBaby(10)) // -> 4
console.log(primesBaby(20)) // -> 8
console.log(primesBaby(23)) // -> 9

const twoSumClosestToZero = (nums) => {
  if (nums.length < 2) return 'Input array must contain at least two elements'

  nums.sort((a, b) => a - b) // sort in increasing order

  let result = [],
      left = 0,
      right = nums.length - 1,
      minDiff = Infinity

  while (left < right) {
    const sum = nums[left] + nums[right]

    // if sum is zero, return
    if (sum === 0) {
      minDiff = 0
      result = [nums[left], nums[right]]
      break
    }

    // update minDiff and reuslt if currDiff is closer to 0
    const currDiff = Math.abs(0 - sum)
    if (currDiff < minDiff) {
      minDiff = currDiff
      result = [nums[left], nums[right]]
    }

    if (sum < 0) left++
    else if (sum > 0) right--
  }

  return result
}

console.log(twoSumClosestToZero([1, 60, -10, 70, -80, 85])) // -> [-80, 85]
console.log(twoSumClosestToZero([-1,1,2,4,5])) // [-1, 1]


const questionMarks = (str) => {
  // edge case
  if (str.length < 5) return false

  // initialize vars
  let leftNum = -1,
      questionMarkCount = 0,
      isValid = false

  // iterate
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const charNum = Number(char)

    // if number
    if (charNum >= 0) {
      if (leftNum >= 0 && questionMarkCount === 3) {
        if (leftNum + charNum === 10) isValid = true
        else return false
      }

      // reset window and question mark count
      leftNum = charNum
      questionMarkCount = 0
    } else if (char === '?') {
      questionMarkCount++
    }
  }
  return isValid
}

// true test cases
console.log(questionMarks("arrb6???4xxb15???eee5"))
console.log(questionMarks("acc?7??sss?3rr1??????5"))
console.log(questionMarks("5??aaaaaaaaaaaaaaaaaaa?5?5"))
console.log(questionMarks("a9???1???9???177?9"))
// false test cases
console.log(questionMarks("aa6?9"))
console.log(questionMarks("8???2???9"))
console.log(questionMarks("10???0???10"))
console.log(questionMarks("aa3??oiuqwer?7???2"))