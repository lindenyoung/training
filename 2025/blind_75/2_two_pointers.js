// 125. Valid Palindrome
/**
   * @param {string} s
   * @return {boolean}
   * Input: s = "Was it a car or a cat I saw?"
   * Output: true
   * should be case-insensitive and ignore all non-alphanumeric characters
*/
const isPalindrome = (s) => {
  // O(n) time and O(1) space
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !isAlphaNumeric(s[left])) {
      left++;
    }
    while (right > left && !isAlphaNumeric(s[right])) {
      right--;
    }
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};

// helper for palindrome function
const isAlphaNumeric = (char) => {
  return (
    char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    char >= '0' && char <= '9'
  )
};

// 15. 3Sum
/**
   * @param {number[]} nums
   * @return {number[][]}
   * Input: nums = [-1,0,1,2,-1,-4]
   * Output: [[-1,-1,2],[-1,0,1]]
   * ignore duplicates
*/
const threeSum = (nums) => {
  // O(n^2) time and O(1) or O(n) space depending on sort algorithm
  if (!nums.length) return [];
  nums.sort((a, b) => a - b);
  const res = [];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) break; // can't sum to 0 if starting # > 0
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicate starting nums

    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum > 0) r--;
      else if (sum < 0) l++;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        l++;
        while (l < r && nums[l] === nums[l - 1]) {
          l++;
        }
      }
    }
  }
  return res;
};

// 11. Container With Most Water
/**
   * @param {number[]} heights
   * @return {number}
   * Input: height = [1,7,2,5,4,7,3,6]
   * Output: 36
*/
const maxArea = (heights) => {
  // O(n) time and O(1) space
  let l = 0,
      r = heights.length - 1,
      max = 0;
  while (l < r) {
    const area = (r - l) * Math.min(heights[l], heights[r]);
    max = Math.max(area, max);
    if (heights[l] <= heights[r]) l++;
    else r--;
  }
  return max;
};
