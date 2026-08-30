/*

  I:
  O:
  T/S:
*/

// https://www.techinterviewhandbook.org/grind75/?weeks=16&order=all_rounded&hours=6&grouping=none
// goal to do 1 x day for 16 weeks, 9/9 -> 12/29, 111 total questions
// not grouped by topic

/* 1. Two Sum
   Input: nums = [2,11,15,7], target = 9
   Output: [0,1]
   brute force = quadratic time, sort = nlog(n) time, map single iteration = O(n) time and space
*/
const twoSum = (nums, target) => {
  const map = new Map(); // tracks nums we've seen so far

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];

    if (map.has(diff)) { // if diff is a num we've already seen, we have a match
      return [map.get(diff), i];
    }

    map.set(nums[i], i);
  }

  return [];
};

/* 20. Valid Parentheses
   I: s = "([])"
   O: true
   does s only include parentheses?
   T/S: O(n) time and space
*/
const isValidParentheses = (s) => {
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  const stack = [];

  for (const c of s) {
    // closing paren
    if (c in pairs) {
      if (stack.length && stack[stack.length - 1] === pairs[c]) {
        stack.pop();
      } else {
        return false;
      }
    } else { // opening paren, push to stack
      stack.push(c);
    }
  }

  return stack.length === 0 ? true : false;
};

/* 21. Merge Two Sorted Lists
   I: list1 = [1,2,4], list2 = [1,3,5]
   O: [1,1,2,3,4,5]
   I: list1 = [], list2 = [0]
   O: [0]
   T/S: O(m + n) time and O(1) space
*/
const mergeTwoLists = (list1, list2) => {
  const dummy = {val: 0, next: null};
  let node = dummy;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      node.next = list1;
      list1 = list1.next;
    } else {
      node.next = list2;
      list2 = list2.next;
    }
    node = node.next;
  }

  // if lists have diff lengths
  node.next = list1 || list2; // same as if else block. empty list will be null bc of list.next pointing to null

  return dummy.next;
};

/* 121. Best Time to Buy and Sell Stock
   I: prices = [7,1,5,3,6,4]
   O: 5 (buy for 1, sell for 6)
   O(n) time and O(1) space
*/
const maxProfit = (prices) => {
  let profit = 0, minBuy = prices[0];
  for (const p of prices) {
    profit = Math.max(profit, p - minBuy);
    minBuy = Math.min(minBuy, p);
  }
  return profit;
}

/* 125. Valid Palindrome
   I: s = "A man, a plan, a canal: Panama"
   O: true (ignore case, punctuation, spaces)
   O(n) time and O(1) space
*/
const isPalindrome = (s) => {
  // helper
  const isAlphaNumeric = (char) => {
    return (
      char >= 'A' && char <= 'Z' ||
      char >= 'a' && char <= 'z' ||
      char >= '0' && char <= '9'
    );
  }

  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !isAlphaNumeric(s[l])) {
      l++;
    }
    while (r > l && !isAlphaNumeric(s[r])) {
      r--;
    }
    if (s[l].toLowerCase() !== s[r].toLowerCase()) {
      return false;
    }
    l++;
    r--;
  }
  return true;
};

/* 226. Invert Binary Tree
   I: root = [4,2,7,1,3,6,9]
   O: [4,7,2,9,6,3,1]
   T/S: O(n) time and O(n) space (stack / recursion stack)
*/
const invertTree = (root) => {
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

const invertTreeRecursive = (root) => {
  if (!root) return null; // base case
  [root.left, root.right] = [root.right, root.left];
  invertTreeRecursive(root.left);
  invertTreeRecursive(root.right);
  return root;
};

/* 242. Valid Anagram
   I: s = "anagram", t = "nagaram"
   O: true
   inputs only consist of lowercase english letters
   inputs both have length of at least one
   T/S: O(n) time and O(1) space
*/
const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;

  const sMap = {}, tMap = {};

  for (let i = 0; i < s.length; i++) {
    sMap[s[i]] = (sMap[s[i]] || 0) + 1;
    tMap[t[i]] = (tMap[t[i]] || 0) + 1;
  }

  for (const k in sMap) {
    if (sMap[k] !== tMap[k]) return false;
  }

  return true;
};

/* 704. Binary Search
   I: nums = [-1,0,3,5,9,12], target = 9
   O: 4
   T/S: O(log n) time and O(1) space
   nums are always sorted
   solution must run in O(log n) time
   return -1 if target does not exist in nums list
*/
const binarySearch = (nums, target) => {
  let l = 0, r = nums.length -1;

  while (l <= r) { // <= bc when odd length nums list, the target num might be the middle index
    const mid = l + Math.floor((r - l) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] > target) r--;
    if (nums[mid] < target) l++;
  }

  return -1;
};

