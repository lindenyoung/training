// 217. Contains Duplicate
/**
  * @param {number[]} nums
  * @return {boolean}
  * Input: nums = [3, 2, 1, 3]
  * Output: true
*/
const hasDuplicate = (nums) => {
  // O(n) time and O(n) space
  const numsSet = new Set(nums);
  return numsSet.size !== nums.length;

  // O(n * log(n)) time and O(1) space
  // const sortedNums = nums.sort((a, b) => a - b);
  // for (let i = 0; i < sortedNums.length; i++) {
  //   if (sortedNums[i] === sortedNums[i + 1]) return true;
  // }
  // return false;
};

// 242. Valid Anagram
/**
   * @param {string} s
   * @param {string} t
   * @return {boolean}
   * Input: s = "racecar", t = "carrace"
   * Output: true
*/
const isAnagram = (s, t) => {
  // O(n + m) time and O(1) space
  if (s.length !== t.length) return false;

  const sMap = {};
  const tMap = {};

  for (let i = 0; i < s.length; i++) {
    sMap[s[i]] = (sMap[s[i]] || 0) + 1;
    tMap[t[i]] = (tMap[t[i]] || 0) + 1;
  }

  for (const k in sMap) {
    if (sMap[k] !== tMap[k]) return false;
  }

  return true;
};

// 1. Two Sum
/**
   * @param {number[]} nums
   * @param {number} target
   * @return {number[]}
   * Input: nums = [2,7,11,15], target = 9
   * Output: [0,1]
   * no guarantee input array is sorted
 */
const twoSum = (nums, target) => {
  // O(n) time and O(n) space
  const diffMap = {};

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];
    const diff = target - currNum;
    if (diffMap[diff] !== undefined) {
      return [i, diffMap[diff]];
    }
    diffMap[currNum] = i;
  }
  return [];
};

// 49. Group Anagrams
/**
   * @param {string[]} strs
   * @return {string[][]}
   * Input: strs = ["act","pots","tops","cat","stop","hat"]
   * Output: [["hat"],["act", "cat"],["stop", "pots", "tops"]]
*/
const groupAnagrams = (strs) => {
  // O(m * nlog(n)) time and O(m * n) space where m = # of strings and n = length of longest string
  const map = {};

  for (const s of strs) {
    const sortedS = s.split('').sort().join('');
    if (!map[sortedS]) {
      map[sortedS] = [];
    }
    map[sortedS].push(s);
  }
  return Object.values(map);
};

const groupAnagrams_hash = (strs) => {
  // O(m * n) time and O(m) space where m = # of strings and n = length of longest string
  const map = {};
  for (let s of strs) {
    const count = new Array(26).fill(0);

    for (let c of s) {
        // each str needs a freq count of chars
        count[c.charCodeAt(0) - 'a'.charCodeAt(0)] += 1;
    }
    // turn frequency count into a string so it can be used as a key
    const key = count.join(',');
    // same logic as sorting solution
    if (!map[key]) {
        map[key] = [];
    }
    map[key].push(s);
  }
  return Object.values(map);
};

// 347. Top K Frequent Elements
/**
   * @param {number[]} nums
   * @param {number} k
   * @return {number[]}
   * Input: nums = [1,1,1,2,2,3], k = 2
   * Output: [1,2]
*/
const topKFrequent = (nums, k) => {
  // O(n) time and O(n) space
  // { 1: 3, 2: 2, 3: 1 }
  const countMap = {};
  for (const n of nums) {
    countMap[n] = (countMap[n] || 0) + 1;
  }
  // this is a common way to create a bucket array for counting sort
  // the index is the frequency and the value in bucket[i] is the num [ [], [3], [2], [1], [], [], [] ]
  const freqBuckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const n in countMap) {
    freqBuckets[countMap[n]].push(parseInt(n));
  }
  const res = [];
  for (let i = freqBuckets.length - 1; i > 0; i--) {
    // this skips any empty arrays in freqBuckets, accounts for multiple nums in a bucket
    for (const n of freqBuckets[i]) {
        res.push(n);
        if (res.length === k) {
          return res;
        }
    }
  }
};

const topKFrequent_sorting = (nums, k) => {
  // O(nlog(n)) time and O(n) space
  const countMap = {};
  for (const n of nums) {
    countMap[n] = (countMap[n] || 0) + 1;
  }
  const freqArr = Object.entries(countMap).map(([n, freq]) => [parseInt(n), freq]);
  freqArr.sort((a, b) => b[1] - a[1]);
  return arr.slice(0, k).map(pair => pair[0]);
};

// 271. Encode and Decode Strings
// Input: ["we","say",":","yes"]
// Output: ["we","say",":","yes"]
/**
   * @param {string[]} strs
   * @returns {string}
*/
const encode = (strs) => {
  let result = "";
  for (const s of strs) {
    result += s.length + '#' + s;
  }
  return result;
};

/**
   * @param {string} str
   * @returns {string[]}
*/
const decode = (str) => {
  // O(m) time for each encode / decode call where m = sum of lengths of all strings
  // O(m + n) space where n = # of strings
  const result = [];
  let i = 0;
  while (i < str.length) {
    let j = i;
    while (str[j] !== '#') {
      j++;
    }
    const length = parseInt(str.substring(i, j));
    i = j + 1; // start of curr str
    j = i + length; // first char after curr str or undefined
    result.push(str.substring(i, j));
    i = j;
  }

  return result;
};

// 238. Product of Array Except Self
/**
   * @param {number[]} nums
   * @return {number[]}
   * Input: nums = [1,2,4,6]
   * Output: [48,24,12,8]
   * Must solve in O(n) time without using the division operation
*/
const productExceptSelf = (nums) => {
  // O(n) time and O(1) extra space (ignoring the O(n) result array)
  const result = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
    // another approach is to track prefix in results array, start loop at i = 1, by using previous result val as "prefix"
    // result[i] = result[i - 1] * nums[i - 1]
  }
  let postfix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= postfix;
    postfix *= nums[i];
  }
  return result;
};

// 128. Longest Consecutive Sequence
/**
   * @param {number[]} nums
   * @return {number}
   * Must run in O(n) time
   * Input: nums = [2,20,4,10,3,4,5]
   * Output: 4 (2,3,4,5)
*/
const longestConsecutive = (nums) => {
  // O(n) time and O(n) space
  if (!nums || !nums.length) return 0;
  const nSet = new Set(nums);
  let longest = 0;
  for (const n of nSet) {
    // only need to check starting nums of a sequence
    if (!nSet.has(n - 1)) {
      let currLength = 0;
      while (nSet.has(n + currLength)) {
        currLength++
      }
      longest = Math.max(longest, currLength);
    }
  }
  return longest;
};
