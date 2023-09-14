
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

/**
 * 252: Meeting Rooms
 * Input: intervals = [[7,10],[2,4]]
 * Output: true
 * @param {number[][]} intervals 
 * @returns {boolean}
 */
const canAttendMeetings = (intervals) => {
  const sortedMtgs = intervals.sort((a, b) => a[0] - b[0])

  for (let i = 0; i < sortedMtgs.length - 1; i++) {
    const endCurr = sortedMtgs[i][1]
    const startNext = sortedMtgs[i + 1][0]

    if (startNext < endCurr) return false
  }

  return true
}
