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
  const isPalindrome = (prefix) => {
    let left = 0,
        right = prefix.length - 1

    while (left < right) {
      if (prefix[left] !== prefix[right]) return false
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


// Find how many contiguous subarrays of a of length m contian a pair of integers that sum to k
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
    
    // check if curr window has two sum = k (use helper func)
    const currWindow = a.slice(left, right + 1)
  
    // if so, increment result var
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
