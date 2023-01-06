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

