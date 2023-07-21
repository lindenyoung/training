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
