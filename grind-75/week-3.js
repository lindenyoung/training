// 1 - INSERT INTERVAL
const insertInterval = (intervals, newInterval) => {
  let merged = [];
  let i = 0;

  // grab all intervals that come before the new interval
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    merged.push(intervals[i]);
    i++;
  }

  // merge overlapping intervals with new interval
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(intervals[i][0], newInterval[0]);
    newInterval[1] = Math.max(intervals[i][1], newInterval[1]);
    i++;
  }

  // push newly merged interval
  merged.push(newInterval);

  // grab all remaining intervals after newly merged interval
  while (i < intervals.length) {
    merged.push(intervals[i]);
    i++;
  }

  // return
  return merged;
};

// 2 - 01 MATRIX

// 3 - K CLOSEST POINTS TO ORIGIN

// 4 - LONGEST SUBSTRING WITHOUT REPEATING CHARS

// 5 - 3 SUM

// 6 - BINARY TREE LEVEL ORDER TRAVERSAL
const treeLevelOrderTraversal = (root) => {
  const result = [];
  if (root === null) return result; // edge case - null root node

  const queue = [root];

  while (queue.length) { // tree traversal
    const levelSize = queue.length;
    const currLevelVals = []; // array to hold curr level node values

    for (let i = 0; i < levelSize; i++) { // level traversal - for each level, traverse all nodes
      const currNode = queue.shift(); // grab curr node
      currLevelVals.push(currNode.val); // push value to curr level array
      if (currNode.left !== null) queue.push(currNode.left); // add left child node to queue
      if (currNode.right !== null) queue.push(currNode.right); // add right child node to queue
    }
    result.push(currLevelVals); // push curr level arr result arr
  }

  return result;
};

// 7 - CLONE GRAPH

// 8 - EVALUATE REVERSE POLISH NOTATION