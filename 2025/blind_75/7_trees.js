class TreeNode {
  constructor(val = 0, left = null, right = null) {
      this.val = val;
      this.left = left;
      this.right = right;
  }
}

//  226. Invert Binary Tree
/**
  * @param {TreeNode} root
  * @return {TreeNode}
  * Input: root = [1,2,3,4,5,6,7]
  * Output: [1,3,2,7,6,5,4]
  * Input: root = [3,2,1]
  * Output: [3,1,2]
*/
const invertTree = (root) => {
  // O(n) time and O(n) space for recursion stack
  // recursive approach
  if (!root) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
};

const invertTreeIterative = (root) => {
  // O(n) time and O(n) space
  if (!root) return null;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    [node.left, node.right] = [node.right, node.left];
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return root;
};

// 104. Maximum Depth of Binary Tree
/**
  * @param {TreeNode} root
  * @return {number}
  * Input: root = [3,9,20,null,null,15,7]
  * Output: 3
*/
const maxDepth = (root) => {
  // O(n) time and O(n) space recursive solution
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

// 100. Same Tree
 /**
   * @param {TreeNode} p
   * @param {TreeNode} q
   * @return {boolean}
   * Input: p = [1,2,3], q = [1,2,3]
   * Output: true
*/
const isSameTree = (p, q) => {
  // O(n) time and O(n) space
  if (!p && !q) return true; // both null
  if (!p || !q || p.val !== q.val) return false;
  else return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};

// 572. Subtree of Another Tree
/**
  * @param {TreeNode} root
  * @param {TreeNode} subRoot
  * @return {boolean}
*/
const isSubtree = (root, subRoot) => {
  // O(n * m) time and O(n + m) space where n = # of nodes in root and m = # of nodes in subroot
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

// 235. Lowest Common Ancestor of a Binary Search Tree
/**
  * @param {TreeNode} root
  * @param {TreeNode} p
  * @param {TreeNode} q
  * @return {TreeNode}
*/
const lowestCommonAncestor = (root, p, q) => {
  // O(n) time and O(n) space where n = the height of the tree
  if (!root || !p || !q) return null;
  if (Math.max(p.val, q.val) < root.val) return lowestCommonAncestor(root.left, p, q);
  if (Math.min(p.val, q.val) > root.val) return lowestCommonAncestor(root.right, p, q);
  // found the LCD
  return root;
};

// 102. Binary Tree Level Order Traversal
// Queue implementation in JS with O(1) enqueue and dequeue
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(item) {
    this.items[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  size() {
    return this.tail - this.head;
  }

  isEmpty() {
    return this.head === this.tail;
  }
}
/**
  * @param {TreeNode} root
  * @return {number[][]}
  * Input: root = [1,2,3,4,5,6,7]
  * Output: [[1],[2,3],[4,5,6,7]]
*/
const levelOrder = (root) => {
  // O(n) time and O(n) space
  const res = [];
  if (!root) return res;
  const q = new Queue();
  q.enqueue(root);
  while (!q.isEmpty()) {
    const lvl = [];
    for (let i = q.size(); i > 0; i--) {
      const node = q.dequeue();
      if (node !== null) {
        lvl.push(node.val);
        q.enqueue(node.left);
        q.enqueue(node.right);
      }
    }
    if (lvl.length) {
      res.push(lvl);
    }
  }
  return res;
};

// 98. Validate Binary Search Tree
/**
  * @param {TreeNode} root
  * @return {boolean}
  * Input: root = [2,1,3]
  * Output: true
*/
const isValidBST = (root, min = -Infinity, max = Infinity) => {
  if (root === null) return true;
  // need <= to account for case of same node val ([2, 2, 2])
  if (root.val <= min || root.val >= max) return false; // equivalent to: if (!(min < root.val && max > root.val))
  return (
    isValidBST(root.left, min, root.val) && // if moving left, only care if we reach a val > curr node's val
    isValidBST(root.right, root.val, max) // if moving right, only care if we reach a val < curr node's val
  )
};

// 230. Kth Smallest Element in a BST
/**
     * @param {TreeNode} root
     * @param {number} k
     * @return {number}
     * Input: root = [2,1,3], k = 1
     * Output: 1
     * Input: root = [4,3,5,2,null], k = 4
     * Output: 5
     */
const dfsHelper = (node, arr) => {
  if (!node) return;
  dfsHelper(node.left, arr);
  arr.push(node.val);
  dfsHelper(node.right, arr);
};
const kthSmallest = (root, k) => {
  // O(n) time and O(n) space
  const nums = [];
  dfsHelper(root, nums);
  return nums[k - 1]; // k is 1-indexed, our nums arr is 0-indexed so need to subtract 1
};

// 105. Construct Binary Tree from Preorder and Inorder Traversal
/**
  * @param {number[]} preorder
  * @param {number[]} inorder
  * @return {TreeNode}
  * Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
  * Output: [3,9,20,null,null,15,7]
*/
const buildTree = (preorder, inorder) => {
  // O(n^2) time and O(n) space in JS
  if (!preorder || !inorder) {
    return null;
  }

  const root = new TreeNode(preorder[0]);
  const mid = inorder.indexOf(preorder[0]);
  // anything left mid in inorder arr is to left of that node
  root.left = buildTree(
    preorder.slice(1, mid + 1),
    inorder.slice(0, mid),
  );
  root.right = buildTree(
    preorder.slice(mid + 1),
    inorder.slice(mid + 1),
  );
  return root;
};


/**
  * @param {TreeNode} root
  * @return {number}
  * Input: root = [1,2,3]
  * Output: 6
*/
const maxPathSum = (root) => {
  // O(n) time and O(n) space
  // in JS, arrays are passed by reference so changes inside the dfs helper do affect the original var
  // in contrast, primitive values like a num are passed by value, so changes insidse dfs do not affect the original var
  const res = [root.val];
  dfs(root, res);
  return res[0];

  function dfs(root, res) {
    if (root === null) return 0;
    const leftMax = Math.max(dfs(root.left, res), 0);
    const rightMax = Math.max(dfs(root.right, res), 0);
    res[0] = Math.max(res[0], root.val + leftMax + rightMax);
    return root.val + Math.max(leftMax, rightMax);
  }
};

// 297. Serialize and Deserialize Binary Tree
/**
   * Encodes a tree to a single string.
   *
   * @param {TreeNode} root
   * @return {string}
*/
const serialize = (root) => {
  const res = [];
  dfsSer(root, res);
  return res.join(',');

  function dfsSerialize(node, res) {
    if (node === null) {
      res.push('N');
      return;
    }
    res.push(node.val.toString());
    this.dfsSerialize(node.left, res);
    this.dfsSerialize(node.right, res);
  }
};

/**
   * Decodes your encoded data to tree.
   *
   * @param {string} data
   * @return {TreeNode}
*/
const deserialize = (data) => {
  const vals = data.split(',');
  const i = { val: 0 };
  return dfsDes(vals, i);

  function dfsDes(vals, i) {
    if (vals[i.val] === 'N') {
        i.val++;
        return null;
    }
    const node = new TreeNode(parseInt(vals[i.val]));
    i.val++;
    node.left = dfsDes(vals, i);
    node.right = dfsDes(vals, i);
    return node;
  }
};