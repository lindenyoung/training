/*
Q1: Return the first letter from the current index and the last letter from the next index. If you are at the end of the array, then return the last letter of the first index.

Input: [‘capital’, ‘one’, ‘coding’, ‘assessment’]
Output: [‘ce’, ‘og’, ‘ct’, ‘al’]
*/

const letterCombo = (words) => {
  // edge cases
  if (!words) return []

  // initialize vars
  const result = []

  // iterate
  for (let i = 0; i < words.length; i++) {
    const currWord = words[i]
    const nextWord = words[i + 1]

    if (i === words.length - 1) result.push(currWord[0] + words[0][words[0].length - 1])
    else result.push(currWord[0] + nextWord[nextWord.length - 1])
  }

  // return
  return result
}

// console.log(letterCombo(['capital', 'one', 'coding', 'assessment']))

/*
Q4: Sliding window question where you are given an array of numbers and an integer (k). Return the indices of the longest continuation where the difference between the current index and the next index is equal to or less than k.

Input: nums = [0, 3, -1, 5, 7, 4, 1, -5], k = 5
Output: [3, 6] ([5, 7, 4, 1] is longest valid contiguous subarray)

Input: nums = [1, 3, 0, -1, 1, 2, 4, 5, 2, 4, 6], k = 2
Output: [2, 7]
*/

const longestDiffContinuation = (nums, k) => {
  // edge cases
  if (!nums || !nums.length) return []

  // initialize vars
  let result = [],
      maxLength = 0, // window length
      left = 0 // left pointer

  // iterate (extend window)
  for (let right = 1; right < nums.length; right++) {
    // if diff is <= k, continue to next num
    if (Math.abs(nums[right] - nums[right - 1]) <= k) continue

    // diff is > k, so we need to check if currLength is > maxLength and update result indices if so
    if (right - left > maxLength) {
      result = [left, right - 1]
      // also need to update our window
      left = right
    }
  }

  // return
  return result
}

// console.log(longestDiffContinuation([0, 3, -1, 5, 7, 4, 1, -5], 5))
// console.log(longestDiffContinuation([1, 3, 0, -1, 1, 2, 4, 5, 2, 4, 6], 2))

/* Q4 from joshG
// Given an input of 2 arrays (a and b) and a query array consisting of either [0, x] or [1, k, j], your task is to return the number of instances where each elements from array a and b sum up to x.
// For example, a = [1, 3] b = [2, 5, 6] query = [ [1, 2, 5] , [0, 12] ];

// For the first query [1, k, j], we access the index of b array with k and add j to the element.
// So b = [2, 5, 6]   ->   b = [ 2, 5, 11], accessing the 2nd index of b and adding 5 to that element.
// Current updated array, a = [1, 3] b = [2, 5, 11]
// For the second query [0, 12], find the elements from a and b array that add up to x.
// So the elements that add up to 12 are, a[0] + b[2] === 12
// Output: 1 (number of two sum instances)
*/

const queryTwoSum = (a, b, queries) => {
  // initialize vars
  let result = 0

  // iterate / logic
  for (const query of queries) {
    // manipulate b if query index is 1
    if (query[0] === 1) {
      b[query[1]] += query[2]
    } else {
      const target = query[1], // x
            set = new Set(b)

      for (const num of a) {
        const match = target - num
        if (set.has(match)) result++
      }
    }
  }

  return result
}

console.log(queryTwoSum([1, 3], [2, 5, 6], [[1, 2, 5], [0, 12]]))

// Q2 from jamz
// given 2 strings, return the resultant string from adding each element at the 'i'th digit, with the 0th digit being the one in the one's position. i.e. given '99' '99' return '1818'. given '11' and '9' return '110'