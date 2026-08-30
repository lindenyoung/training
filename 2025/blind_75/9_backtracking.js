// 39. Combination Sum
/**
  * @param {number[]} nums
  * @param {number} target
  * @returns {number[][]}
  * Input: candidates = [2,3,6,7], target = 7
  * Output: [[2,2,3],[7]]
*/
const combinationSum = (nums, target) => {
  // O(2^t/m) which basically equals O(2^t) time and O(t/m) space where t = target and m = min num in nums
  const res = [];

  const dfs = (i, curr, total) => {
    if (total === target) {
      res.push([...curr]); // push a copy so we can still access the curr reference
      return;
    } else if (i >= nums.length || total > target) { // >= is important here
      return;
    }

    // 2 potential recursive moves
    curr.push(nums[i]);
    dfs(i, curr, total + nums[i]); // use curr num again
    curr.pop(); // have to do some clean up for second option - this is the backtracking
    dfs(i + 1, curr, total); // skip curr num and move to next num
  };

  dfs(0, [], 0);
  return res;
};

// 79. Word Search
/**
  * @param {character[][]} board
  * @param {string} word
  * @return {boolean}
  * Input:
    board = [
      ["A","B","C","D"],
      ["S","A","A","T"],
      ["A","C","A","E"]
    ],
    word = "CAT"
  * Output: true
*/
const exist = (board, word) => {
  // O(n * m * 4^l) time where n * m = dimensions of board and l = length of word
  const rows = board.length,
        cols = board[0].length,
        path = new Set();

  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    const key = `${r},${c}`;
    if (path.has(key) || board[r][c] !== word[i]) return false; // the set is used instead of mutating data in place
    path.add(key);
    const res = (
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1)
    );
    path.delete(key);
    return res;
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
};
