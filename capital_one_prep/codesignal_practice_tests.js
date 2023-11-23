/* ------------------ 11.9.23 ------------------ */

// Rearrange input array and return whether that new array is in strictly ascending order
// For a = [1, 3, 5, 6, 4, 2], the output should be solution(a) = true. The new array b will look like [1, 2, 3, 4, 5, 6], which is in strictly ascending order, so the answer is true.
// O(n) time and O(n) space
function rearrangeAndIsAscending(a) {
  // initialize variables
  let left = 0,
      right = a.length - 1,
      b = []

  // iterate over input array
  for (let i = 0; i < a.length; i++) {
    // grab curr val based on i
    const even = i % 2 === 0
    const val = even ? a[left] : a[right]

    // invalid case - val is less than last val added to b array
    if (val <= b[b.length - 1]) return false

    // push val to b array and increment / decrement left or right pointers
    b.push(val)
    if (even) left++
    else right--
  }

  // valid case
  return true
}


// Sawtooth sequence
// https://stackoverflow.com/questions/69356332/counting-contiguous-sawtooth-subarrays
// For arr = [9, 8, 7, 6, 5], the output should be solution(arr) = 4. Since all the elements are arranged in decreasing order, it won't be possible to form any sawtooth subarrays of length 3 or more. There are 4 possible subarrays containing two elements, so the answer is 4.
// O(n) time and O(1) space
function countContiguousSawtoothSubarrays(arr) {
  // handle edge cases
  if (!arr || arr.length < 2) return 0

  // initialize vars
  let count = 0,
      streak = 0,
      prevIncreasing = null

  // iterate over input arr
  for (let i = 1; i < arr.length; i++) {
    // curr val same as prev val
    if (arr[i] === arr[i - 1]) {
      streak = 0
      prevIncreasing = null
      continue
    }

    const currIncreasing = arr[i] > arr[i - 1]

    // valid sawtooth
    if (currIncreasing !== prevIncreasing) {
      streak++
      prevIncreasing = currIncreasing
    } else streak = 1

    count += streak
  }

  return count
}

/* ------------------ 11.13.23 ------------------ */

// Manipulate input string based on prefixes and palindromes
// https://leetcode.com/discuss/interview-question/801274/robinhood-coding-question-2
// s = "aaacodedoc" | output = "" (aaa is first prefix palindrome, then codedoc)
// s = "abbab" | output = "b"
// O(n log n) time bc of sort() and O(n) space

const prefixesAndPalindromes = (s) => {
  // helper to verify palindrome
  const isPalindrome = (str) => {
    let left = 0,
        right = str.length - 1

    while (left < right) {
      if (str[left] !== str[right]) return false
      left++
      right--
    }

    return true
  }

  // edge cases
  if (!s.length) return ''
  if (s.length === 1) return s

  const substrings = [],
        palindromes = []

  let i = 0,
      j = 1

  // populate array of all potential substrings
  while (j <= s.length) {
    substrings.push(s.slice(i, j))
    j++
  }

  // sort by length - ascending
  substrings.sort((a, b) => a.length - b.length)

  // populate array of palindromes with length greater than two
  for (const substr of substrings) {
    if (isPalindrome(substr) && substr.length >= 2) palindromes.push(substr)
  }

  // edge case - no palindromes
  if (!palindromes.length) return s

  // remove longest prefix palindrome and recursively call function if necessary
  const curr = s.replace(palindromes[palindromes.length - 1], '').trim()
  if (curr !== '') return prefixesAndPalindromes(curr)
  return ''
}


// Find how many contiguous subarrays of a of length m contain a pair of integers that sum to k
// For a = [2, 4, 7, 5, 3, 5, 8, 5, 1, 7], m = 4, and k = 10, the output should be solution(a, m, k) = 5
// For a = [15, 8, 8, 2, 6, 4, 1, 7], m = 2, and k = 8, the output should be solution(a, m, k) = 2
// O(m * n) time and O(n) space
// I was only able to get this to pass 17/20 test cases due to time limit exceeded

function contigSubarraysTwoSum(a, m, k) {
  // initialize vars
  let result = 0

  // iterate through input array with m size window
  for (let left = 0; left < a.length - m + 1; left++) {
    // grab our right window pointer
    const right = left + m - 1

    // if curr window has two sum = k, increment result var
    const currWindow = a.slice(left, right + 1)
    if (twoSum(currWindow)) result++
  }
  // return result var
  return result

  // helper function implementation - optimize for time complexity
  function twoSum(arr) {
    const map = new Map()

    for (const num of arr) {
      const compliment = k - num
      if (map.has(compliment)) return true
      map.set(num, true)
    }

    return false
  }
}

/* ------------------ 11.15.23 ------------------ */


