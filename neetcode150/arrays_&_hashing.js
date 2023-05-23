// Contains Duplicate
// O(n) | O(n)
const containsDuplicate = (nums) => {
  // SET: O(n) time and O(n) space
  const numsSet = new Set(nums);
  return nums.length === numsSet.size;

  // SORT: O(n * log(n)) time and O(1) space
  // const sortedNums = nums.sort((a, b) => a - b);
  // for (let i = 0; i < sortedNums.length; i++) {
  //   if (sortedNums[i] === sortedNums[i + 1]) return true;
  // }
  // return false;
}


// Valid Anagram
// O(n) | O(n)
const isAnagram = (s, t) => {
  // sort -> strings
  // const sortedS = s.split('').sort().join('');
  // const sortedT = t.split('').sort().join('');
  // return sortedS === sortedT;

  // map approach
  if (s.length !== t.length) return false;
  const sMap = {};
  for (let char of s) {
    sMap[char] ? sMap[char]++ : sMap[char] = 1;
    // sMap[char] = (sMap[char] || 0) + 1;
  }

  for (let char of t) {
    if (!s[char] || s[char] === 0) return false;
    t[char]--;
  }

  return true;
}

// Two Sum
// O(n) | O(n)
const twoSum = (nums, target) => {
  const differencesMap = {};

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];
    const difference = target - currNum;
    if (differencesMap[currNum] !== undefined) return [differencesMap[currNum], i];
    differencesMap[difference] = i;
  }
}

// Group Anagrams, input = string[], output = string[][]
// O(n * klogk) | O(n)
const groupAnagrams = (strs) => {
  const anagrams = {};

  for (let str of strs) {
    const sorted = str.split('').sort().join('');
    if (!anagrams[sorted]) anagrams[sorted] = [];
    anagrams[sorted].push(str);
  }

  return Object.values(anagrams);
}


// Top K Frequent Elements (number[], number) => number[]
// O(nlogn) | O(n)
const topKFrequent = (nums, k) => {
  const frequencyMap = {};
  const result = [];

  // populate frequency map { num: frequency }
  for (let i = 0; i < nums.length; i++) {
    nums[i] in frequencyMap ? frequencyMap[nums[i]]++ : frequencyMap[nums[i]] = 1;
  }

  // create sorted array of nums based on frequency (highest to lowest)
  const sortedByFrequency = Object.keys(frequencyMap).map((num) => [Number(num), frequencyMap[num]]).sort((a, b) => b[1] - a[1]);

  // push first k nums from sorted array into result array
  for (let i = 0; i < k; i++) {
    result.push(sortedByFrequency[i][0]);
  }
  
  return result;

  // could the last for loop be done using slice? filter arr to just contain the nums not frequencies then slice. I think this is slower than for loop
  // return sortedByFrequency.map((prop) => prop[0]).slice(0, k);
}

// Product of Array Except Self [1, 2, 3, 4] -> [24, 12, 8, 6]
// must run in O(n) time and cannot use the division operator
// O(n) | O(n)
const productExceptSelf = (nums) => {
  const result = [];
  let prefix = 1;
  let suffix = 1;

  // backwards pass [1, 2, 3, 4] -> [24, 12, 4, 1]
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] = suffix;
    suffix *= nums[i];
  }
  
  // forwards pass [24, 12, 4, 1] -> [24, 12, 8, 6]
  for (let i = 0; i < nums.length; i++) {
    result[i] *= prefix;
    prefix *= nums[i];
  }

  return result;
}

// Valid Sudoku


// Encode and Decode Strings


// Longest Consecutive Sequence [100, 4, 200, 1, 3, 2] -> 4 ([1, 2, 3, 4])
// must run in O(n) time
// O(n) | O(n) | hash set - intelligent sequence, greedy - maxScore (default param)
const longestConsecutive = (nums, maxScore = 0) => {
  const numSet = new Set(nums); // get rid of any repetitions

  for (const num of [...numSet]) { // for each num in set
    const prevNum = num - 1;
    if (numSet.has(prevNum)) continue; // if set includes prev num, we'll check for streak later on so continue

    let [currNum, score] = [num, 1]; // setup for checking streak for currNum
    const isStreak = () => numSet.has(currNum + 1);

    while (isStreak()) { // while set has next consecutive num, increment score and currNum
      currNum++;
      score++;
    }

    maxScore = Math.max(maxScore, score); // reassign maxScore if needed
  }

  return maxScore;
}