/* 733. Flood Fill
   I: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
   O: [[2,2,2],[2,2,0],[2,0,1]]
   T/S: O(n x m) time and space where n is rows and m is columns (effectively linear time and space)
*/
const floodFill = (image, sr, sc, color) => {
  const old = image[sr][sc];
  if (old === color) return image; // starting point already = new color

  function dfs(x, y) {
    // if curr point is out of bounds or if color isn't same as old color we are changing, return
    if (x < 0 || x >= image.length || y < 0 || y >= image[0].length || image[x][y] !== old) {
      return;
    }
    image[x][y] = color;
    dfs(x + 1, y);
    dfs(x - 1, y);
    dfs(x, y + 1);
    dfs(x, y - 1);
  }

  dfs(sr, sc);
  return image;
};

/* 53. Maximum Subarray
   I: nums = [-2,1,-3,4,-1,2,1,-5,4]
   O: 6
    the subarray [4,-1,2,1] has the largest sum 6
   T/S: O(n) time and O(1) space
*/
const maxSubArray = (nums) => {
  let max = nums[0],
      curr = 0;

  for (const num of nums) {
    if (curr < 0) curr = 0; // ignore negative sums, effectively moving left pointer
    curr += num;
    max = Math.max(max, curr);
  }

  return max;
};

/*
  235. Lowest Common Ancestor of a Binary Search Tree
  I: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
  O: 6
  T/S: O(n) time and space where n = height of tree
*/
const lowestCommonAncestorBST = (root, p, q) => {
  if (!root || !p || !q) return null;
  if (Math.max(p.val, q.val) < root.val) return lowestCommonAncestorBST(root.left, p, q);
  if (Math.min(p.val, q.val) > root.val) return lowestCommonAncestorBST(root.right, p, q);
  return root;
};

// O(n) time and O(1) space
const lowestCommonAncestorIterative = (root, p, q) => {
  let curr = root;

  while (curr) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }
}

/*
  57. Insert Interval
  I: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
  O: [[1,2],[3,10],[12,16]]
  T/S: O(n) time and O(1) space not including output list (O(n) if considering that)
*/
const insertInterval = (intervals, newInterval) => {
  let i = 0,
      res = [];

  // handle intervals that end before the new interval starts
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]);
    i++;
  }
  // handle overlapping intervals
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval = [
      Math.min(intervals[i][0], newInterval[0]),
      Math.max(intervals[i][1], newInterval[1])
    ];
    i++;
  }

  res.push(newInterval);

  // handle intervals that start after overlapping interval ends
  while (i < intervals.length) {
    res.push(intervals[i]);
    i++;
  }

  return res;
};

/*
  542. 01 Matrix
  I: mat = [[0,0,0],[0,1,0],[1,1,1]]
  O: [[0,0,0],[0,1,0],[1,2,1]]
  return the distance of the nearest 0 for each cell, mat is guaranteed to have >= 1 zero
  multi source BFS solution
  T/S: O(m * n) time where m = # rows and n = # cols and O(m * n) space due to queue
*/
const updateMatrix = (mat) => {
  const rows = mat.length,
        cols = mat[0].length,
        directions = [[0, 1], [0, -1], [1, 0], [-1, 0]],
        queue = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (mat[i][j] === 0) queue.push([i, j]);
      else mat[i][j] = Infinity; // important step
    }
  }

  while (queue.length > 0) {
    const [row, col] = queue.shift();

    for (const [nr, nc] of directions) {
      const newRow = row + nr;
      const newCol = col + nc;

      // the + 1 is so we only update when we find a shorter path than already exists (shortest path relaxation)
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && mat[newRow][newCol] > mat[row][col] + 1) {
        mat[newRow][newCol] = mat[row][col] + 1;
        queue.push([newRow, newCol]);
      }
    }
  }

  return mat;
};

/*
  973. K Closest Points to Origin
  I: points = [[1,3],[-2,2]], k = 1
  O: [-2, 2]
  T/S:
*/
const kClosest = (points, k) => {};

/*
  110. Balanced Binary Tree
  I: root = [3,9,20,null,null,15,7]
  O: true
  T/S: O(n) time and O(h) space where n = # of nodes and h = height
*/
const isBalanced = (root) => {
  if (!root) return true; // edge case of empty tree

  function dfs(node) {
    if (!node) return 0;
    const leftHeight = dfs(node.left);
    const rightHeight = dfs(node.right);
    // if a subtree is unbalanced or if current subtree height diff is greater than one, return -1 (how we are choosing to store "unbalanced")
    if (leftHeight < 0 || rightHeight < 0 || Math.abs(leftHeight - rightHeight) > 1) return -1;
    return Math.max(leftHeight, rightHeight) + 1;
  }

  return dfs(root) >= 0;
};

