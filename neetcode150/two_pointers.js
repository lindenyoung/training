// Valid Palindrome

const isPalindrome = (string) => {
  if (!s.length) return true;
  
  s = string.toLowerCase().replace(/[^0-9A-Z]+/gi,"");

  let [left, right] = [0, s.length - 1];

  while (left < right) {
    if (s[left] !== s[right]) return false;

    left++;
    right--;
  }

  return true;
}

// Two Sum II - Sorted Input Array

const twoSumSorted = (nums, target) => {
  let [left, right] = [0, nums.length - 1];

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [-1, -1];
}

// Container With Most Water (maxArea) - height: number[]
// O(n) | O(1)
const maxArea = (height) => {
  let [left, right, max] = [0, height.length - 1, 0];

  while (left < right) {
    const [leftHeight, rightHeight] = [height[left], height[right]];
    const smallerHeight = Math.min(leftHeight, rightHeight);
    const width = right - left;
    const storedWater = width * smallerHeight;

    max = Math.max(max, storedWater);

    leftHeight <= rightHeight ? left++ : right--
  }

  return max;
}

// Three Sum
// O(n^2) | O(1)
const threeSum = (nums) => {
  if (nums.length < 3) return []; // edge case of input array being too small

  const result = [];
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    const curr = nums[i];
    const prev = nums[i - 1];
    if (curr > 0) break; // impossible to sum to zero if first num is positive

    if (i > 0 && curr === prev) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = curr + nums[left] + nums[right];

      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else { // sum === 0
        result.push([curr, nums[left], nums[right]]); // found a threeSum match
        left++;
        right--;
        while (nums[left] === nums[left - 1] && left < right) left++; // skip left duplicates
        while (nums[right] === nums[right + 1] && left < right) right--; // skip right duplicates
      }
    }
  }

  return result;
}
