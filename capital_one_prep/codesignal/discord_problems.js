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