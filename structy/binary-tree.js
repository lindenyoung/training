// depth first values
const depthFirstValuesRecursive = (root, res = []) => {
  if (root === null) return [];

  const leftVals = depthFirstValuesRecursive(root.left);
  const rightVals = depthFirstValuesRecursive(root.right);
  return [root.val, ...leftVals, ...rightVals];
};

const depthFirstValuesIterative = (root) => {
  if (root === null) return [];

  const vals = [];
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    vals.push(node.val);

    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }

  return vals;
};

// breadth first values
const breadthFirstValues = (root) => {
  if (root === null) return [];

  const vals = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    vals.push(node.val);

    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }

  return vals;
};

// tree sum
const treeSumBFS = (root) => {
  if (root === null) return 0;

  let sum = 0;
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    sum += node.val;

    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }

  return sum;
};

const treeSumDFS = (root) => {
  if (root === null) return 0;

  return root.val + treeSumDFS(root.left) + treeSumDFS(root.right);
};

// tree includes
const treeIncludesBFS = (root, target) => {
  if (root === null) return false;

  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    if (node.val === target) return true;

    if (node.left !== null) queue.push(node.left);
    if (node.right !== null) queue.push(node.right);
  }

  return false;
};

const treeIncludesDFS = (root, target) => {
  if (root === null) return false;
  if (root.val === target) return true;

  return treeIncludesDFS(root.left, target) || treeIncludesDFS(root.right, target);
};

// tree min value
const treeMinValue = (root) => {
  if (root === null) return Infinity;

  let min = Infinity;
  const stack = [root];

  while (stack.length) {
    const node = stack.pop();
    if (node.val < min) min = node.val;

    if (node.right !== null) stack.push(node.right);
    if (node.left !== null) stack.push(node.left);
  }

  return min;
};

const treeMinValueRecursive = (root) => {
  if (root === null) return Infinity;
  const smallestLeftVal = treeMinValueRecursive(root.left);
  const smallestRightVal = treeMinValueRecursive(root.right);
  return Math.min(root.val, smallestLeftVal, smallestRightVal);
};

// max root to leaf path sum
const maxPathSum = (root) => {
  if (root === null) return - Infinity; // nodes with only 1 of 2 possible children
  if (root.left === null && root.right === null) return root.val;
  return root.val + Math.max(maxPathSum(root.left), maxPathSum(root.right));
};

// tree path finder
const pathFinder = (root, target) => {
  if (root === null) return null;
  if (root.val === target) return [root.val];

  const leftPath = pathFinder(root.left, target);
  if (leftPath) return [root.val, ...leftPath];

  const rightPath = pathFinder(root.right, target);
  if (rightPath) return [root.val, ...rightPath];

  return null;
};

// tree value count
const treeValueCount = (root, targetVal) => {
  if (root === null) return 0;
  const match = root.val === targetVal ? 1 : 0;
  return match + treeValueCount(root.left, targetVal) + treeValueCount(root.right, targetVal);
};

// how high
const howHigh = (root) => {
  if (root === null) return -1;
  const leftHeight = howHigh(root.left);
  const rightHeight = howHigh(root.right);
  return 1 + Math.max(leftHeight, rightHeight);
};

// bottom right value - right most value in the bottom most level of the tree
  // use queue to find bottom most level, then return last node in queue
const bottomRightValue = (root) => {
  const queue = [root];
  let curr;

  while (queue.length) {
    curr = queue.shift();
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }

  return curr.val;
};

// all tree paths

// tree levels

// level averages

// leaf list