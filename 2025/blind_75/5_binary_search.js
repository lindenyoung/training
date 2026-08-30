// 153. Find Minimum in Rotated Sorted Array
/**
  * @param {number[]} nums
  * @return {number}
  * Solution must be O(log n) time
  * Input: nums = [3,4,5,6,1,2]
  * Output: 1
  * Input: nums = [4,5,6,7]
  * Output: 4
*/
const findMin = (nums) => {
  // O(log n) time and O(1) space
  // if (nums.length === 1) return nums[0];
  let l = 0, r = nums.length - 1, res = nums[0];
  while (l <= r) {
    // in a sorted window
    if (nums[l] <= nums[r]) {
      res = Math.min(res, nums[l]);
      break;
    }
    let m = Math.floor((l + r) / 2);
    res = Math.min(res, nums[m]);
    if (nums[m] >= nums[l]) {
      l = m + 1;
    } else {
      r = m - 1;
    }
  }
  return res;
};

const findMinPref = (nums) => {
  // converge l pointer to the pivot index
  // O(log n) time and O(1) space
  let l = 0,
      r = nums.length - 1;
  while (l < r) {
      const m = Math.floor((l + r) / 2);
      if (nums[m] > nums[r]) {
        l = m + 1;
      } else {
        r = m;
      }
  }
  return nums[l];
};

// 33. Search in Rotated Sorted Array
/**
  * @param {number[]} nums
  * @param {number} target
  * @return {number}
  * solution must run in O(log n) time
  * return the index of target
  * Input: nums = [3,4,5,6,1,2], target = 1
  * Output: 4
*/
const search = (nums, target) => {
  let l = 0, r = nums.length -1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    // left window is the sorted window without pivot ind
    if (nums[l] <= nums[mid]) {
      if (target > nums[mid] || target < nums[l]) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    // right window is the sorted window without pivot ind
    } else {
      if (target < nums[mid] || target > nums[r]) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    }
  }
  return -1;
};