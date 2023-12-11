/*
Pairs of songs with total durations divisible by 60 - leetcode 1010
Input: time = [30,20,150,100,40]
Output: 3
*/

const songPairs = (times) => {
  // edge cases
  if (!times || !times.length) return 0

  // initialize vars
  let result = 0
  const map = {}

  // iterate / logic
  for (const time of times) {
    const remainder = time % 60
    const match = (60 - remainder) % 60

    if (map[match]) result += map[match]

    map[remainder] = (map[remainder] || 0) + 1
  }

  // return
  return result
}

// console.log(songPairs([30,20,150,100,40]))

/**
 * Longest palindrome by concatenating two letter words - leetcode 2131
 * Input: words = ["lc","cl","gg"]
 * Output: 6
 * Explanation: One longest palindrome is "lc" + "gg" + "cl" = "lcggcl", of length 6
 */

const palindromeConcatenation = (words) => {
  // edge cases
  if (!words || !words.length) return 0

  // initialize vars
  let result = 0
  const map = {}

  for (const word of words) {
    const reversedWord = word[1] + word[0]

    // found palindrome match to currWord
    if (map[reversedWord]) {
      result += 4
      map[reversedWord]-- // decrement to account for using that word
    // otherwise, add word to map or increment
    } else map[word] = (map[word] || 0) + 1
  }

  // account for single word palindromes like 'gg', can add 1 to result if exists
  const singleWordPalindromes = Object.keys(map).filter((key) => map[key] && key[1] + key[0] === key)
  if (singleWordPalindromes.length) result += 2

  return result
}

// console.log(palindromeConcatenation(["lc","cl","gg"]))

/**
 * Array of doubled pairs - leetcode 954
 * Better description of problem - Could we find a pair for each number in the array, so one element of the pair is twice bigger than other?
 * Input: arr = [4,-2,2,-4]
 * Output: true
 * Explanation: We can take two groups, [-2,-4] and [2,4] to form [-2,-4,2,4] or [2,4,-2,-4].
 */

const doubledPairs = (nums) => {
  if (!nums || !nums.length) return false

  nums.sort((a, b) => a - b)

  const map = {}

  for (const n of nums) {
    map[n] = (map[n] || 0) + 1
  }

  for (const n of nums) {
    // what about when we hit a num that was already a match for a prev num and has been deleted from map?
    if (!map[n]) continue

    const match = n >= 0 ? n * 2 : n / 2 // -4 -> -2, 2 -> 4
    if (!map[match]) return false

    for (const key of [n, match]) {
      if (--map[key] === 0) delete map[key]
    }
  }

  return true
}

// console.log(doubledPairs([4, -2, 2, -4]))


/**
 * Count number of nice subarrays - leetcode 1248
 * "nice" = 3 odd numbers in subarray
 * Input: nums = [1,1,2,1,1], k = 3
 * Output: 2
 * Explanation: The only sub-arrays with 3 odd numbers are [1,1,2,1] and [1,2,1,1].
 */

const countNiceSubarrays = (nums, k) => {
  if (!nums || !nums.length) return 0

  // helper func
  const isOdd = (n) => n % 2 === 1

  let result = 0,
      left = 0,
      numOdds = 0,
      currCount = 0

  // expand window
  for (let right = 0; right < nums.length; right++) {
    if (isOdd(nums[right])) {
      numOdds++
      currCount = 0
    }

    // shrink window
    while (numOdds === k && left < right) {
      if (isOdd(nums[left])) numOdds--
      currCount++
      left++
    }

    result += currCount
  }

  return result
}

// console.log(countNiceSubarrays([1, 1, 2, 1, 1], 3))

// Rearrange input array and return whether that new array is in strictly ascending order
// For a = [1, 3, 5, 6, 4, 2], the output should be solution(a) = true. The new array b will look like [1, 2, 3, 4, 5, 6], which is in strictly ascending order, so the answer is true.
// O(n) time and O(n) space

const rearrange = (nums) => {
  if (!nums || !nums.length) return false
  if (nums.length === 1) return true

  const newArr = []
  let left = 0,
      right = nums.length - 1

  for (let i = 0; i < nums.length; i++) {
    const isEvenIndex = i % 2 === 0
    const lastEl = newArr[newArr.length - 1]
    const currEl = isEvenIndex ? nums[left] : nums[right]

    if (currEl <= lastEl) return false
    newArr.push(currEl)

    if (isEvenIndex) left++
    else right--
  }

  return true
}

