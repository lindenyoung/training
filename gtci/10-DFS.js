// TREE DEPTH FIRST SEARCH

/* - - - - - - - - - - - - - - - - - - - - */

// BINARY TREE PATH SUM

const hasPathToSum = (root, sum) => {
  if (root === null) return false;

  // base case - found path and curr node is a leaf node
  if (root.val === sum && root.left === null && root.right === null) return true;

  // return true if either of two recursive calls (left and right) return true
  return hasPathToSum(root.left, sum - root.val) || hasPathToSum(root.right, sum - root.val);
};

/* - - - - - - - - - - - - - - - - - - - - */

// ALL PATHS FOR A SUM

const allPathsToSum = (root, sum) => {
  const allPaths = [];
  findPathsDFS(root, sum, [], allPaths);
  return allPaths;
};

// DFS helper function
const findPathsDFS = (currNode, sum, currPath, allPaths) => {
  if (currNode === null) return; // break / return if null node

  currPath.push(currNode.val); // add curr node to path

  // if found path to sum and curr node is leaf node, push curr path to result array allPaths
  if (currNode.val === sum && currNode.left === null && currNode.right === null) {
    allPaths.push(currPath);
  // otherwise, traverse left and right nodes
  } else {
    // left
    findPathsDFS(currNode.left, sum - currNode.val, currPath, allPaths);
    // right
    findPathsDFS(currNode.right, sum - currNode.val, currPath, allPaths);
  }

  // remove curr node from curr path as we go back up the call stack to backtrack our path
  currPath.pop();
};

/* - - - - - - - - - - - - - - - - - - - - */

// SUM OF PATH NUMBERS
// O(N) time and O(N) space

const sumOfPathNums = (root) => {
  return findPathNumsDFS(root, 0);
};

// DFS helper
const findPathNumsDFS = (currNode, pathSum) => {
  if (currNode === null) return 0;

  // calculate path num of curr node (1 - 7 - 2 -> 1 * 10 + 7 = 17 -> 17 * 10 + 2 = 172)
  pathSum = pathSum * 10 + currNode.val;

  // if curr node is leaf node, return curr path sum
  if (currNode.left === null && currNode.right === null) return pathSum;

  // traverse left and right - since we want the total sum, we can add left and right
  return findPathNumsDFS(currNode.left, pathSum) + findPathNumsDFS(currNode.right, pathSum);
};

/* - - - - - - - - - - - - - - - - - - - - */

// PATH WITH GIVEN SEQUENCE

const pathWithGivenSequence = (root, sequence) => {
  if (root === null) return sequence.length === 0; // edge case
  return findPathWithSequenceDFS(root, sequence, 0);
};

// DFS helper function
const findPathWithSequenceDFS = (currNode, sequence, index) => {
  if (currNode === null) return false;

  const length = sequence.length;

  // false conditions - we passed sequence length (path is too long) or curr node val doesn't match sequence val
  if (index >= length || currNode.val !== sequence[index]) return false;

  // true condition - curr node is a leaf node and we are at the end of the sequence
  if (currNode.left === null && currNode.right === null && index === length - 1) return true;

  // traverse left and right, return true if any of the two recursive calls return true - reasoning for ||
  return findPathWithSequenceDFS(currNode.left, sequence, index + 1) || findPathNumsDFS(currNode.right, sequence, index + 1);
};

/* - - - - - - - - - - - - - - - - - - - - */

// COUNT PATHS FOR A SUM - kind of confused on this one
// O(n2) time and O(n) space (recursion stack)
// there is an O(n) time and O(n) space solution using prefix sum

const countPaths = (root, sum) => {
  return countPathsRecursive(root, sum, []);
};

const countPathsRecursive = (currNode, sum, currPath) => {
  if (currNode === null) return 0;

  // add curr node to path
  currPath.push(currNode.val);

  let pathCount = 0;
  let pathSum = 0;

  // find sums of all sub-paths in curr path list
  for (i = currPath.length - 1; i >= 0; i--) {
    pathSum += currPath[i];
    if (pathSum === sum) pathCount++;
  }

  // traverse left and right child nodes
  pathCount += countPathsRecursive(currNode.left, sum, currPath);
  pathCount += countPathsRecursive(currNode.right, summ, currPath);

  // remove curr node from path to backtrack
  currPath.pop();
  return pathCount;
};