// here is neetcode's dfs solution. it returns a tuple [1 or 0, height] with 1 or 0 = T or F
// more production grade code vs the -1 solution above
// O(n) time and O(h) space
const isBalancedNeetcode = (root) => {
  // declaring this dfs helper outside of the parent function was more time efficient on LC
  const dfs = (root) => {
    if (!root) return [1, 0];

    const left = dfs(root.left);
    const right = dfs(root.right);

    const balanced =
      left[0] === 1 &&
      right[0] === 1 &&
      Math.abs(left[1] - right[1]) <= 1;
    const height = 1 + Math.max(left[1], right[1]);

    return [balanced ? 1 : 0, height];
  };

  return dfs(root)[0] === 1;
};

/*
  141. Linked List Cycle
  I: head = [3,2,0,-4]
  O: true
  T/S:
*/
const hasCycle = (head) => {
  let slow = head,
      fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
};

/*
  232. Implement Queue using Stacks
  I: ["MyQueue", "push", "push", "peek", "pop", "empty"]
  O: [[], [1], [2], [], [], []]
  can only use standard operations of a stack (push, pop, size, is empty)
  amortized time complexity must be O(1) for push and pop of the queue
  T:
    O(1) for initialization
    O(1) for push() and empty() calls
    O(1) amortized for pop() and peek() calls
  S:
    O(n)
*/
class MyQueue {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }

  push(x) {
    this.s1.push(x);
  }

  // the first pop after many pushes will be O(n) time but subsequent pops will be O(1) time
  pop() {
    if (this.s2.length === 0) {
      while (this.s1.length > 0) {
        this.s2.push(this.s1.pop());
      }
    }
    return this.s2.pop();
  }

  peek() {
    if (this.s2.length === 0) {
      while (this.s1.length > 0) {
        this.s2.push(this.s1.pop());
      }
    }
    return this.s2[this.s2.length - 1];
  }

  empty() {
    return this.s1.length === 0 && this.s2.length === 0;
  }
}

/*
  278. First Bad Version
  I: n = 5 (list of versions), bad = 4
   suppose you have n versions [1, 2, ..., n]
  O: 4
  you are given an api bool isBadVersion(version) which returns whether version is bad
  minimize calls to the api
  T: O(log n)
  S: O(1)
*/
const firstBadVersion = function(isBadVersion) {
  return function(n) {
    let left = 1, right = n;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (isBadVersion(mid)) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    return left;
  }
};

/*
  383. Ransom Note
  return true if ransomNote can be constructed by using the letters from magazine. each letter of magazine can only be used once
  I: ransomNote = "aa", magazine = "aab"
  O: true
  T/S: O(m + n) time and O(1) space (O(26) -> O(1))
*/
const canConstruct = (ransomNote, magazine) => {
  if (ransomNote.length > magazine.length) {
    return false;
  }

  const map = new Map();

  for (const char of magazine) {
    map[char] = (map[char] || 0) + 1;
  }

  for (const char of ransomNote) {
    if (!map[char] || map[char] <= 0) {
      return false;
    }

    map[char]--;
  }

  return true;
};

/*
  3. Longest Substring Without Repeating Characters
  I: pwwkew
  O: 3 (wke or kew)
  T/S: O(n) time and O(m) space where n = length of s and m = number of unique chars in s
*/
const lengthOfLongestSubstring = (s) => {
  const windowSet = new Set();
  let l = 0, res = 0;

  for (let r = 0; r < s.length; r++) {
    while (windowSet.has(s[r])) {
      windowSet.delete(s[l]);
      l++;
    }
    windowSet.add(s[r]);
    res = Math.max(res, r - l + 1);
  }
  return res;
};

/*
  15. 3Sum
  I: [-1,0,1,2,-1,-4]
  O: [[-1,-1,2],[-1,0,1]]
  T/S: O(n^2) time and O(1) space not including the output list
*/
const threeSum = (nums) => {
  nums.sort((a, b) => a - b);
  const res = [];

  for (let i = 0; i < nums.length; i++) {
    // solution fails without these edge case checks for the example input, returns two [-1, 0, 1]
    if (nums[i] > 0) break;
    if (nums[i] === nums[i - 1]) continue; // skip duplicates for i pointer
    let l = i + 1,
        r = nums.length - 1;

    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum > 0) r--;
      else if (sum < 0) l++;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        l++;
        r--;
        // skip duplicates for l pointer
        while (l < r && nums[l] === nums[l - 1]) {
          l++;
        }
      }
    }
  }

  return res;
};

