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
