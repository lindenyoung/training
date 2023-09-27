
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
 */
const reverseWords = (message) => {
  // first reverse all chars in the message - this gets the correct word order but with each word backwards
  reverseChars(message, 0, message.length - 1)

  // then reverse each word separately
  let currWordStart = 0
  
  for (let i = 0; i <= message.length; i++) {
    if (message[i] === ' ' || i === message.length) {
      reverseChars(message, currWordStart, i - 1)
      currWordStart = i + 1
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

  // handle case where one array finishes before the other
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
