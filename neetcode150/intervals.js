
/**
 * 57: Insert Interval
 * @param {number[][]} intervals 
 * @param {number[]} newInterval 
 * @returns {number[][]}
 */
const insertInterval = (intervals, newInterval) => {
  let [start, end] = newInterval

  const left = [],
        right = []

  for (const interval of intervals) {
    const [currStart, currEnd] = interval

    // curr interval is before new interval
    if (currEnd < start) left.push(interval)

    // curr interval is after new interval
    else if (currStart > end) right.push(interval)

    // curr interval and new interval overlap
    else {
      start = Math.min(start, currStart)
      end = Math.max(end, currEnd)
    }
  }

  return [...left, [start, end], ...right]
}