// console.log(rearrange([1, 3, 5, 6, 4, 2]))
// console.log(rearrange([1, 3, 5, 6, 7, 2]))

// Sawtooth sequence
// https://stackoverflow.com/questions/69356332/counting-contiguous-sawtooth-subarrays
// For arr = [9, 8, 7, 6, 5], the output should be solution(arr) = 4. Since all the elements are arranged in decreasing order, it won't be possible to form any sawtooth subarrays of length 3 or more. There are 4 possible subarrays containing two elements, so the answer is 4.
// O(n) time and O(1) space

const sawtooth = (nums) => {
  // edge cases
  if (!nums || !nums.length) return 0

  // initialize vars
  let result = 0,
      currStreak = 0,
      prevWasIncreasing = null

  // iterate
  for (let i = 1; i < nums.length; i++) {
    // edge case of currNum being equal to prev num
    if (nums[i] === nums[i - 1]) {
      currStreak = 0
      prevWasIncreasing = null
      continue
    }

    const currIsIncreasing = nums[i] > nums[i - 1]

    if (currIsIncreasing !== prevWasIncreasing) {
      currStreak++
      prevWasIncreasing = currIsIncreasing
    }

    result += currStreak
  }

  // return
  return result
}

// console.log(sawtooth([9, 8, 7, 6, 5]))
// console.log(sawtooth([1, 2, 1, 2, 1]))
// console.log(sawtooth([10, 10, 10]))

// Manipulate input string based on prefixes and palindromes
// s = "aaacodedoc" | output = "" (aaa is first prefix palindrome, then codedoc)
// s = "abbab" | output = "b"

const manipulatePrefixes = (str) => {
  // helper func
  const isPalindrome = (s) => {
    let left = 0,
        right = s.length - 1

    while (left < right) {
      if (s[left] !== s[right]) return false
      left++
      right--
    }

    return true
  }

  // edge cases
  if (str.length <= 1) return str

  // initialize vars
  const palindromePrefixes = []
  let left = 0,
      right = 1

  while (right <= str.length) { // need <= here bc of slice 2nd argument being exclusive
    const prefix = str.slice(left, right)
    if (isPalindrome(prefix) && prefix.length >= 2) palindromePrefixes.push(prefix)
    right++
  }

  if (!palindromePrefixes.length) return str

  // return
  const updatedStr = str.replace(palindromePrefixes[palindromePrefixes.length - 1], '')
  return updatedStr === '' ? '' : manipulatePrefixes(updatedStr)
}

// console.log(manipulatePrefixes('aaacodedoc')) // -> ''
// console.log(manipulatePrefixes('abbab')) // -> 'b

/**
 * K-diff pairs in an array - leetcode 532
 * Input: nums = [3,1,4,1,5], k = 2
 * Output: 2
 * Explanation: There are two 2-diff pairs in the array, (1, 3) and (3, 5). Although we have two 1s in the input, we should only return the number of unique pairs.
 */

const diffPairs = (nums, k) => {
  let result = 0
  const map = {}

  for (const n of nums) {
    map[n] = (map[n] || 0) + 1
  }

  for (const key of Object.keys(map)) {
    if (k !== 0) {
      const match = k + +key // |a - b| = k => a = k + b
      if (map[match]) result++
    } else if (map[key] >= 2) result++
  }

  return result
}

// console.log(diffPairs([3,1,4,1,5], 2))

// Manipulate input string based on prefixes and palindromes
// s = "aaacodedoc" | output = "" (aaa is first prefix palindrome, then codedoc)
// s = "abbab" | output = "b"

const prefixes2 = (str) => {
  const isPalindrome = (s) => {
    let left = 0,
        right = s.length - 1

    while (left < right) {
      if (s[left] !== s[right]) return false
      left++
      right--
    }

    return true
  }

  // initialize vars
  const validPrefixes = [] // palindrome prefixes of at least 2 chars length
  let left = 0,
      right = 1

  while (right <= str.length) {
    const prefix = str.slice(left, right) // 2nd arg is exclusive, this hence the <= in while loop
    if (isPalindrome(prefix) && prefix.length >= 2) validPrefixes.push(prefix)
    right++
  }

  // edge case - no valid prefixes
  if (!validPrefixes.length) return str

  const longestValidPrefix = validPrefixes[validPrefixes.length - 1]
  const updatedStr = str.replace(longestValidPrefix, '')

  // recursive call if updatedStr is not empty after removing longest palindrome prefix
  return updatedStr === '' ? '' : prefixes2(updatedStr)
}