/*
  102. Binary Tree Level Order Traversal
  I: root = [1,2,3,4,5,6,7]
  O: [[1],[2,3],[4,5,6,7]]
  T/S: O(n) time and space
*/
const levelOrder = (root) => {
  const res = [];
  if (!root) return res;

  const q = new Queue(); // assume we have a queue implementation
  q.push(root);

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

/*
I: adjList = [[2,4],[1,3],[2,4],[1,3]]
  each node's value is the same as the node's index (1-indexed)
  so for the first node, its val = 1 and its neighbors are the 2nd and 4th nodes
O: [[2,4],[1,3],[2,4],[1,3]]
T/S:
*/
const cloneGraph = (node) => {
  const oldToNewMap = new Map();

  const clone = (node) => {
    if (!node) return null;

    if (oldToNewMap.has(node)) {
      return oldToNewMap.get(node);
    }

    const copy = new Node(node.val);
    oldToNewMap.set(node, copy);

    for (const n of node.neighbors) {
      copy.neighbors.push(clone(n));
    }

    return copy;
  }

  return clone(node);
};

/*
  150. Evaluate Reverse Polish Notation
  I: tokens: string[]
     ["2","1","+","3","*"] | ["4","13","5","/","+"]
  O: ((2 + 1) * 3) = 9 | (4 + (13 / 5)) = 6
  The division between two integers always truncates toward zero
  input is guaranteed to be able to be evaluated in RPN
  T/S: O(n) time and space
*/
const evalRPN = (tokens) => {
  const stack = [];

  for (const t of tokens) {
    if (t === '+') {
      stack.push(stack.pop() + stack.pop());
    } else if (t === '-') {
      const y = stack.pop(), // x is left/first num, y is right/second
            x = stack.pop();
      stack.push(x - y);
    } else if (t === '*') {
      stack.push(stack.pop() * stack.pop());
    } else if (t === '/') {
      const y = stack.pop();
      const x = stack.pop();
      stack.push(Math.trunc(x / y));
    } else {
      stack.push(parseInt(t));
    }
  }

  return stack[0];
};

/*
  207. Course Schedule
  I: numCourses = 2, prerequisites = [[1,0]]
  O: true
  prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a
  T/S:
*/
const canFinish = (numCourses, prerequisites) => {
  // create map for prereqs
  const prereqMap = new Map();
  for (let i = 0; i < numCourses; i++) {
    prereqMap.set(i, []);
  }
  for (const [course, prereq] of prerequisites) {
    prereqMap.get(course).push(prereq);
  }

  // create set for each dfs call to detect cycles
  const visiting = new Set();

  const dfs = (course) => {
    if (visiting.has(course)) return false; // cycle/loop detected
    if (prereqMap.get(course).length === 0) return true; // no prereqs or already checked course

    visiting.add(course);

    for (const prereq of prereqMap.get(course)) {
      if (!dfs(prereq)) return false;
    }

    visiting.delete(course);
    prereqMap.set(course, []);

    return true;
  };

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }

  return true;
};

/*
  70: Climbing Stairs
  I: n = 3
  O: 3 (1 + 1 + 1, 1 + 2, 2 + 1)
  T/S:
  uses the Fibonacci pattern: ways(n) = ways(n-1) + ways(n-2). one tracks ways to current step; two tracks ways to previous step
*/
const climbStairs = (n) => {
  // initialize first two fib values
  let curr = 1,
      prev = 1;

  // only need to iterate thru n - 1 to reach F(n). starting at k=1, need n - 1 steps to reach k=n
  for (let i = 0; i < n - 1; i++) {
    const temp = curr;
    curr = curr + prev;
    prev = temp;
  }

  return curr;
};

/*
  409. Longest Palindrome
  I: s = "abccccdd"
  O: 7 (dccaccd)
  T/S: O(n) time and space

  input consists of lowercase OR uppercase letters
  palindrome is case sensitive, "Aa" !== valid palindrome for this problem
*/
const longestPalindrome = (s) => {
  const freqMap = {};
  let res = 0;

  for (const char in s) {
    freqMap[char] = (freqMap[char] || 0) + 1;
    if (freqMap[char] % 2 === 0) res += 2;
  }

  return s.length > res ? res + 1 : res; // can we add an unmatched char so pal length is odd
};

