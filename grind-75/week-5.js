// 1 - SEARCH IN ROTATED SORTED ARRAY

// 2 - COMBINATION SUM

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