// console.log(prefixes2('aaac'))

/* #2
Count number of digit anagram pairs
a = [25, 35, 872, 228, 53, 278, 872], output = 4.
There are 4 pairs of digit anagrams:
a[1] = 35 and a[4] = 53 (i = 1 and j = 4),
a[2] = 872 and a[5] = 278 (i = 2 and j = 5),
a[2] = 872 and a[6] = 872 (i = 2 and j = 6),
a[5] = 278 and a[6] = 872 (i = 5 and j = 6).
*/

const digitAnagrams = (nums) => {
  if (!nums || !nums.length) return 0

  let result = 0
  const map = {} // will be a freq map for digit strings of each num in input arr

  for (let num of nums) {
    const currDigits = []

    while (num > 0) {
      const rightMostDigit = num % 10
      currDigits.push(rightMostDigit)
      num = Math.floor(num / 10) // remove rightmost digit (ones)
    }

    currDigits.sort((a, b) => a - b) // sort for consistency of keys (anagrams can be in any order, so sorted they are equal)
    const digitStr = JSON.stringify(currDigits) // make a string for the freqMa\] property key

    if (map[digitStr]) result += map[digitStr]++ // not just incrementing bc could be multiple of same anagram
    else map[digitStr] = 1
  }

  return result
}

// console.log(digitAnagrams([25, 35, 872, 228, 53, 278, 872]))

/* #1
 Given two strings s and t, both consisting of lowercase English letters and digits, your task is to calculate how many ways exactly one digit could be removed from one of the strings so that s is lexicographically smaller than t after the removal. Note that we are removing only a single instance of a single digit, rather than all instances (eg: removing 1 from the string a11b1c could result in a1b1c or a11bc, but not abc).
 Also note that digits are considered lexicographically smaller than letters.
 Input: s = "ab12c", t = "1zz456"
 Output: 1
 The only valid case where s < t after removing a digit is "ab12c" < "zz456". Therefore, the answer is 1.
 O(n + m) time which is just O(n) and O(1) space
 */

 const stringsWithDigits = (s, t) => {
  let result = 0

  // will need to iterate over both input strings separately to account for all possibilities
  for (let i = 0; i < s.length; i++) {
    // if currChar is a digit, remove and check for valid case
    if (s[i].match(/\d/)) {
      const newStr = s.slice(0, i) + s.slice(i + 1)
      if (newStr < t) result++
    }
  }

  for (let i = 0; i < t.length; i++) {
    if (t[i].match(/\d/)) {
      const newStr = t.slice(0, i) + t.slice(i + 1)
      if (s < newStr) result++
    }
  }

  return result
 }

//  console.log(stringsWithDigits('ab12c', '1zz456'))

 /* #1
Given an array of integers a, your task is to calculate the digits that occur the most number of times in the array. Return the array of these digits in ascending order.
For a = [25, 2, 3, 57, 38, 41], the output should be solution(a) = [2, 3, 5].
Input: [4, 5, 4, 2, 2, 25], Output: [2]
O(n) time and O(n) space
*/

const digitsss = (nums) => {
  const result = [],
        map = {}

  let maxCount = 0

  for (let num of nums) {
    while (num > 0) {
      const digit = num % 10
      num = Math.floor(num / 10)
      map[digit] = (map[digit] || 0) + 1
      maxCount = Math.max(maxCount, map[digit])
    }
  }

  for (const key in map) {
    if (map[key] === maxCount) result.push(+key)
  }

  return result
}

// console.log(digitsss([25, 2, 3, 57, 38, 41]))
// console.log(digitsss([4, 5, 4, 2, 2, 25]))

/* #2
You are given an array of integers a and an integer k. Your task is to calculate the number of ways to pick two different indices i < j, such that a[i] + a[j] is divisible by k.
For a = [1, 2, 3, 4, 5] and k = 3, the output should be solution(a, k) = 4.

There are 4 pairs of numbers that sum to a multiple of k = 3:

a[0] + a[1] = 1 + 2 = 3
a[0] + a[4] = 1 + 5 = 6
a[1] + a[3] = 2 + 4 = 6
a[3] + a[4] = 4 + 5 = 9
 */

const twoSumDivisible = (nums, k) => {
  let result = 0
  const map = {}

  for (const num of nums) {
    const remainder = num % k // 1, 2, 0, 1, 2
    const match = k - remainder // 2, 1, 3, 1, 3
    // handle zero remainder cases
    if (match === k) {
      result += map[0] || 0
      map[0] = (map[0] || 0) + 1
    } else {
      result += map[match] || 0
      map[remainder] = (map[remainder] || 0) + 1
    }
  }

  return result
}

