
/**
 * Merge meeting times
 * { startTime: 2, endTime: 3 }  // meeting from 10:00 – 10:30 am
 * { startTime: 6, endTime: 9 }  // meeting from 12:00 – 1:30 pm
 * @param {object[]} mtgs 
 * @returns {object[]}
 * O(n lg n) time and O(n) space
 */

const mergeRanges = (mtgs) => {
  const sortedMtgs = mtgs.sort((a, b) => a.startTime - b.startTime)

  const mergedMtgs = [sortedMtgs[0]]

  for (let i = 1; i < sortedMtgs.length; i++) {
    const currMtg = sortedMtgs[i]
    const lastMergedMtg = mergedMtgs[mergedMtgs.length - 1]

    // overlapping case
    if (currMtg.startTime <= lastMergedMtg.endTime) lastMergedMtg.endTime = Math.max(lastMergedMtg.endTime, currMtg.endTime)
    // non-overlapping case
    else mergedMtgs.push(currMtg)
  }

  return mergedMtgs
}

/**
 * Reverse string in place (given an array as input bc strings are immutable in js)
 * @param {string[]} chars
 * O(n) time and O(1) space
 */

const reverse = (chars) => {
  let left = 0,
      right = chars.length - 1

  while (left < right) {
    // swap
    [chars[left], chars[right]] = [chars[right], chars[left]]
    
    // move pointers
    left++
    right--
  }
}

/**
 * Reverse the order of the words in place
 * input: ['c', 'a', 'k', 'e', ' ', 'p', 'o', 'u', 'n', 'd', ' ', 's', 't', 'e', 'a', 'l'];
 * output.join(''): 'steal pound cake'
 * @param {string[]} message
 * @returns {string[]}
 * O(n) time and O(1) space
 */
const reverseWords = (message) => {
  // first reverse all chars in the message - this gets the correct word order but with each word backwards
  reverseChars(message, 0, message.length - 1)

  // then reverse each word separately
  let currWordStart = 0
  
  for (let i = 0; i <= message.length; i++) {
    // we use <= message.length and i === message.length here to know when we are on the last word, otherwise it would not get reversed
    if (message[i] === ' ' || i === message.length) {
      reverseChars(message, currWordStart, i - 1) // i - 1 to not include the ' '
      currWordStart = i + 1 // increment to start of next word
    }
  }

  function reverseChars(input, left, right) {
    while (left < right) {
      [input[left], input[right]] = [input[right], input[left]]
      left++
      right--
    }
  }
}

/**
 * Merge sorted arrays
 * @param {number[]} arr1 
 * @param {number[]} arr2 
 * @returns {number[]}
 * O(n) time and space complexity
 */
const mergeSortedArrays = (arr1, arr2) => {
  const result = []
  let i = 0, j = 0

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i])
      i++
    } else {
      result.push(arr2[j])
      j++
    }
  }

  // handle case where one array finishes before the other (only one of these while loops will be entered)
  while (i < arr1.length) {
    result.push(arr1[i])
    i++
  }

  while (j < arr2.length) {
    result.push(arr2[j])
    j++
  }

  return result

  // the above two while loops and return statement can be rewritten as this, but with slightly worse time complexity
  // return [...result, ...arr1.slice(i), ...arr2.slice(j)]
}

/**
 * Cafe order checker
 * Check whether or not restaurant's service is first-come first-served
 * @param {number[]} takeOut 
 * @param {number[]} dineIn 
 * @param {number[]} served
 * @returns {boolean}
 * O(n) time and O(1) space
 */
const cafeOrderChecker = (takeOut, dineIn, served) => {
  let takeOutIndex = 0,
      dineInIndex = 0

  for (let i = 0; i < served.length; i++) {
    if (takeOutIndex < takeOut.length && served[i] === takeOut[takeOutIndex]) takeOutIndex++
    else if (dineInIndex < dineIn.length && served[i] === dineIn[dineInIndex]) dineInIndex++
    else return false
  }

  // check for any extra orders not in served orders
  if (takeOutIndex !== takeOut.length || dineInIndex !== dineIn.length) return false

  return true
}
