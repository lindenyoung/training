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

// 3 - MERGE TWO SORTED LISTS (linked lists)
const mergeTwoLists = (l1, l2) => {
  if (!l1) return l2;
  else if (!l2) return l1;
  else if (l1.val <= l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};

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
  // BFS solution
const invertBinaryTreeBFS = (root) => {
  const queue = [root];

  while (queue.length) {
    const currNode = queue.shift();
    if (currNode !== null) {
      [currNode.left, currNode.right] = [currNode.right, currNode.left];
      queue.push(currNode.left, currNode.right);
    }
  }

  return root;
};

// DFS solution
const invertBinaryTreeDFS = (root) => {
  const stack = [root];

  while (stack.length) {
    const n = stack.pop();
    if (n !== null) {
      [n.left, n.right] = [n.right, n.left];
      stack.push(n.left, n.right);
    }
  }

  return root;
};

// 7 - VALID ANAGRAM
  // two possible approaches - sort and compare / use hash map as a frequency counter
const isAnagram = (stringOne, stringTwo) => {
  return stringOne.split('').sort().join('') === stringTwo.split('').sort().join('');
};

// 8 - BINARY SEARCH
const binarySearch = (nums, target) => {
  // create two pointers
  let left = 0;
  let right = nums.length - 1;
  // while pointers haven't crossed
  while (left <= right) {
    // create midpoint index
    const midpoint = Math.floor((left + right) / 2);
    // test midpoint value against target
    if (nums[midpoint] === target) return midpoint; // if equal, return index
    // otherwise, reassign left or right as needed
    if (nums[midpoint] < target) left++;
    if (nums[midpoint] > target) right--;
  }
  // return -1
  return -1;
};

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
// iterative is same time but better space than recursive solution
// O(n) time and O(1) space
const lowestCommonAncestorBST = (root, p, q) => {
  while (root) {
    if (root.val < p.val && root.val < q.val) {
      root = root.right; // move right if both vals are greater than root val (on right of curr tree)
    } else if (root.val > p.val && root.val > q.val) {
      root = root.left; // move left if both vals are less than root val (on left of curr tree)
    } else {
      break; // if root is inbetween both node vals, break and return root node
    }
  }

  return root;
}

// 11 - BALANCED BINARY TREE - a bit confused on how this is working
  // beats 96.68% runtime, 87.23% memory on Leetcode
const isTreeBalanced = (root) => {
  if (root === null) return true; // edge case, empty tree is balanced
  return findHeight(root) === -1 ? false : true; // -1 = not balanced, otherwise balanced
};

// helper function
const findHeight = (root) => {
  if (root === null) return 0; // base case
  let leftHeight = findHeight(root.left); // left
  let rightHeight = findHeight(root.right); // right
  if (leftHeight === -1 || rightHeight === -1) return -1; // if unbalanced return -1
  if (Math.abs(leftHeight - rightHeight) > 1) return -1; // if heights differ by > 1 return -1
  return Math.max(leftHeight, rightHeight) + 1; //
};

// 12 - LINKED LIST CYCLE
const hasCycleLL = (head) => {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }

  return false;
};

// 13 - IMPLEMENT QUEUE USING STACKS
const TwoStacksQueue = function() {
  const inStack = [];
  const outStack = [];

  TwoStacksQueue.prototype.push = (x) => {
    inStack.push(x);
    // console.log(inStack);
  };

  TwoStacksQueue.prototype.pop = () => {
    // when outStack is empty, need to invert inStack
    if (outStack.length === 0) {
      while (inStack.length > 0) {
        const newestInStackItem = inStack.pop();
        outStack.push(newestInStackItem);
      }
      // edge case of empty inStack - outStack length still zero
      if (outStack.length === 0) throw new Error("Can't dequeue from an empty queue");
    }
    // console.log(outStack);
    return outStack.pop();
  };

  TwoStacksQueue.prototype.peek = () => {
    if (outStack.length === 0) {
      while (inStack.length > 0) {
        const invertingItem = inStack.pop();
        outStack.push(invertingItem);
      }
      if (outStack.length === 0) return "Queue is empty!";
    }
    // console.log(outStack);
    // console.log(outStack[outStack.length - 1]);
    return outStack[outStack.length - 1];
  };

  TwoStacksQueue.prototype.empty = () => {
    if (outStack.length === 0) {
      while (inStack.length > 0) {
        const invertingItem = inStack.pop();
        outStack.push(invertingItem);
      }
      if (outStack.length === 0) return true;
    }
    return false;
  };
}

// const test = new TwoStacksQueue();
// test.push(10);
// test.push(20);
// test.push(30);
// test.push(40);
// test.pop();
// test.pop();
// test.push(50);
// test.push(60);
// test.pop();
// test.peek();
// test.pop();
// test.peek();
// test.empty();
// test.pop()
// test.pop();