// max sum subarray of size K

// I: [2, 1, 5, 1, 3, 2], k=3
// O: 9 (subarray with max sum is [5, 1, 3])
// C: O(n) time and O(1) space

function maxSubarrayOfLengthK(k, arr) {
  let maxSum = 0,
      windowSum = 0,
      windowStart = 0;

  for (windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add the next element

    // if we've hit the window size, slide the window and subtract the element going out
    if (windowEnd >= k - 1) {
      maxSum = Math.max(maxSum, windowSum); // reassign max sum if needed
      windowSum -= arr[windowStart]; // subtract element going out
      windowStart += 1; // slide the window up one
    }
  }

  return maxSum;
}

// console.log(maxSubarrayOfLengthK(3, [2, 1, 5, 1, 3, 2])); // -> 9
// console.log(maxSubarrayOfLengthK(2, [2, 3, 4, 1, 5])); // -> 7

/* - - - - - - - - - - - - - - - - - - - - */

// smallest subarray with a greater sum (sliding window size is not fixed)

// I: [2, 1, 5, 2, 3, 2], s=7
// O: 2 (smallest subarray with a sum >= 7 is [5, 2] so length is 2)
// C: O(n) time and O(1) space

function smallestSubarraySum(s, arr) {
  let windowSum = 0,
      minLength = Infinity,
      windowStart = 0;

  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add next element

    // shrink the window until the window sum is smaller than s
    while (windowSum >= s) {
      const windowLength = windowEnd - windowStart + 1; // create var for curr window length
      minLength = Math.min(minLength, windowLength); // reassign minLength if needed
      windowSum -= arr[windowStart]; // subtract element going out
      windowStart += 1; // slide window up one
    }
  }

  if (minLength === Infinity) {
    return 0; // no subarray with a greater sum than s
  }

  return minLength; // subarray found, return length
}

// console.log(smallestSubarraySum(7, [2, 1, 5, 2, 3, 2])); // -> 2

/* - - - - - - - - - - - - - - - - - - - - */

// longest substring with K distinct characters (length of longest substring with no more than k distinct characters)

// I: string="araaci", k=2 | string="araaci", k=1
// O: 4 ("araa") | 2 ("aa")
// C: O(n) time (n + n) and O(k) space (storing max of k + 1 chars in hash map)

function longestSubstringWithkDistinctChars(str, k) {
  let windowStart = 0,
      maxLength = 0,
      charFrequency = {}; // hash map

  // iterate, trying to extend the range
  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd]; // create var for curr char
    // if char is not in hash map yet, add it
    if (!(rightChar in charFrequency)) {
      charFrequency[rightChar] = 0; // add new char to map
    }
    charFrequency[rightChar] += 1; // increment char count by one

    // shrink the sliding window until we are left with k distinct chars in hash map
    while (Object.keys(charFrequency).length > k) {
      const leftChar = str[windowStart]; // create var for left most char in window
      charFrequency[leftChar] -= 1; // decrement count in hash map
      if (charFrequency[leftChar] === 0) { // remove char from hash map if count is zero
        delete charFrequency[leftChar];
      }
      windowStart += 1; // shrink the window
    }

    // remember max length so far
    const currLength = windowEnd - windowStart + 1;
    maxLength = Math.max(maxLength, currLength);
  }

  return maxLength;
}

// console.log(longestSubstringWithkDistinctChars('araaci', 2)); // -> 4

/* - - - - - - - - - - - - - - - - - - - - */

// fruits into basket (same as previous problem but we are given the distinct number of fruits - 2)

// I: ['A', 'B', 'C', 'A', 'C']
// O: 3 (we can put 2 'C' fruits in one basket and one 'A' in the other from subarray ['C', 'A', 'C'])
// C: O(n) time and O(1) space