/* #1
SUPER WEIRD PROBLEM, DON'T LIKE IT - this solution passed 18/20 test cases
Swap digits to make strictly increasing array of nums
input = [1, 3, 900, 10], output = true.
By choosing numbers[2] = 900 and swapping its first and third digits, the resulting number 009 is considered to be just 9. So the updated array will look like [1, 3, 9, 10], which is strictly increasing.
*/

const swapAndStrictlyIncreasing = (numbers, singleFlipAllowed = true) => {
  // helper func
  function flip(i) {
    return parseInt(i.toString().split('').reverse().join(''));
  }

  let n
  for (n = 0; n < numbers.length - 1; n++) {
    if (numbers[n] >= numbers[n + 1]) {
        break;
    }
  }

  if (n === numbers.length - 1) return true;

  return singleFlipAllowed && (
    (
        (n === 0 || numbers[n - 1] < flip(numbers[n]))
        && (n === numbers.length - 1 || flip(numbers[n]) < numbers[n + 1])
        && swapAndStrictlyIncreasing(numbers.slice(n + 1), false)
    )
    || (
        (numbers[n] < flip(numbers[n + 1]))
        && (n + 1 === numbers.length - 1 || flip(numbers[n + 1]) < numbers[n + 2])
        && swapAndStrictlyIncreasing(numbers.slice(n + 2), false)
    )
  )
}

/* #2
Count number of digit anagram pairs
a = [25, 35, 872, 228, 53, 278, 872], output = 4.
There are 4 pairs of digit anagrams:
a[1] = 35 and a[4] = 53 (i = 1 and j = 4),
a[2] = 872 and a[5] = 278 (i = 2 and j = 5),
a[2] = 872 and a[6] = 872 (i = 2 and j = 6),
a[5] = 278 and a[6] = 872 (i = 5 and j = 6).
*/

const countDigitAnagrams = (a) => {
  let result = 0
  const map = {}

  for (let num of a) {
    const currDigits = []

    // grab digits of curr num
    while (num > 0) {
      currDigits.push(num % 10) // push remainder to digits arr (will be right most digit)
      num = Math.floor(num / 10) // update num
    }

    currDigits.sort((a, b) => a - b)
    const digitsStr = JSON.stringify(currDigits) // convert sorted arr to a string (property key)

    if (map.hasOwnProperty(digitsStr)) {
      result += map[digitsStr]
      map[digitsStr]++
    }
    else map[digitsStr] = 1
  }

  return result
}

/* ------------------ 11.17.23 ------------------ */

/* #1
 Given two strings s and t, both consisting of lowercase English letters and digits, your task is to calculate how many ways exactly one digit could be removed from one of the strings so that s is lexicographically smaller than t after the removal. Note that we are removing only a single instance of a single digit, rather than all instances (eg: removing 1 from the string a11b1c could result in a1b1c or a11bc, but not abc).
 Also note that digits are considered lexicographically smaller than letters.
 Input: s = "ab12c", t = "1zz456"
 Output: 1
 The only valid case where s < t after removing a digit is "ab12c" < "zz456". Therefore, the answer is 1.
 O(n + m) time which is just O(n) and O(1) space
 */

 const removeOneDigit = (s, t) => {
  let result = 0

  // iterate over first string
  for (let i = 0; i < s.length; i++) {
    if (s[i].match(/\d/)) { // is current char a digit
      const temp = s.slice(0, i) + s.slice(i + 1) // grab the updated string (after removing curr digit)
      if (temp < t) result++ // valid s < t condition, increment count
    }
  }

  // iterate over second string
  for (let i = 0; i < t.length; i++) {
    if (t[i].match(/\d/)) {
      const temp = t.slice(0, i) + t.slice(i + 1)
      if (s < temp) result++
    }
  }

  return result
 }

/* #2
Intuitive solution - we don't actually need to accurately update the hashMap, we only care about the get method return values
So, we can keep cumulative vars for what we've added to keys and values and then use those in our get method

Example:
For queryType = ["insert", "insert", "addToValue", "addToKey", "get"] and query = [[1, 2], [2, 3], [2], [1], [3]], the output should be solution(queryType, query) = 5.
The hashmap looks like this after each query:
1 query: {1: 2}
2 query: {1: 2, 2: 3}
3 query: {1: 4, 2: 5}
4 query: {2: 4, 3: 5}
5 query: answer is 5

O(n) time and space
*/

const createHashMap = (queryType, query) => {
  let result = 0,
      hashMap = {},
      ck = 0, // cumulative key diff
      cv = 0 // cumulative value diff

  for (let i = 0; i < queryType.length; i++) {
    const cmd = queryType[i];
    const quer = query[i];

    if (cmd === 'insert') {
      const key = quer[0];
      const val = quer[1];
      hashMap[key - ck] = val - cv;
    } else if (cmd === 'addToValue') {
      const k = quer[0];
      cv += k;
    } else if (cmd === 'addToKey') {
      const k = quer[0];
      ck += k;
    } else { // GET method
      let k = quer[0];
      k -= ck;
      const val = hashMap[k] + cv;
      result += val;
    }
  }

  return result;
}

