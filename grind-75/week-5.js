// 1 - SEARCH IN ROTATED SORTED ARRAY
// solution must be O(log n) runtime
// one half of array will be sorted no matter the pivot point, so can use binary search
const searchRotatedArray = (nums, target) => {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2); // midpoint

    if (nums[mid] === target) return mid;

    // check if the left side is the sorted half
    if (nums[left] <= nums[mid]) {
      // if target is in left side, move right pointer down
      if (nums[left] <= target && target <= nums[mid]) right = mid - 1;
      // otherwise move left pointer up
      else left = mid + 1;
    // otherwise the right side is sorted
    } else {
      if (nums[mid] <= target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }

  return -1;
};

// 2 - COMBINATION SUM
const combinationSum = (candidates, target) => {
  let index = 0;
  let temp = [];
  let result = [];

  function backtracking(index, target, temp) {
    if (target === 0) {
      result.push([...temp]);
      return;
    }

    if (target < 0) return;

    for (let i = index; i < candidates.length; i++) {
      temp.push(candidates[i]);
      backtracking(i, target - candidates[i], temp);
      temp.pop();
    }
  }

  backtracking(index, target, temp);
  return result;
};

// 3 - PERMUTATIONS

// 4 - MERGE INTERVALS
const mergeIntervals = (intervals) => {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const mergedIntervals = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const currInterval = intervals[i];
    const lastMergedInterval = mergedIntervals[mergedIntervals.length - 1];

    if (currInterval[0] <= lastMergedInterval[1]) {
      lastMergedInterval[1] = Math.max(lastMergedInterval[1], currInterval[1]);
    } else {
      mergedIntervals.push(currInterval);
    }
  }

    return mergedIntervals;
};

// 5 - LOWEST COMMON ANCESTOR OF BINARY TREE

// 6 - TIME BASED KEY VALUE STORE

// 7 - ACCOUNTS MERGE

// 8 - SORT COLORS
// sort nums array in place without native methods in red white blue order (0, 1, 2)
const sortColors = (nums) => {
  const swap = (a, b) => {
    [nums[a], nums[b]] = [nums[b], nums[a]];
  };

  let left = 0;
  let curr = 0;
  let right = nums.length - 1;

  while (curr <= right) {
    if (nums[curr] === 0) {
      swap(left, curr); // if 0, swap with left pointer (inner edge of zeros)
      left++;
      curr++;
    } else if (nums[curr] === 2) { // if 2, swap with right pointer (inner edge of twos)
      swap(curr, right);
      right--;
    } else {
      curr++; // if 1, keep traversing
    }
  }
}