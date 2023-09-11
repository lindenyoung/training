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