function fruitsIntoBaskets(fruits) {
  let windowStart = 0,
      maxLength = 0,
      fruitFrequency = {};

  // extend the range
  for (let windowEnd = 0; windowEnd < fruits.length; windowEnd++) {
    const rightFruit = fruits[windowEnd];
    if (!(rightFruit in fruitFrequency)) {
      fruitFrequency[rightFruit] = 0;
    }
    fruitFrequency[rightFruit] += 1;

    // shrink the window until 2 distinct fruits are left
    while (Object.keys(fruitFrequency).length > 2) {
      const leftFruit = fruits[windowStart];
      fruitFrequency[leftFruit] -= 1;
      if (fruitFrequency[leftFruit] === 0) {
        delete fruitFrequency[leftFruit];
      }
      windowStart += 1;
    }
    // reassign length if needed
    const currLength = windowEnd - windowStart + 1;
    maxLength = Math.max(maxLength, currLength);
  }

  return maxLength;
}

// console.log(fruitsIntoBaskets(['A', 'B', 'C', 'A', 'C'])); // -> 3

/* - - - - - - - - - - - - - - - - - - - - */

// longest substring with all distinct characters

// I: "aabccbb"
// O: 3 (longest substring with all distinct chars is "abc")
// C: O(n) time and O(k) space = O(1) space (k <= n worst case, can assume there is a fixed number of possible characters - 26 english letters)

function nonRepeatingSubstring(str) {
  let windowStart = 0,
      maxLength = 0,
      charIndexMap = {}; // store indexes of chars

  // try to extend the range
  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd];
    // if map already contains rightChar, reassign windowStart
    if (rightChar in charIndexMap) {
      windowStart = Math.max(windowStart, charIndexMap[rightChar] + 1);
    }
    // insert the rightChar's index into the map
    charIndexMap[rightChar] = windowEnd;
    // remember max length so far
    const currLength = windowEnd - windowStart + 1;
    maxLength = Math.max(maxLength, currLength);
  }

  return maxLength;
}

// console.log(nonRepeatingSubstring('aabccbb')); // -> 3

/* - - - - - - - - - - - - - - - - - - - - */

// longest substring with same letters after replacement

// I: "aabccbb" k=2 (how many letters can be replaced)
// O: 5 (replace the two 'c's with 'b' to have substring of length 5 'bbbbb')
// C: O(n) time and O(1) space (26 possible letters, O(26) is just O(1))

function longestSubstringReplacement(str, k) {
  let windowStart = 0,
      maxLength = 0,
      maxRepeatLetterCount = 0,
      frequencyMap = {};

  // try to extend the range [windowStart, windowEnd]
  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd];
    if (!(rightChar in frequencyMap)) {
      frequencyMap[rightChar] = 0;
    }
    frequencyMap[rightChar] += 1;

    maxRepeatLetterCount = Math.max(maxRepeatLetterCount, frequencyMap[rightChar]);

    // if range includes more than k letters besides the max repeating letter, shrink window
    if ((windowEnd - windowStart + 1 - maxRepeatLetterCount) > k) {
      leftChar = str[windowStart];
      frequencyMap[leftChar] -= 1;
      windowStart += 1;
    }

    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }

  return maxLength;
}

// console.log(longestSubstringReplacement('aabccbb', 2)); // -> 5

/* - - - - - - - - - - - - - - - - - - - - */

// longest subarray with ones after replacement

// I: [0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1] k=2
// O: 6 (replace last two 0's in array with 1's and get subarray of length 6)
// C: O(n) time and O(1) space

function longestOnesSubarray(arr, k) {
  let windowStart = 0,
      maxLength = 0,
      maxOnesCount = 0;

  // try to extend the range
  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    if (arr[windowEnd] === 1) { // if curr el is a 1, increment maxOnesCount
      maxOnesCount += 1;
    }

    // if we have too many 0's in curr window, shrink the window
    if ((windowEnd - windowStart + 1 - maxOnesCount) > k) {
      if (arr[windowStart] === 1) {
        maxOnesCount -= 1;
      }
      windowStart += 1;
    }

    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }

  return maxLength;
}

// console.log(longestOnesSubarray([0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1], 2)); // -> 6

