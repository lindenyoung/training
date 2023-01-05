// 1 - TWO SUM

// if nums array is not sorted
const twoSumCacheDiffs = (nums, target) => {
  const diffs = {};

  for (let i = 0; i < nums.length; i++) {
    const curr = nums[i];
    const diff = target - curr;

    if (diffs[curr] !== undefined) return [diffs[curr], i];
    diffs[diff] = i;
  }
};

// if nums array is sorted
const twoSumTwoPointers = (nums, target) => {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) return [left, right];
    if (sum < target) left++;
    if (sum > target) right--;
  }

  return [-1, -1];
};

// 2 - VALID PARENTHESIS

const validParens = (s) => {
  const openersToClosers = {
    '(': ')',
    '[': ']',
    '{': '}'
  };
  const openers = new Set(['(', '[', '{']);
  const closers = new Set([')', ']', '}']);
  const openersStack = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // push openers to stack
    if (openers.has(char)) {
      openersStack.push(char);
    // closers logic
    } else if (closers.has(char)) {
      if (!openersStack.length) return false; // return false if no openers to match
      const lastUnclosedOpener = openersStack.pop(); // grab most recent opener from stack
      if (openersToClosers[lastUnclosedOpener] !== char) return false; // check for match
    }
  }
  return openersStack.length === 0; // return true if stack is empty
};

// 3 - MERGE TWO SORTED LISTS

// 4 - BEST TIME TO BUY AND SELL STOCK
const buyAndSellStock = (prices) => {
  let maxProfit = 0;
  let minSoFar = prices[0];

  for (let i = 1; i < prices.length; i++) {
    minSoFar = Math.min(minSoFar, prices[i]);
    const currProfit = prices[i] - minSoFar;
    maxProfit = Math.max(maxProfit, currProfit);
  }
  return maxProfit;
}

// 5 - VALID PALINDROME
const isPalindrome = (s) => {
  const alphanumericOnly = s.toLowerCase().replace(/[^0-9A-Z]+/gi,"");

  let start = 0;
  let end = alphanumericOnly.length - 1;

  while (start < end) {
    if (alphanumericOnly[start] !== alphanumericOnly[end]) return false;
    start++;
    end--;
  }
  return true;
}

// 6 - INVERT BINARY TREE

// 7 - VALID ANAGRAM

// 8 - BINARY SEARCH

// 9 - FLOOD FILL
const floodFillMatrix = (image, sr, sc, color) => {
  if (image[sr][sc] !== color) changeColor(image, sr, sc, image[sr][sc], color);
  return image;
};

const changeColor = (matrix, x, y, oldColor, newColor) => {
  if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[0].length) return; // invalid cell
  if (matrix[x][y] !== oldColor) return; // not the required color (same as starting cell color)

  matrix[x][y] = newColor;

  changeColor(matrix, x + 1, y, oldColor, newColor); // down
  changeColor(matrix, x - 1, y, oldColor, newColor); // up
  changeColor(matrix, x, y + 1, oldColor, newColor); // right
  changeColor(matrix, x, y - 1, oldColor, newColor); // left
};

// 10 - LOWEST COMMON ANCESTOR OF BST

// 11 - BALANCED BINARY TREE

// 12 - LINKED LIST CYCLE

// 13 - IMPLEMENT QUEUE USING STACKS