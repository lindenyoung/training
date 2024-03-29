/**
 * 226: Invert Binary Tree
 * given the root of a binary tree, invert tree and return root
 * @param {TreeNode} root 
 * @return {TreeNode}
 */
// dfs recursion approach
const invertTree = (root) => {
  if (root === null) return root

  const left = invertTree(root.left)
  const right = invertTree(root.right)
  
  root.left = right
  root.right = left

  return root
}

/**
 * 104: Maximum Depth of Binary Tree
 * @param {TreeNode} root 
 * @return {number}
 */
// dfs recursion approach
const maxDepth = (root) => {
  if (root === null) return 0

  const left = maxDepth(root.left)
  const right = maxDepth(root.right)
  const height = Math.max(left, right)

  return height + 1
}

/**
 * 543: Diameter of Binary Tree
 * @param {TreeNode} root 
 * @return {number}
 */
const diameterDFS = (root) => {
  let diameter = 0
  dfs(root)
  return diameter
  
  // helper recursive fund
  function dfs(node) {
    if (!node) return 0

    const left = dfs(node.left)
    const right = dfs(node.right)
    
    diameter = Math.max(diameter, left + right)

    return 1 + Math.max(left, right)
  }
}

/**
 * 110: Balanced Binary Tree
 * @param {TreeNode} root 
 * @return {boolean}
 */
const balancedBinaryTree = (root) => {
  if (root === null) return true // empty tree edge case
  return findHeightDFS(root) === -1 ? false : true

  // helper recursive func
  function findHeightDFS(node) {
    if (node === null) return 0 // base case

    const left = findHeightDFS(node.left)
    const right = findHeightDFS(node.right)

    if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1

    return 1 + Math.max(left, right)
  }
}

/**
 * 100: Same Tree
 * @param {TreeNode} p 
 * @param {TreeNode} q 
 */
const isSameTree = (p, q) => {
  if (!p && !q) return true // true base case
  if (!p || !q || p.val !== q.val) return false // false base cases

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}

/**
 * 572: Subtree of Another Tree
 * @param {TreeNode} root 
 * @param {TreeNode} subRoot 
 * @return {boolean}
 */
const isSubTree = (root, subRoot) => {
  if (!root) return false
  if (isSameTree(root, subRoot)) return true
  return isSubTree(root.left, subRoot) || isSubTree(root.right, subRoot)
}

/**
 * 235: Lowest Common Ancestor of a Binary Search Tree
 * O(n) time and O(n) space
 * @param {TreeNode} root 
 * @param {TreeNode} p 
 * @param {TreeNode} q 
 * @return {TreeNode}
 */
const lowestCommonAncestorRec = (root, p, q) => {
  // if both node vals > root, move right
  if (root.val < p.val && root.val < q.val) return lowestCommonAncestorRec(root.right, p, q)
  // if both node vals < root, move left
  if (root.val > p.val && root.val > q.val) return lowestCommonAncestorRec(root.left, p, q)

  // otherwise, root = the lowest common ancestor since one node is to left and one node is to right of root
  return root
}

// O(1) space using iterative solution
const lowestCommonAncestorIter = (root, p, q) => {
  while (root !== null) {
    if (root.val < p.val && root.val < q.val) {
      root = root.right
      continue
    }
    if (root.val > p.val && root.val > q.val) {
      root = root.left
      continue
    }
    break
  }
  return root
}

/**
 * 102: Binary Tree Level Order Traversal
 * O(n) time and O(n) space
 * @param {TreeNode} root 
 * @return {number[][]}
 */
const levelOrderTraversal = (root) => {
  if (root === null) return []
  const lvls = []
  const queue = [root]

  while (queue.length) {
    const lvl = []
    const lvlSize = queue.length

    for (let i = 0; i < lvlSize; i++) {
      const node = queue.shift() // constant time for actual queue ds
      lvl.push(node.val)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    lvls.push(lvl)
  }

  return lvls
}

/**
 * 199: Binary Tree Right Side View
 * @param {TreeNode} root 
 * @return {number[]}
 */
const rightSideView = (root) => {
  if (root === null) return []

  const rightSide = []
  const queue = [root]

  while (queue.length) {
    let prev = null

    // same logic as problem 102 above, just without extra const
    for (let i = queue.length - 1; i >= 0; i--) {
      const node = queue.shift()
      prev = node
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    rightSide.push(prev.val)
  }

  return rightSide
}

/**
 * 1448: Count Good Nodes in Binary Tree
 * a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.
 * @param {TreeNode} root 
 * @return {number}
 */
const goodNodes = (root) => {
  let total = 0

  dfs(root, root.val)
  return total

  function dfs(node, max) {
    if (!node) return
    if (node.val >= max) total++
    max = Math.max(max, node.val)
    dfs(node.left, max)
    dfs(node.right, max)
  }
}

/**
 * 98: Validate Binary Search Tree
 * @param {TreeNode} root 
 * @return {boolean}
 */
const validateBST = (root, min = -Infinity, max = Infinity) => {
  // base case
  if (root === null) return true
  // invalid cases
  if (root.val <= min || root.val >= max) return false

  const left = validateBST(root.left, min, root.val)
  const right = validateBST(root.right, root.val, max)

  return left && right
}

/**
 * 230: Kth Smallest Element in a BST
 * this solution uses in order traversal
 * @param {TreeNode} root 
 * @param {number} k 
 * @return {number}
 */
const kthSmallest = (root, k) => {
  const nums = []

  dfs(root)
  return nums[k - 1]

  function dfs(node) {
    // early return pattern to short circuit the traversal
    if (nums.length === k) return

    // in order traversal
    if (node.left) dfs(node.left)
    nums.push(node.val) // done moving left, now start populating result arr
    if (node.right) dfs(node.right)
  }
}

/**
 * 105: Construct Binary Tree from Preorder and Inorder Traversal
 * @param {number[]} preorder 
 * @param {number[]} inorder 
 * @return {TreeNode}
 */
const buildTree = (preorder, inorder) => {
  // pointers for curr index of input arrays
  let p = 0,
      i = 0

  // stop arg helps determine when to stop recursion for a specific branch
  function build(stop) {
    if (inorder[i] === stop) return null // this branch is complete when we encounter the stop val in the inorder arr
    
    const node = new TreeNode(preorder[p++])
    node.left = build(node.val)
    i++
    node.right = build(stop)
    return node
  }

  return build()
}
