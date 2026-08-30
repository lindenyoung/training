// 57. Insert Interval
/**
   * @param {number[][]} intervals
   * @param {number[]} newInterval
   * @return {number[][]}
   * Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
   * Output: [[1,5],[6,9]]
   * think of the intervals as line segments
   * 1---3   6---9
   *   2---5
*/
// slower/worse solution in JS
const insert1 = (intervals, newInterval) => {
  // O(n^2) worst case time complexity but if written in Python, it's O(n) time. O(1) extra space, O(n) space for output list
  const res = [];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    if (newInterval[1] < interval[0]) {
      res.push(newInterval);
      return [...res, ...intervals.slice(i)]; // this slice in JS is causing O(n^2) time complexity worst case
    } else if (newInterval[0] > interval[1]) {
      res.push(interval);
    } else {
      newInterval = [
          Math.min(newInterval[0], interval[0]),
          Math.max(newInterval[1], interval[1])
      ];
    }
  }

  res.push(newInterval);
  return res;
};

// faster/better solution in JS
const insert2 = (intervals, newInterval) => {
  // O(n) time and O(1) space / O(n) space for output list
  const res = [];
  let i = 0;

  // add intervals that end before new interval starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]);
    i++;
  }

  // merge overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval = [
      Math.min(newInterval[0], intervals[i][0]),
      Math.max(newInterval[1], intervals[i][1])
    ];
    i++;
  }

  res.push(newInterval); // push final combined overlapping interval

  // add intervals that start after new interval ends
  while (i < intervals.length) {
    res.push(intervals[i]);
    i++;
  }

  return res;
};

// 56. Merge Intervals
/**
   * @param {number[][]} intervals
   * @return {number[][]}
*/
const merge = (intervals) => {};
