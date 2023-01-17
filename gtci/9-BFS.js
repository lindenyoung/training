// TREE BREADTH FIRST SEARCH

/* - - - - - - - - - - - - - - - - - - - - */

// LEVEL ORDER TRAVERSAL

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

const traversal = (root) => {
  const result = [];
  if (root === null) return result;

  const queue = [root];

  while (queue.length > 0) { // tree traversal
    const levelSize = queue.length;
    const currLevel = [];
    for (let i = 0; i < levelSize; i++) { // level traversal
      const currNode = queue.shift();
      currLevel.push(currNode.val);
      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }

    result.push(currLevel);
  }

  return result;
};

/* - - - - - - - - - - - - - - - - - - - - */

// REVERSE LEVEL ORDER TRAVERSAL - lowest level comes first, still left to right

const reverseTraversal = (root) => {
  const result = [];
  if (root === null) return result;

  const queue = [root];
  while (queue.length > 0) { // tree traversal
    const levelSize = queue.length;
    const currLevel = [];
    for (let i = 0; i < levelSize; i++) { // level traversal
      const currNode = queue.shift();
      currLevel.push(currNode.val);
      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }

    result.unshift(currLevel); // add levels to beginning instead of end for reverse order
  }

  return result;
};

/* - - - - - - - - - - - - - - - - - - - - */

// ZIG ZAG TRAVERSAL

const zigZagTraversal = (root) => {
  const result = [];
  if (root === null) return result;

  const queue = [root];
  let leftToRight = true;
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const currNode = queue.shift();

      if (leftToRight) {
        currLevel.push(currNode.val);
      } else {
        currLevel.unshift(currNode.val);
      }

      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }

    result.push(currLevel);
    leftToRight = !leftToRight; // switch direction
  }

  return result;
};

/* - - - - - - - - - - - - - - - - - - - - */

// LEVEL AVERAGES OF BINARY TREE

const levelAverages = (root) => {
  const result = [];
  if (root === null) return result;

  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    let levelSum = 0;
    for (let i = 0; i < levelSize; i++) {
      const currNode = queue.shift();
      levelSum += currNode.val;

      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }

    result.push(levelSum / levelSize);
  }

  return result;
};

/* - - - - - - - - - - - - - - - - - - - - */

// MINIMUM DEPTH OF A BINARY TREE (# nodes along shortest path from root to nearest leaf node)

const findMinDepth = (root) => {
  if (root === null) return 0;

  const queue = [root];
  let minTreeDepth = 0;

  while (queue.length) {
    minTreeDepth++; // increment depth by one for each level of tree
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const currNode = queue.shift();
      // return condition - if curr node is a leaf node
      if (currNode.left === null && currNode.right === null) return minTreeDepth;
      // add children to queue
      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }
  }
};

/* - - - - - - - - - - - - - - - - - - - - */

// MAX DEPTH OF BINARY TREE

const findMaxDepth = (root) => {
  if (root === null) return 0;

  const queue = [root];
  let maxDepth = 0;

  while (queue.length) {
    maxDepth++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const n = queue.shift();

      if (n.left !== null) queue.push(n.left);
      if (n.right !== null) queue.push(n.right);
    }
  }

  return maxDepth;
};

/* - - - - - - - - - - - - - - - - - - - - */

// LEVEL ORDER SUCCESSOR (the node that appears right after the given node in a level order / BFS traversal)

const levelOrderSuccessor = (root, target) => {
  if (root === null) return null;

  const queue = [root];

  while (queue.length) {
    const n = queue.shift();
    // add children
    if (n.left !== null) queue.push(n.left);
    if (n.right !== null) queue.push(n.right);
    // break if reached the target node
    if (n.val === target) break;
  }

  // if children of target node exist return next item in queue, otherwise return null
  return queue.length > 0 ? queue[0] : null;
};

/* - - - - - - - - - - - - - - - - - - - - */

// CONNECT LEVEL ORDER SIBLINGS (give each node a next pointer - only within levels)

const connectSiblings = (root) => {
  if (root === null) return;

  const queue = [root];

  while (queue.length) {
    let prevNode = null;
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const n = queue.shift();

      if (prevNode !== null) prevNode.next = n; // assign next pointer to curr node if prev node exists
      prevNode = n; // reassign prev node to move through the level

      if (n.left !== null) queue.push(n.left);
      if (n.right !== null) queue.push(n.right);
    }
  }
};

/* - - - - - - - - - - - - - - - - - - - - */

// CONNECT ALL SIBLINGS

const connectAllSiblings = (root) => {
  if (root === null) return;

  const queue = [root];
  let curr = null;
  let prev = null;

  while (queue.length) {
    curr = queue.shift();
    if (prev !== null) prev.next = curr;
    prev = curr;

    if (curr.left !== null) queue.push(curr.left);
    if (curr.right !== null) queue.push(curr.right);
  }
};

/* - - - - - - - - - - - - - - - - - - - - */

// RIGHT VIEW OF A BINARY TREE (return array containing nodes in its right view)

const rightView = (root) => {
  const result = [];
  if (root === null) return result;

  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const curr = queue.shift();
      // if curr is last node of its level (rightmost node) push to result array
      if (i === levelSize - 1) result.push(curr);

      if (curr.left !== null) queue.push(curr.left);
      if (curr.right !== null) queue.push(curr.right);
    }
  }

  return result;
};