/* ------------------ 11.20.23 ------------------ */

/* #1
Given an array of integers a, your task is to calculate the digits that occur the most number of times in the array. Return the array of these digits in ascending order.
For a = [25, 2, 3, 57, 38, 41], the output should be solution(a) = [2, 3, 5].
Input: [4, 5, 4, 2, 2, 25], Output: [2]
O(n) time and O(n) space
*/

const mostFrequentDigits = (a) => {
  // initialize vars
  const result = [],
        map = {} // frequency map

  let currMax = 0 // keep track of curr highest frequency

  // iterate over the input arr
  for (let num of a) {
    // grab digits of curr num
    while (num > 0) {
      const dig = num % 10 // grab digit (ones place)
      map[dig] = (map[dig] || 0) + 1 // update freq map
      currMax = Math.max(currMax, map[dig]) // update currMax if necessary
      num = Math.floor(num / 10) // update num (remove ones place)
    }
  }

  // logic to find most freq digit(s) - stored as currMax
  for (const key in map) {
    if (map[key] === currMax) result.push(+key) // + makes it a num, keys are strings
  }

  // return result
  return result
}

/* #2
You are given an array of integers a and an integer k. Your task is to calculate the number of ways to pick two different indices i < j, such that a[i] + a[j] is divisible by k.
For a = [1, 2, 3, 4, 5] and k = 3, the output should be solution(a, k) = 4.

There are 4 pairs of numbers that sum to a multiple of k = 3:

a[0] + a[1] = 1 + 2 = 3
a[0] + a[4] = 1 + 5 = 6
a[1] + a[3] = 2 + 4 = 6
a[3] + a[4] = 4 + 5 = 9

O(n^2) time and O(1) space
Only passes 8/11 test cases, time limit exceeded
 */

const twoSumDivisibleByK = (a, k) => {
  let result = 0

  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if ((a[i] + a[j]) % k === 0) result++
    }
  }

  return result
}

/* ------------------ 11.23.23 ------------------ */

/* #1
You are given two strings - pattern and source. The first string pattern contains only the symbols 0 and 1, and the second string source contains only lowercase English letters.
Let's say that pattern matches a substring source[l..r] of source if the following three conditions are met:
  they have equal length,
  for each 0 in pattern the corresponding letter in the substring is a vowel,
  for each 1 in pattern the corresponding letter is a consonant.
Your task is to calculate the number of substrings of source that match pattern.
Note: In this task we define the vowels as 'a', 'e', 'i', 'o', 'u', and 'y'. All other letters are consonants.

Input: pattern = '010', source = 'amazing'
Output: 2

O(n * m) time and O(1) space, n = source.length, m = pattern.length
*/

const stringsThatMatchVowelPattern = (pattern, source) => {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'] // could optimize by making this a map / object instead of array
  let result = 0

  for (let i = 0; i < source.length - pattern.length + 1; i++) { // iterate over source input str (since checking pattern length substrings, we don't interate all the way to source.length)
    const isValid = 1
    // window of pattern length size
    for (let j = 0; j < pattern.length; j++) {
      // vowel break case
      if (pattern[j] === '0' && !vowels.includes(source[i + j])) { // source[i + j] since we need to check curr subset
        isValid = 0
        break
      // consonant break case
      } else if (pattern[j] === '1' && vowels.includes(source[i + j])) {
        isValid = 0
        break
      }
    }

    result += isValid
  }

  return result
}

/* #2
Given an array of positive integers a, your task is to calculate the sum of every possible a[i] ∘ a[j], where a[i] ∘ a[j] is the concatenation of the string representations of a[i] and a[j] respectively.

Input: a = [10, 2]
Output: 1344

a[0] ∘ a[0] = 10 ∘ 10 = 1010,
a[0] ∘ a[1] = 10 ∘ 2 = 102,
a[1] ∘ a[0] = 2 ∘ 10 = 210,
a[1] ∘ a[1] = 2 ∘ 2 = 22.


*/
const sumOfConcatenations = (a) => { // this brute force solution passes 14/16 test cases for 417/500 score
  let result = 0

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length; j++) {
      result += +('' + a[i] + a[j])
    }
  }

  return result
}

// optimized solution, linear O(n) time, passes 16/16 test cases
const sumOfConcatenations2 = (a) => {
  const lowSum = a.reduce((acc, num) => acc + num, 0) // sum of all input arr elements
  let result = 0

  result += lowSum * a.length

  for (let j = 0; j < a.length; j++) {
      let size = a[j].toString().length
      let offset = Math.pow(10, size)
      result += lowSum * offset
  }

  return result
}