/*
  206. Reverse Linked List
  I: head = [1,2,3,4,5]
  O: [5,4,3,2,1]
  T/S: O(n) time and O(1) space
*/
const reverseLinkedList = (head) => {
  let prev = null,
      curr = head;

  while (curr) {
    const temp = curr.next;
    // update 'next' link
    curr.next = prev;
    // move pointers
    prev = curr;
    curr = temp;
  }

  return prev;
};

/*
  98. Validate Binary Search Tree
  I: root = [2,1,3]
  O: true
  T/S:
*/
const isValidBST = (root) => {
  const dfs = (node, left, right) => {
    if (!node) return true;
    if (!(left < node.val && node.val < right)) return false; // node val must be inbetween min and max values
    return (
      dfs(node.left, left, node.val) &&
      dfs(node.right, node.val, right)
    )
  };

  return dfs(root, -Infinity, Infinity);
};

/*
  238. Product of Array Except Self
  I: nums = [1,2,3,4]
  O: [24,12,8,6]
  T/S: O(n) time and O(1) space (not including output array)
  You must write an algorithm that runs in O(n) time and without using the division operation.
*/
const productExceptSelf = (nums) => {
  const res = new Array(nums.length).fill(1);

  let pre = 1;
  for (let i = 0; i < nums.length; i++) {
    res[i] = pre;
    pre *= nums[i];
  }

  let post = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] *= post;
    post *= nums[i];
  }

  return res;
};

/*
  200. Number of Islands
  I:
  O:
  T/S: O(m * n) time and space
*/
const numIslands = (grid) => {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]],
        rws = grid.length,
        cls = grid[0].length;
  let res = 0;

  const dfs = (r, c) => {
    if (r < 0 || r >= rws || c < 0 || c >= cls || grid[r][c] === '0') return;
    grid[r][c] = '0';
    for (const [x, y] of directions) {
      dfs(r + x, c + y);
    }
  };

  for (let i = 0; i < rws; i++) {
    for (let j = 0; j < cls; j++) {
      if (grid[i][j] === '1') {
        dfs(i, j);
        res++;
      }
    }
  }

  return res;
};

/*
  994. Rotting Oranges
  I: [[2,1,1],[1,1,0],[0,1,1]]
  O: 4
  '0' = empty cell, '1' = fresh orange, '2' = rotten orange
  T/S: O(m * n) time and space
*/
const orangesRotting = (grid) => {
  let time = 0,
      fresh = 0;

  const queue = [],
        rows = grid.length,
        cols = grid[0].length;

  for (let i = 0; i < rows; i ++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        fresh++;
      }
      if (grid[i][j] === 2) {
        queue.push([i, j]);
      }
    }
  }

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0 && fresh > 0) {
    const lvlSize = queue.length; // need to store as a var for each turn, otherwise time only gets incremented once
    for (let i = 0; i < lvlSize; i++) {
      const [r, c] = queue.shift() // assume we have a queue implementation with constant time operations

      for (const [x, y] of directions) {
        const row = r + x;
        const col = c + y;

        if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] !== 1) continue;
        // if cell is in bounds and a fresh orange, make rotten
        grid[row][col] = 2;
        queue.push([row, col]);
        fresh--;
      }
    }

    time++;
  }

  return fresh === 0 ? time : -1;
};

/*
  322. Coin Change
  I: coins = [1,2,5], amount = 11
  O: 3 (5 + 5 + 1)
  Return the fewest number of coins that you need to make up that amount (or -1 if impossible)
  You may assume that you have an infinite number of each kind of coin
  T/S: O(n * t) time and O(t) space where n = num coins and t = given amount
*/
const coinChange = (coins, amount) => {
  // bottom up DP solution
  const dp = new Array(amount + 1).fill(amount + 1); // the fill arg is just a max number, could also use .fill(Infinity)
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const c in coins) {
      if (a - c >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - c]);
      }
    }
  }

  return dp[amount] !== amount + 1 ? dp[amount] : -1;
};

