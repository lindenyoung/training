// 1 - FIRST BAD VERSION

const firstBadVersion = (n) => {
  let minVersion = null;
  let start = 1;
  let end = n;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (isBadVersion(mid)) {
      minVersion = mid;
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return minVersion;
};

// helper function
function isBadVersion(num) {
  return num >= 4 ? true : false;
}

// 2 -  RANSOM NOTE
const ransomNote = (note, magazine) => {
  // create hash map for magazine letters and frequencies
  const magazineMap = {};

  for (let i = 0; i < magazine.length; i++) {
    const currLetter = magazine[i];
    if (magazineMap[currLetter]) {
      magazineMap[currLetter]++;
    } else {
      magazineMap[currLetter] = 1;
    }
  }

  // iterate over note, checking letters against magazine hash map
  for (let i = 0; i < note.length; i++) {
    const currLetter = note[i];
    if (!magazineMap[currLetter]) { // letter not in magazine
      return false;
    } else if (magazineMap[currLetter] < 1) { // not enough of letter in magazine
      return false;
    } else { // decrement letter count in map
      magazineMap[currLetter]--;
    }
  }

  return true;
};

// 3 - CLIMBING STAIRS
const climbStairs = (n) => {
  const cache = {
    0: 1,
    1: 1
  };
  if (n <= 1) return cache[n];
  for (let i = 2; i <= n; i++) {
    cache[i] = cache[i-1] + cache[i-2];
  }
  return cache[n];
};

// 4 - LONGEST PALINDROME

// 5 - REVERSE LINKED LIST
const reverseLL = (head) => {
  let curr = head;
  let prev = null;
  let next = null;

  while (curr) {
    next = curr.next; // store next node
    curr.next = prev; // flip pointer
    prev = curr;
    curr = next;
  }
  return prev; // new head of LL
};

// 6 - MAJORITY ELEMENT
const majorityElement = (nums) => {
  // edge case - array length of one
  if (nums.length === 1) return nums[0];

  const majority = nums.length / 2;
  const cache = {}; // how to make this solution constant space?

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];
    if (!cache[currNum]) {
      cache[currNum] = 1;
    } else {
      cache[currNum]++;
      // check for majority logic
      if (cache[currNum] > majority) return currNum;
    }
  }
};

// 7 - ADD BINARY
const addBinary = (a, b) => {
  const sum = BigInt(`0b${a}`) + BigInt(`0b${b}`);
  return sum.toString(2);
};

// 8 - DIAMETER OF BINARY TREE

// 9 - MIDDLE OF LINKED LIST
const middleOfLinkedList = (head) => {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
};

// 10 - MAX DEPTH OF BINARY TREE

// 11 - CONTAINS DUPLICATE
const containsDuplicateSort = (nums) => {
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) return true;
  }
  return false;
};

const containsDuplicateSet = (nums) => {
  const numsSet = new Set();

  for (let i = 0; i < nums.length; i++) {
    if numsSet.has(nums[i]) {
      return true;
    } else {
      numsSet.add(nums[i]);
    }
  }
  return false;
};

// 12 - MAX SUBARRAY