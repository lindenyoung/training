// 121. Best Time to Buy and Sell Stock
/**
  * @param {number[]} prices
  * @return {number}
  * Input: prices = [10,1,5,6,7,1]
  * Output: 6
*/
const maxProfit = (prices) => {
  // O(n) time and O(1) space
  if (!prices || prices.length < 2) return 0;
  let profit = 0, l = 0, r = 1;
  while (r < prices.length) {
    if (prices[l] < prices[r]) {
      const curr = prices[r] - prices[l];
      profit = Math.max(profit, curr);
    } else {
      l = r;
    }
    r++;
  }
  return profit;
};

const maxProfitDP = (prices) => {
  // O(n) time and O(1) space
  let maxP = 0, minBuy = prices[0];
  for (const sellPrice of prices) {
    maxP = Math.max(maxP, sellPrice - minBuy);
    minBuy = Math.min(minBuy, sellPrice);
  }
  return maxP;
};

// 3. Longest Substring Without Repeating Characters
/**
  * @param {string} s
  * @return {number}
  * Input: s = "zxyzxyz"
  * Output: 3
  * Input: s = "xxxx"
  * Output: 1
*/
const lengthOfLongestSubstring = (s) => {
  // O(n) time and O(m) space where n is length of string and m is total number of unique characters
  let l = 0, res = 0;
  const substringSet = new Set(); // using a set for O(1) lookups
  for (let r = 0; r < s.length; r++) {
    while (substringSet.has(s[r])) {
      substringSet.delete(s[l]);
      l++;
    }
    substringSet.add(s[r]);
    res = Math.max(res, r - l + 1);
  }
  return res;
};

// 424. Longest Repeating Character Replacement
/**
  * @param {string} s
  * @param {number} k
  * @return {number}
  * Input: s = "AAABABB", k = 1
  * Output: 5
  * Input: s = "XYYX", k = 2
  * Output: 4
*/
const characterReplacement = (s, k) => {
  // O(n) time and O(m) space
  let res = 0, l = 0, maxFreq = 0;
  const map = {}; // substring char freq
  for (let r = 0; r < s.length; r++) {
    map[s[r]] = (map[s[r]] || 0) + 1;
    // trick here - only need to update maxFreq if new value is larger, can ignore if smaller since math equation for > k will still evaluate to true
    maxFreq = Math.max(maxFreq, map[s[r]]);
    while ((r - l + 1 - maxFreq) > k) {
      map[s[l]] -= 1;
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
};

// 76. Minimum Window Substring (Qualtrics tagged question)
/**
  * @param {string} s
  * @param {string} t
  * @return {string}
  * return the shortest substring of s such that every character in t, including duplicates, is present in the substring
  * Input: s = "OUZODYXAZV", t = "XYZ"
  * Output: "YXAZ"
  * Input: s = "x", t = "xy"
  * Output: ""
*/
const minWindow = (s, t) => {
  // O(n) time and O(m) space
  if (t.length === 0 || s.length < t.length) return "";
  const tMap = {},
        windowMap = {};
  for (const c of t) {
    tMap[c] = (tMap[c] || 0) + 1;
  }
  let haveCount = 0,
      needCount = Object.keys(tMap).length,
      l = 0,
      resInd = [-1, -1],
      resLength = Infinity;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    windowMap[c] = (windowMap[c] || 0) + 1;

    if (c in tMap && windowMap[c] === tMap[c]) {
      haveCount++;
    }
    while (haveCount === needCount) {
      // update result
      if (r - l + 1 < resLength) {
        resInd = [l, r];
        resLength = r - l + 1;
      }
      // shrink window from left
      windowMap[s[l]]--;
      if (s[l] in tMap && windowMap[s[l]] < tMap[s[l]]) {
        haveCount--;
      }
      l++;
    }
  }
  return resLength !== Infinity
    ? s.slice(resInd[0], resInd[1] + 1)
    : "";
};
