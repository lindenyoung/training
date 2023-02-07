// 1 - WORD BREAK

// 2 - PARTITION EQUAL SUBSET SUM

// 3 - STRING TO INTEGER (ATOI)

// 4 - SPIRAL MATRIX
const spiralOrder = (matrix) => {
  const result = [];

  while (matrix.length) {
    const first = matrix.shift();
    result.push(...first);

    for (const m of matrix) {
      let val = m.pop();
      if (val) {
        result.push(val);
        m.reverse();
      }
    }

    matrix.reverse();
  }

  return result;
};

// 5 - SUBSETS

// 6 - BINARY TREE RIGHT SIDE VIEW

const rightSideView = (root) => {
  if (root === null) return [];

  const result = [];
  const queue = [root];

  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const currNode = queue.shift();

      // if node is rightmost node in level push to result array
      if (i === levelSize - 1) result.push(currNode.val);

      // traverse
      if (currNode.left !== null) queue.push(currNode.left);
      if (currNode.right !== null) queue.push(currNode.right);
    }
  }

  return result;
};

// 7 - LONGEST PALINDROMIC SUBSTRING

// 8 - UNIQUE PATHS

// 9 - CONSTRUCT BINARY TREE FROM PREORDER AND INORDER TRAVERSAL

