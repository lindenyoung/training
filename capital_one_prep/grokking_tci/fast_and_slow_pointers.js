// Linked list cycle
// O(n) time and O(1) space
const hasCycle = (head) => {
  let slow = head,
      fast = head

  // use fast pointer as iterating condition since it will hit end of LL first (if end exists)
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next

    if (slow === fast) return true
  }

  return false
}

// Find the middle node of a linked list (if # of nodes is even, return the second middle node)
// Input: 1 -> 2 -> 3 -> 4 -> 5 -> null
// Output: 3
// O(n) time and O(1) space
const middleOfLinkedList = (head) => {
  let slow = head,
      fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  return slow
}

// Linked List Cycle II - Leetcode 142
// O(n) time and O(1) space
const findCycleStart = (head) => {
  let slow = head,
      fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next

    // if we find a cycle
    if (slow === fast) {
      slow = head

      // distance from where the nodes first meet to the start of cycle is same as distance from head node to start of cycle (R = D), see LC solution for math breakdown
      while (slow !== fast) {
        slow = slow.next
        fast = fast.next
      }

      return slow
    }
  }

  return null
}

// Happy number - Leetcode 202
// O(log n) time (kinda tricky to determine this) and O(1) space
const happyNumber = (num) => {
  let slow = num,
      fast = num

  while (true) {
    slow = doMath(slow) // move one step
    fast = doMath(doMath(fast)) // move two steps

    // exit condition when we find the cycle
    if (slow === fast) break
  }

  return slow === 1

  // helper func to sum the squares of digits
  function doMath(n) {
    let sum = 0

    while (n > 0) {
      const digit = n % 10
      sum += digit * digit
      n = Math.floor(n / 10)
    }

    return sum
  }
}

// Palindrome linked list - leetcode 234
// Constraints:
// - solution should be O(n) time and O(1) space
const isPalindromeLL = (head) => {
  if (!head || !head.next) return true
  
  let slow = head,
      fast = head

  // Floyd's algo to find the middle node
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  let prev = slow
  prev.next = null
  slow = slow.next

  // reverse second half of ll
  while (slow) {
    const temp = slow.next
    slow.next = prev
    prev = slow
    slow = temp
  }

  fast = head // first half head
  slow = prev // second half reversed head

  // compare first and second halves
  while (slow) {
    if (fast.val !== slow.val) return false
    else {
      slow = slow.next
      fast = fast.next
    }
  }

  return true
}

// Reorder linked list - leetcode 143
// Do not return anything, modify input ll in-place and solution must be O(1) space
const reorderList = (head) => {
  // floyd's to find middle node
  let slow = head,
      fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  // reverse second half
  let prev = null,
      curr = slow.next

  while (curr) {
    const temp = curr.next
    curr.next = prev
    prev = curr
    curr = temp
  }

  slow.next = null

  // reorder the two halves
  let h1 = head,
      h2 = prev

  while (h2) {
    // creative way to rotate the merge from left to right halves
    const temp = h1.next
    h1.next = h2
    h1 = h2
    h2 = temp
  }
}
