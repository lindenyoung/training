// Contains Duplicate
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
const groupAnagrams = (strs) => {
  const anagrams = {};

  for (let str of strs) {
    const sorted = str.split('').sort().join('');
    if (!anagrams[sorted]) anagrams[sorted] = [];
    anagrams[sorted].push(str);
  }

  return Object.values(anagrams);
}


// Top K Frequent Elements


