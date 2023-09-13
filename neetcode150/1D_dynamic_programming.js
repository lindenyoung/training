/**
 * 70: Climbing Stairs
 * O(n) time and O(1) space
 * @param {number} n 
 * @returns {number}
 */
const climbStairs = (n) => {
  if (n < 4) return n

  let a = 1,
      b = 1,
      fib

  for (let i = 2; i <= n; i++) {
    fib = a + b
    a = b
    b = fib
  }

  return fib
}

/**
 * 746: Min Cost Climbing Stairs
 * top down dynamic programming solution
 * O(n) time and O(1) space
 * @param {number[]} cost 
 * @returns {number}
 */
const minCostClimbingStairs = (cost) => {
  // ~i is a bitwise negation operator, basically = i >= 0
  for (let i = cost.length - 3; ~i; i--) {
    cost[i] += Math.min(cost[i + 1], cost[i + 2])
  }

  return Math.min(cost[0], cost[1])
}
