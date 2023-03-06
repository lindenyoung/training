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

// tree path finder

// tree value count

// how high

// bottom right value

// all tree paths

// tree levels

// level averages

// leaf list