/*
  33. Search in Rotated Sorted Array
  I: nums = [4,5,6,7,0,1,2], target = 0
  O: 4
  Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.
  You must write an algorithm with O(log n) runtime complexity.
  T/S: O(log n) time and O(1) space
*/
const rotatedSearch = (nums, target) => {
  let l = 0,
      r = nums.length - 1;

  while (l <= r) {
    const mid = Math.floor((l + r) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // left window is sorted
    if (nums[l] <= nums[mid]) {
      // if target is outside of left window's range
      if (target > nums[mid] || target < nums[l]) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    } else { // right window is sorted
      // if target is outside of right window's range
      if (target < nums[mid] || target > nums[r]) {
        r = m - 1;
      } else {
        l = m + 1;
      }
    }
  }

  return -1;
};

/*
  39: Combination Sum
  I: candidates = [3,2,7,6], target = 7
  O: [[2,2,3],[7]]
  The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
  T/S: O(2^t/m) time and O(t/m) space where t = target and m = min value in nums
    - binary tree with two choices at each level, depth = t/m in the worst case
*/
const combinationSum = (nums, target) => {
  const res = [];

  const dfs = (i, cur, total) => {
    if (total === target) {
      res.push([...cur]); // push copy
      return;
    }
    if (i >= nums.length || total > target) {
      return;
    }

    cur.push(nums[i]);
    dfs(i, cur, total + nums[i]); // include curr num
    cur.pop();
    dfs(i + 1, cur, total); // skip curr num
  };

  dfs(0, [], 0);
  return res;
};

// same worst case time complexity but better average
const combinationSumOptimal = (nums, target) => {
  const res = [];
  nums.sort((a, b) => a - b);

  const dfs = (i, cur, total) => {
    if (total === target) {
      res.push([...cur]);
      return;
    }

    for (let j = i; j < nums.length; j++) {
      if (total + nums[j] > target) { // early pruning due to sorted nums
        return;
      }
      cur.push(nums[j]);
      dfs(j, cur, total + nums[j]);
      cur.pop(); // backtracking cleanup
    }
  };

  dfs(0, [], 0);
  return res;
};

/*
  46. Permutations
  I: [1,2,3]
  O: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
  T/S: O(n! * n^2) time and O(n! * n) space
*/
const permute = (nums) => {
  let perms = [[]];

  for (const num of nums) {
    const newPerms = [];
    for (const p of perms) {
      for (let i = 0; i <= p.length; i++) {
        const copy = p.slice();
        copy.splice(i, 0, num);
        newPerms.push(copy);
      }
    }
    perms = newPerms;
  }

  return perms;
};

/*
  56. Merge Intervals
  I: [[1,3],[2,6],[8,10],[15,18]]
  O: [[1,6],[8,10],[15,18]]
  I: [[4,7],[1,4]]
  O: [[1, 7]]
  intervals[i] = [starti, endi]
  T/S: O(nlogn) time and O(1) or O(n) space depending on sort algo
*/
const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];

  for (const [start, end] of intervals) {
    const lastEnd = res[res.length - 1][1];

    // if overlapping, update last intervals end
    if (start <= lastEnd) {
      res[res.length - 1][1] = Math.max(lastEnd, end);
    } else {
      res.push([start, end]);
    }
  }

  return res;
};

/*
  236. Lowest Common Ancestor of a Binary Tree
  I: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
  O: 3
  T/S:
*/
const lowestCommonAncestor = (root, p, q) => {
  if (!root || root === p || root === q) {
    return root;
  }

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) {
    return root;
  }

  return left ? left : right;
};

/*
  169. Majority Element
  I: nums = [3,2,3]
  O: 3
  The majority element is the element that appears more than ⌊n / 2⌋ times
  You may assume that the majority element always exists in the array
  Follow-up: Could you solve the problem in linear time and in O(1) space?
  Map T/S: O(n) time and space
  Optimal T/S: O(n) time and O(1) space
*/
// this is a good example of a solution that is so much cleaner / more readable in Python than JS (see Python hash solution here: https://neetcode.io/problems/majority-element?list=neetcode250)
const majorityElementHashMap = (nums) => {
  const count = new Map();
  let res = 0,
      maxCount = 0;

  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
    if (count.get(num) > maxCount) {
      res = num;
      maxCount = count.get(num);
    }
  }

  return res;
};

// Boyer-Moore Voting Algorithm, based on the fact that we know a majority element always exists
const majorityElementOptimal = (nums) => {
  let res = 0,
      count = 0;

  for (const num of nums) {
    if (count === 0) {
      res = num;
    }

    // increment or decrement depending on if curr num is same as curr res num
    count += num === res ? 1 : -1;
  }

  return res;
};

/*
  67. Add Binary
  I: a = "11", b = "1"
  O: "100"
  a and b consist only of '0' or '1' characters.
  T/S: O(max(m, n)) time and space
*/
const addBinaryOptimal = (a, b) => {
  let res = [],
      carry = 0
      i = a.length - 1,
      j = b.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    // - '0' is just converting char from string to num
    const digitA = i >= 0 ? a[i] - '0' : 0;
    const digitB = j >= 0 ? b[j] - '0' : 0;
    const total = digitA + digitB + carry;
    res.push(total % 2);
    carry = Math.floor(total / 2);
    i--;
    j--;
  }

  res.reverse();
  return res.join('');
};

