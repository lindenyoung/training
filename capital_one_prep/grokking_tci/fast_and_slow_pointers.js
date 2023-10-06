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
