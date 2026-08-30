// 70. Climbing Stairs
/**
   * @param {number} n
   * @return {number}
   * Input: n = 3
   * Output: 3
   * The n - 1 pattern = starting from our base cases, we need n - 1 iterations to 'climb' from step 1 to step n"
   * This is a space-optimized version of the classic DP solution - instead of storing all values in an array, we only keep track of the last two values since that's all we need for each computation
   * The loop counter i isn't representing the step number directly - it's just counting how many advancement operations we need to perform
*/
const climbStairs = (n) => {
  // O(n) time and O(1) space
  let a = 1, b = 1;
  for (let i = 0; i < n - 1; i++) {
    const temp = a;
    a = a + b;
    b = temp;
  }
  return a;
};

// 198. House Robber
/**
   * @param {number[]} nums
   * @return {number}
   * Input: nums = [1,2,3,1]
   * Output: 4
   * Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
   * Total amount you can rob = 1 + 3 = 4.
*/
const rob1 = (nums) => {
  // O(n) time and O(1) space
  let rob1 = 0, rob2 = 0;
  for (const n of nums) {
    const temp = Math.max(rob1 + n, rob2);
    rob1 = rob2;
    rob2 = temp;
  }
  return rob2;
};

// different way of writing this so we always return "a" (current), consistent with climbing stairs solution
const rob = (nums) => {
  // could also name these vars "curr" and "prev"
  let a = 0, b = 0; // a is current of the two maxes we're tracking, b is previous
  for (const n of nums) {
    const temp = Math.max(b + n, a);
    b = a;
    a = temp;
  }
  return a;
}

// 213. House Robber II
/**
   * @param {number[]} nums
   * @return {number}
   * Input: nums = [2,3,2]
   * Output: 3
   * Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.
   * Input: nums = [1,2,3,1]
   * Output: 4
*/
const rob2 = (nums) => {
  // O(n) time and O(1) space
  if (nums.length === 1) return nums[0];
  // use robI as helper function on two subarrays (1) and (0, -1) - first is all but the first num and second is all but last num
  return Math.max(rob1(nums.slice(1)), rob1(nums.slice(0, -1)));
};

// 5. Longest Palindromic Substring
/**
   * @param {string} s
   * @return {string}
   * Input: s = "babad"
   * Output: "bab" or "aba"
   * Input: s = "cbbd"
   * Output: "bb"
*/
const longestPalindromeSS = (s) => {
  // O(n^2) time and O(1) extra space but O(n) space for output str
  // start pointers at middle char and work outwards approach
  let resInd = 0, resLen = 0;

  for (let i = 0; i < s.length; i++) {
    // odd length check
    let l = i, r = i;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > resLen) {
        resInd = l;
        resLen = r - l + 1;
      }
      l--;
      r++;
    }

    // even length check
    l = i, r = i + 1;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > resLen) {
        resInd = l;
        resLen = r - l + 1;
      }
      l--;
      r++;
    }
  }
  return s.slice(resInd, resInd + resLen);
};

// 647. Palindromic Substrings
/**
   * @param {string} s
   * @return {number}
   * Input: s = "aaa"
   * Output: 6
   * Note that different substrings are counted as different palindromes even if the string contents are the same.
*/
const countSubstrings = (s) => {
  // O(n^2) time and O(1) space
  let res = 0;

  for (let i = 0; i < s.length; i++) {
    /*
      another option is to use a helper func for repeated logic
      res += countPalindromes(s, i, i);
      res += countPalindromes(s, i, i + 1);
    */

    // odd check
    let l = i, r = i;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      res++;
      l--;
      r++;
    }

    // even check
    l = i;
    r = i + 1;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      res++;
      l--;
      r++;
    }
  }

  return res;
};

const countPalindromes = (str, left, right) => {
  let res = 0;
  while (left >= 0 && right < str.length && str[left] === str[right]) {
    res++;
    left--;
    right++;
  }
  return res;
};

// 91. Decode Ways
/**
   * @param {string} s
   * @return {number}
*/
const numDecodings = (s) => {
  // O(n) time and O(n) space
  const map = {};
  map[s.length] = 1;

  const dfs = (i) => {
    if (i in map) return map[i];
    if (s[i] === '0') return 0;

    let res = dfs(i + 1);
    if (i + 1 < s.length &&
      (s[i] === '1' ||
        s[i] === '2' && s[i + 1] < '7'
      )
    ) {
      res += dfs(i + 2);
    }

    map[i] = res;
    return res;
  };

  return dfs(0);
};

// 322. Coin Change
/**
   * @param {number[]} coins
   * @param {number} amount
   * @return {number}
   * Input: coins = [1,2,5], amount = 11
   * Output: 3
   * Explanation: 11 = 5 + 5 + 1
*/
const coinChange = (coins, amount) => {
  // O(n * t) time where n = length of arr coins and t = amount
  // O(t) time
  const dp = new Array(amount + 1).fill(Infinity); // + 1 bc we account for dp[0]
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) { // a = amount, <= is key
    for (const c of coins) {
      if (a - c >= 0) { // same logic as: if (c <= a)
        dp[a] = Math.min(dp[a], 1 + dp[a - c]);
      }
    }
  }
  return dp[amount] !== Infinity ? dp[amount] : -1;
};

// 152. Maximum Product Subarray
/**
   * @param {number[]} nums
   * @return {number}
   * Input: nums = [2,3,-2,4]
   * Output: 6
*/
const maxProduct = (nums) => {
  let res = Math.max(...nums),
      currMax = 1,
      currMin = 1;

  for (const n of nums) {
    // O(n) time and O(1) space
    const temp = n * currMax;
    currMax = Math.max(temp, n * currMin, n);
    currMin = Math.min(temp, n * currMin, n); // need the temp var bc we reassign currMax on line above
    res = Math.max(res, currMax);
  }

  return res;
};

// 139. Word Break
/**
   * @param {string} s
   * @param {string[]} wordDict
   * @return {boolean}
   * Input: s = "leetcode", wordDict = ["leet","code"]
   * Output: true
   * Input: s = "applepenapple", wordDict = ["apple","pen"]
   * Output: true
   * Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
   * Output: false
*/
const wordBreak = (s, wordDict) => {
  // O(n * m * t) time and O(n) space
  // n = length of s, m = length of wordDict, t = max length of any word in wordDict
  const dp = new Array(s.length + 1).fill(false);
  dp[s.length] = true;
  for (let i = s.length - 1; i >= 0; i--) {
    for (const w of wordDict) {
      if (
        i + w.length <= s.length &&
        s.slice(i, i + w.length) === w
      ) {
        dp[i] = dp[i + w.length];
      }
      if (dp[i]) break;
    }
  }
  return dp[0];
};

// 300. Longest Increasing Subsequence
/**
   * @param {number[]} nums
   * @return {number}
   * A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements without changing the relative order of the remaining characters.
   * Input: nums = [10,9,2,5,3,7,101,18]
   * Output: 4
   * Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
*/
const lengthOfLIS = (nums) => {
  // O(n^2) time and O(n) space
  // bottom up DP, increment in reverse and for each num, iterate forward and check for max sub sequence
  const dp = new Array(nums.length).fill(1);
  for (let i = nums.length - 1; i >= 0; i--) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] < nums[j]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
  }
  return Math.max(...dp);
};
