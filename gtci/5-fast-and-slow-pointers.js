// FAST & SLOW POINTERS = HARE & TORTOISE ALGORITHM
  // useful when dealing with cyclic LL's or arrays

// LL CYCLE
// O(n) time and o(1) space

class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

function hasCycleLL(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    fast = fast.next.next; // increment fast pointer by 2
    slow = slow.next;
    if (slow === fast) return true; // found cycle condition
  }
  return false; // no cycle found - fast pointer reached end of LL
}

/* - - - - - - - - - - - - - - - - - - - - */

// START OF LL CYCLE
// find length (k) of cycle, then use two pointers with second being k ahead of first
// O(n) time and O(1) space

function cycleStartLL(head) {
  cycleLength = 0;
  // find LL cycle
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow === fast) {
      cycleLength = calculateCycleLength(slow);
      break;
    }
  }
  return findStart(head, cycleLength);
  // return cycleLength > 0 ? findStart(head, cycleLength) : 'LL does not contain a cycle';
}

// helper function to find length of cycle
function calculateCycleLength(slow) {
  let current = slow;
  let cycleLength = 0;

  while (true) {
    current = current.next;
    cycleLength++;
    if (current === slow) break;
  }
  return cycleLength;
}

// helper function to find start of cycle given its length
function findStart(head, cycleLength) {
  let pointerOne = head;
  let pointerTwo = head;

  // move pointerTwo ahead by cycleLength nodes
  while (cycleLength > 0) {
    pointerTwo = pointerTwo.next;
    cycleLength--;
  }

  // increment both pointers until they meet - will always meet at start node of cycle
  while (pointerOne !== pointerTwo) {
    pointerOne = pointerOne.next;
    pointerTwo = pointerTwo.next;
  }

  return pointerOne;
}

/* - - - - - - - - - - - - - - - - - - - - */

// HAPPY NUMBER

function findHappyNumber(num) {
  let slow = num;
  let fast = num;

  while (true) {
    slow = findSquareSum(slow); // move one step
    fast = findSquareSum(findSquareSum(fast)); // move two steps
    if (slow === fast) break; // found the cycle
  }
  return slow === 1; // see if cycle is stuck on num 1
}

// helper function to find square sum
function findSquareSum(num) {
  let sum = 0;
  while (num > 0) {
    const digit = num % 10;
    sum += digit * digit;
    num = Math.floor(num / 10);
  }
  return sum;
}

/* - - - - - - - - - - - - - - - - - - - - */

// MIDDLE NODE OF LL

function findMiddleOfLL(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}