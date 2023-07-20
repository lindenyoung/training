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
