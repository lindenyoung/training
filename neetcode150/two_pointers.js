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
