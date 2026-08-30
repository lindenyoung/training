// 62. Unique Paths
/**
   * @param {number} m (# of rows)
   * @param {number} n (# of columns)
   * @return {number}
   * Input: m = 3, n = 3
   * Output: 6
   * Input: m = 3, n = 6
   * Output: 21
*/
const uniquePaths = (m, n) => {
  // O(m * n) time and O(n) space
  // bottom row, value = # of ways to reach end cell
  let row = new Array(n).fill(1);
  for (let i = 0; i < m - 1; i++) {fo
    const newRow = new Array(n).fill(1);
    for (let j = n - 2; j >= 0; j--) { // n - 2 bc n - 1 is last cell which will always = 1
      newRow[j] = row[j] + newRow[j + 1]; // down + right ways to reach end cell
    }
    row = newRow;
  }
  return row[0];
};

// 1143. Longest Common Subsequence
/**
   * @param {string} text1
   * @param {string} text2
   * @return {number}
   * Input: text1 = "cat", text2 = "crabt"
   * Output: 3
   *   c a t
   * c 3 2 1 0
   * r 2 2 1 0
   * a 2 2 1 0
   * b 1 1 1 0
   * t 1 1 1 0
   *   0 0 0 0
*/
const longestCommonSubsequence = (text1, text2) => {
  // O(n * m) time and space where n = text1 length and m = text2 length
  // same as Array.from({ length: text1.length + 1 }, () => Array.from({ length: text2.length + 1 }, () => 0));
  const dp = new Array(text1.length + 1).fill(null).map(() => new Array(text2.length + 1).fill(0));
  for (let i = text1.length - 1; i >= 0; i--) {
    for (let j = text2.length - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1]; // diagonal
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j +1]); // down or right
      }
    }
  }
  return dp[0][0];
};