console.log(twoSumDivisible([1,2,3,4,5], 3))
console.log(twoSumDivisible([1,2,3,4,5,9], 3))

/* #1
You are given two strings - pattern and source. The first string pattern contains only the symbols 0 and 1, and the second string source contains only lowercase English letters.
Let's say that pattern matches a substring source[l..r] of source if the following three conditions are met:
  they have equal length,
  for each 0 in pattern the corresponding letter in the substring is a vowel,
  for each 1 in pattern the corresponding letter is a consonant.
Your task is to calculate the number of substrings of source that match pattern.
Note: In this task we define the vowels as 'a', 'e', 'i', 'o', 'u', and 'y'. All other letters are consonants.

Input: pattern = '010', source = 'amazing'
Output: 2 ('ama', 'azi')
*/

const stringPatterns = (pattern, source) => {
  let result = 0
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y']

  for (let i = 0; i < source.length - pattern.length + 1; i++) {
    let isValidStr = 1

    // expand currWindow to pattern length
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j] === '0' && !vowels.includes(source[i + j])) {
        isValidStr = 0
        break
      } else if (pattern[j] === '1' && vowels.includes(source[i + j])) {
        isValidStr = 0
        break
      }
    }

    result += isValidStr
  }

  return result
}



console.log(stringPatterns('010', 'amazing'))

/* #1
You are given a string s. Your task is to count the number of ways of splitting s into three non-empty parts a, b and c (s = a + b + c) in such a way that a + b, b + c and c + a are all different strings.
https://leetcode.com/discuss/interview-question/922241/quora-oa-2020-ways-to-split-string
Input: s = "xzxzx"
Output: 5
*/

const splitString = (s) => {
  let result = 0

  // start at index 1 bc of first s.substring call
  for (let i = 1; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      const a = s.substring(0, i),
            b = s.substring(i, j),
            c = s.substring(j, s.length)

      if (
        !(a + b === b + c) &&
        !(b + c === c + a) &&
        !(a + b === c + a)
      ) result++
    }
  }

  return result
}

console.log(splitString('xzxzx'))

/* #2
Cut ribbons - leetcode 1891
You are given an array of integers a, where each element a[i] represents the length of a ribbon.
Your goal is to obtain k ribbons of the same length, by cutting the ribbons into as many pieces as you want.
Your task is to calculate the maximum integer length L for which it is possible to obtain at least k ribbons of length L by cutting the given ones.

Input: a = [5, 2, 7, 4, 9] and k = 5
Output: 4
*/

const ribbons = (a, k) => {
  const maxVal = Math.max(...a)
  if (maxVal === 0) return 0

  // helper func
  const isValidCutSize = (length) => {
    const numOfPieces = a.reduce((acc, ribbon) => acc += Math.floor(ribbon / length), 0)
    return numOfPieces >= k ? true : false
  }

  let left = 0,
      right = maxVal

  while (left < right) {
    const mid = Math.floor(left + right + 1 / 2)
    if (isValidCutSize(mid)) left = mid
    else right = mid - 1
  }

  return left
}

console.log(ribbons([5,2,7,4,9], 5))

/*
12/3/23 Codesignal GCA Q4
Given an array of numbers, count the number of distinct pairs (i, j) where numbers[i] can be obtained from numbers[j] by swapping no more than two digits of numbers[j]
input: [1, 23, 156, 1650, 651, 165, 32]
output: 3
23 - 32
156 - 165
156 - 651
*/

// brute force solution, O(n^2) time
const q4 = (numbers) => {
  let result = 0

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const first = numbers[i]
      const second = numbers[j]

      const strFirst = first.toString()
      const strSecond = second.toString()
      const firstSorted = strFirst.split('').sort().join('')
      const secondSorted = strSecond.split('').sort().join('')

      // if nums are same length and the same sorted, check for how many digits we'd need to swap
      if (strFirst.length === strSecond.length && firstSorted === secondSorted) {
        let numDiff = 0

        for (let k = 0; k < strFirst.length; k++) {
          if (strFirst[k] !== strSecond[k]) numDiff++
        }

        if (numDiff <= 2) result++ // numDiff will only ever be an even num
      }
    }
  }

  return result
}

console.log(q4([1, 23, 156, 1650, 651, 165, 32])) // -> 3
console.log(q4([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])) // -> 0
console.log(q4([12345, 12354, 13254, 31254])) // -> 3