/*
  876. Middle of the Linked List
  I: head = [1,2,3,4,5,6]
  O: [4,5,6]
    Given the head of a singly linked list, return the middle node of the linked list
    If there are two middle nodes, return the second middle node
  T/S: O(n) time and O(1) space
*/
const middleNode = (head) => {
  let slow = head, fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
};

/*
  543. Diameter of Binary Tree
  I: [1,2,3,4,5]
  O: 3
    The diameter of a binary tree is the length of the longest path between any two nodes in a tree
    This path may or may not pass through the root
    The length of a path between two nodes is represented by the number of edges between them

    Neetcode note: for any given node, the longest path that passes through it is the sum of the height of its left subtree and the height of its right subtree
  T/S: O(n) time and O(h) space
*/
const diameterOfBinaryTree = (root) => {
  let res = 0;

  const dfs = (node) => {
    if (node === null) return 0;

    const left = dfs(node.left);
    const right = dfs(node.right);

    res = Math.max(res, left + right); // keep track of longest diameter seen so far
    return 1 + Math.max(left, right); // return longest height at this node
  }

  dfs(root);
  return res;
};

/*
  75. Sort Colors
  I: nums = [2,0,2,1,1,0]
  O: [0,0,1,1,2,2] (solution actually returns void since it should sort input array in place)
    Sort the array in-place such that elements of the same color are grouped together and arranged in the order: red (0), white (1), and then blue (2)
    You cannot use any built in sorting functions

    Follow up: Could you come up with a one-pass algorithm using only constant extra space?
  T/S: O(n) time and O(1) space
*/
const sortColors = (nums) => {
  let i = 0,
      l = 0,
      r = nums.length - 1;

  while (i <= r) {
    if (nums[i] === 0) { // swap and increment
      [nums[l], nums[i]] = [nums[i], nums[l]];
      l++;
      i++;
    } else if (nums[i] === 2) { // swap but don't increment, need to check the num that we swapped the 2 for
      [nums[i], nums[r]] = [nums[r], nums[i]];
      r--;
    } else { // skip 1s
      i++;
    }
  }
};

/*
  155. Min Stack
  I: ["MinStack","push","push","push","getMin","pop","top","getMin"]
     [[],[-2],[0],[-3],[],[],[],[]]
  O: [null,null,null,null,-3,null,0,-2]
    Design a stack that supports push, pop, top, and retrieving the minimum element
    All operations must run in constant time
  T/S:
*/
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    // could declare a new var here, or overwrite the input var, or just use a ternary directly in the minStack.push
    val = Math.min(
      val,
      this.minStack.length ? this.minStack[this.minStack.length - 1] : val
    )
    this.minStack.push(val);
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

/*
  139. Word Break
  I: s = "leetcode", wordDict = ["leet","code"]
  O: true
    Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words
    Note that the same word in the dictionary may be reused multiple times in the segmentation
  T/S: O(n * m * t) time and O(n) space, where n = s.length, m = wordDict.length, and t = length of longest word in wordDict
*/

const wordBreak = (s, wordDict) => {
  const dp = new Array(s.length + 1).fill(false);
  dp[s.length] = true;

  for (let i = s.length - 1; i >= 0; i--) {
    for (const w of wordDict) {
      if (
        i + w.length <= s.length &&
        s.slice(i, i + w.length) === w
      ) {
        dp[i] = dp[i + w.length];
      }

      if (dp[i]) break;
    }
  }

  return dp[0];
};

/*
  217. Contains Duplicate
  I: nums = [1,2,3,1]
  O: true
    Aim to find a solution that runs in linear time and space
  T/S: O(n) time and space
*/
const containsDuplicate = (nums) => {
  // one line solution:
  // return new Set(nums).size < nums.length;
  const set = new Set();

  for (const n of nums) {
    if (set.has(n)) return true;
    set.add(n);
  }

  return false;
};

/*
  104. Maximum Depth of Binary Tree
  I: root = [3,9,20,null,null,15,7]
  O: 3
  T/S:
*/
const maxDepthBT = (root) => {
  if (!root) return 0;
  return 1 + Math.max(maxDepthBT(root.left), maxDepthBT(root.right));
};

