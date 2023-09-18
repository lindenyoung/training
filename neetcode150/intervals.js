
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

/**
 * 56: Merge Intervals
 * @param {number[][]} intervals 
 * @returns {number[][]}
 */
const mergeIntervals = (intervals) => {
  if (!intervals.length) return []
  intervals.sort((a, b) => a[0] - b[0])

  const result = [intervals[0]]

  for (const interval of intervals) {
    const [start, end] = interval
    const prevEnd = result[result.length - 1][1]

    if (start <= prevEnd) result[result.length - 1][1] = Math.max(end, prevEnd)
    else result.push(interval)
  }

  return result
}

/**
 * 435: Non-overlapping Intervals
 * @param {number[][]} intervals 
 * @returns {number}
 */
const eraseOverlapIntervals = (intervals) => {
  if (!intervals.length) return []
  intervals.sort((a, b) => a[1] - b[1])

  let result = 0,
      prevEnd = intervals[0][1]

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) result++
    else prevEnd = intervals[i][1]
  }

  return result
}
