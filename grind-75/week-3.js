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
// O(n log(n)) time and O(1) space
const kClosestPoints = (points, k) => {
  return points.sort((a, b) => getDistance(a) - getDistance(b)).slice(0, k);
};

// helper function
const getDistance = ([a, b]) => {
  return (a * a) + (b * b);
};

// 4 - LONGEST SUBSTRING WITHOUT REPEATING CHARS
const longestNonRepeatingSubstring = (s) => {
  let windowStart = 0,
      maxLength = 0,
      charIndexMap = {};

  for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
    const rightChar = s[windowEnd];
    if (rightChar in charIndexMap) {
      windowStart = Math.max(windowStart, charIndexMap[rightChar] + 1);
    }

    charIndexMap[rightChar] = windowEnd;

    const currLength = windowEnd - windowStart + 1;
    maxLength = Math.max(maxLength, currLength);
  }

  return maxLength;
};

// 5 - 3 SUM
// basically iterating through nums array and doing two sum for each num
const threeSum = (nums) => {
  if (nums.length < 3) return [];

  const result = [];
  let sum = 0;

  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicates

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;

        // move left pointer to avoid duplicates
        while (nums[left] === nums[left - 1] && left < right) {
          left++;
        }

        // move right pointer to avoid duplicates
        while (nums[right] === nums[right + 1] && left < right) {
          right--;
        }

      // move pointer depending on sum
      } else if (sum > 0) {
        right--;
      } else {
        left++;
      }
    }
  }

  return result;
};

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
const cloneGraph = (node) => {
  if (node === null) return null;

  const hashMap = new Map();

  const clone = (root) => {
    if (!hashMap.has(root.val)) {
      hashMap.set(root.val, new Node(root.val));
      hashMap.get(root.val).neighbors = root.neighbors.map(clone); // neighbors.map is array method map
    }
    return hashMap.get(root.val);
  };

  return clone(node);
};

// 8 - EVALUATE REVERSE POLISH NOTATION
// 12 7 - = 12 - 7 = 5
const evalReversePolishNotation = (tokens) => {
  let a, b;
  const evaluate = {
    "+": () => a+b,
    "-": () => a-b,
    "*": () => a*b,
    "/": () => ~~(a/b)
  };

  const stack = [];

  for (let t of tokens) {
    if (evaluate[t]) { // if curr string is an operand
      b = stack.pop();
      a = stack.pop();
      stack.push(evaluate[t]()); // push evaluated result to stack
    } else {
      stack.push(~~t); // push (Math.floor) curr str (element)
    }
  }

  return stack[0]; // stack will contain one element - the final result
};