/*
  62. Unique Paths
  I: m = 3, n = 6 | m = 3, n = 2
  O: 21 | 3
    The robot can only move either down or right at any point in time
  T/S: O(m * n) time and O(n) space
    This is the bottom up, space optimized DP solution (optimizes a 2D DP table into 1D by reusing the array)
*/
const uniquePaths = (m, n) => {
  const dp = new Array(n).fill(1); // basically creating the bottom most row (all 1s) and working up and to the left

  // we skip m - 1 column and n - 1 row (the bottom most row and right most column) bc all values are 1
  // important to iterate in this order
  for (let i = m - 2; i >= 0; i--) {
    for (let j = n - 2; j >= 0; j--) {
      dp[j] += dp[j + 1]; // dp[j] is the down value and dp[j + 1] is the right value. we store and update down value dp[j] in place as we go
    }
  }

  return dp[0];
};

/*
  416. Partition Equal Subset Sum
  I: nums = [1,5,11,5]
  O: true ([1,5,5] and [11])
    Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or false otherwise
    NC note: if sum of elements is not even, output = false. each subset will equal 1/2 the total sum
  T/S: O(n * target) time and O(n) space
*/
// this solution is more understandable imo than the dp optimized and is what nc used in his video
const canPartitionDPHashSet = (nums) => {
  const sum = nums.reduce((acc, num) => acc + num, 0);
  if (sum % 2 !== 0) return false;

  let dp = new Set();
  dp.add(0);
  const target = sum / 2;

  for (let i = nums.length - 1; i >= 0; i--) {
    const nextDp = new Set();

    for (const t of dp) {
      if (t + nums[i] === target) return true;
      nextDp.add(t + nums[i]);
      nextDp.add(t);
    }

    dp = nextDp;
  }

  return false;
};

// same time and space complexity as dp hash solution
const canPartitionDPOptimal = (nums) => {
  const sum = nums.reduce((acc, num) => acc + num, 0);
  if (sum % 2 !== 0) return false;

  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);

  dp[0] = true;

  for (let i = 0; i < nums.length; i++) {
    for (let j = target; j >= nums[i]; j--) {
      dp[j] = dp[j] || dp[j - nums[i]];
    }
  }

  return dp[target];
};

/*
  199. Binary Tree Right Side View
  I: root = [1,2,3,null,5,null,4]
  O: [1,3,4]
  T/S: O(n) time and space
    BFS solution
*/
const rightSideView = (root) => {
  const res = [];
  const q = new Queue();

  q.push(root);

  while(!q.isEmpty()) {
    let rightSide = null;
    const lvlSize = q.size();

    for (let i = 0; i < lvlSize; i++) {
      const node = q.pop();
      if (node) {
        rightSide = node;
        q.push(node.left);
        q.push(node.right);
      }
    }

    if (rightSide) {
      res.push(rightSide.val);
    }
  }

  return res;
};

/*
  5. Longest Palindromic Substring
  I: "babad" | "cbbd"
  O: "bab" | "bb"
  T/S:
    O(n^2) time and O(1) extra space
    O(n) space if storing res string instead of resLen
*/
const longestPalindromeSubString = (s) => {
  let resInd = 0, resLen = 0;

  // odd length palindrome check
  for (let i = 0; i < s.length; i++) {
    let l = i, r = i;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > resLen) {
        resInd = l;
        resLen = r - l + 1;
      }
      // expand outward
      l--;
      r++;
    }

    // even length palindrome check
    l = i, r = i + 1;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      if (r - l + 1 > resLen) {
        resInd = l;
        resLen = r - l + 1;
      }
      // expand outward
      l--;
      r++;
    }
  }

  return s.substring(resInd, resInd + resLen);
};

/*
  78. Subsets
  I: nums = [0]
  O: [[], [0]]
    The solution set must not contain duplicate subsets. Return the solution in any order
  T/S: O(n * 2^n) time and O(n) extra space (but O(2^n) for the output list)
*/
// backtracking solution, two choices at each num, include or not include
const subsets = (nums) => {
  const res = [];
  const subset = [];

  const dfs = (i) => {
    // base case: we've reached the end of this decision tree
    if (i >= nums.length) {
      res.push([...subset]);
      return;
    }

    // include curr num
    subset.push(nums[i]);
    dfs(i + 1);
    // don't include curr num
    subset.pop();
    dfs(i + 1);
  }

  dfs(0);
  return res;
};

/*
  11. Container With Most Water
  I: [1,7,2,5,4,7,3,6]
  O: 36
  T/S: O(n) time and O(1) space
    Two pointers solution
*/
const maxArea = (heights) => {
  let res = 0,
      l = 0,
      r = heights.length - 1;

  while (l < r) {
    const area = (r - l) * Math.min(heights[l], heights[r]);
    res = Math.max(res, area);
    if (heights[l] < heights[r]) l++;
    else r--;
  }

  return res;
};
