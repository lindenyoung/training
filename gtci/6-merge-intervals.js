// MERGE INTERVALS
  // useful for dealing with overlapping intervals - finding or merging

// MERGE OVERLAPPING INTERVALS
const mergeMeetings = (mtgs) => {
  if (mtgs.length < 2) return mtgs; // edge case of 0 or 1 mtg

  const sortedMtgs = mtgs.sort((a, b) => a.start - b.start); // sort mtgs by start time
  const mergedMtgs = [sortedMtgs[0]]; // initialize result array

  for (let i = 1; i < sortedMtgs.length; i++) {
    const currMtg = sortedMtgs[i]; // curr interval
    const lastMergedMtg = mergedMtgs[mergedMtgs.length - 1]; // interval we're comparing against

    if (currMtg.start <= lastMergedMtg.end) { // if overlapping
      mergedMtgs[mergedMtgs.length - 1].end = Math.max(lastMergedMtg.end, currMtg.end); // adjust end as needed
    } else {
      mergedMtgs.push(currMtg); // if not overlapping, push to merged array
    }
  }
  return mergedMtgs;
}

// const mergeMtgsTest =   [
//   { start: 0,  end: 1 },
//   { start: 3,  end: 5 },
//   { start: 4,  end: 8 },
//   { start: 10, end: 12 },
//   { start: 9,  end: 10 },
// ];
// console.log(mergeMeetings(mergeMtgsTest));

/* - - - - - - - - - - - - - - - - - - - - */

// INSERT INTERVAL
  // given list of non-overlapping intervals sorted by their start time,
  // insert a given interval at correct position and merge necessary intervals to produce mutually exclusive list

const insertInterval = (intervals, newInterval) => {
  let merged = [];
  let i = 0;
  // skip and add to output all intervals that come before the new interval
  while (i < intervals.length && intervals[i].end < newInterval.start) {
    merged.push(intervals[i]);
    i++;
  }
  // merge all intervals that overlap with new interval
  while (i < intervals.length && intervals[i].start <= newInterval.end) {
    newInterval.start = Math.min(intervals[i].start, newInterval.start);
    newInterval.end = Math.max(intervals[i].end, newInterval.end);
    i++;
  }
  // insert new interval
  merged.push(newInterval);
  // add remaining intervals
  while (i < intervals.length) {
    merged.push(intervals[i]);
    i++;
  }
  return merged;
};

/* - - - - - - - - - - - - - - - - - - - - */

  // INTERVALS INTERSECTION
  // given 2 lists of intervals (disjoint and sorted), find the intersection of these two lists
  // a = [[1,3], [5,6], [7,9]]
  // b = [[2,3], [5,7]]
  // output = [2,3], [5,6], [7,7]

const intervalsIntersection = (a, b) => {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    const aOverlapsB = a[i].start >= b[j].start && a[i].start <= b[j].end;
    console.log(aOverlapsB);
    const bOverlapsA = b[j].start >= a[i].start && b[j].start <= a[i].end;
    console.log(bOverlapsA);

    if (aOverlapsB || bOverlapsA) {
      result.push([Math.max(a[i].start, b[j].start), Math.min(a[i].end, b[j].end)]);
    }

    if (a[i].end < b[j].end) {
      i++;
    } else {
      j++;
    }
  }

  return result;
};

  // const testA = [{'start': 1, 'end': 3}, {'start': 5, 'end': 6}, {'start': 7, 'end': 9}];
  // const testB = [{'start': 2, 'end': 3}, {'start': 5, 'end': 7}];
  // console.log(intervalsIntersection(testA, testB));

  /* - - - - - - - - - - - - - - - - - - - - */

  // CONFLICTING APPOINTMENTS
  // given array of intervals (appts), return whether or not a person can attend all of them
  const conflictingAppts = (intervals) => {
    intervals.sort((a, b) => a.start - b.start);
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i].start < intervals[i - 1].end) return false;
    }
    return true;
  };

  /* - - - - - - - - - - - - - - - - - - - - */

  // StubHub Codility OA

  const solution = (A, P, B, E) => {
    if (!A.length) return false; // edge case - no cranes exist

    // get intervals for each crane
    const intervals = [];
    for (let i = 0; i < P.length; i++) {
      intervals.push([P[i] - A[i], P[i] + A[i]]); // crane position +/- arm length equals the window or interval for that crane
    }

    // sort intervals
    intervals.sort((a, b) => a[0] - b[0]);

    // merge intervals
    const mergedIntervals = [intervals[0]];

    for (let j = 1; j < intervals.length; j++) {
      const currStart = intervals[j][0];
      const currEnd = intervals[j][1];
      const lastEndPosition = mergedIntervals[mergedIntervals.length - 1][1];

      if (currStart <= lastEndPosition) {
        mergedIntervals[mergedIntervals.length - 1][1] = Math.max(currEnd, lastEndPosition); // merge if needed
      } else {
        mergedIntervals.push([currStart, currEnd]); // otherwise just add curr interval to merged list
      }
    }

    // check if package start and destination both exist within any merged interval
    for (let k = 0; k < mergedIntervals.length; k++) {
      const currStart = mergedIntervals[k][0];
      const currEnd = mergedIntervals[k][1];
      if (B >= currStart && B <= currEnd && E >= currStart && E <= currEnd) return true; // true condition - a window / interval of cranes includes both the start and ending package position
    }

    return false;
  };

  // console.log(solution([2, 1], [5, 1], 3, 6)); // -> true
  // console.log(solution([2, 1], [5, 1], 2, 6)); // -> false
  // console.log(solution([1, 4, 2], [10, 4, 7], 11, 1)); // -> // true
  // console.log(solution([1, 3], [2, 6], 1, 5)); // -> true