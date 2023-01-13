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

