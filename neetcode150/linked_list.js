/**
 * 206: Reverse Linked List
 * Given the head of a singly linked list, reverse the list and return the reversed list
 * head = [1, 2, 3, 4, 5], return [5, 4, 3, 2, 1]
 * @param {ListNode} head 
 * @return {ListNode}
 * ListNode definition
 *   const ListNode = (val, next) => {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 *   }
 */
const reverseLinkedList = (head) => {
  // edge cases - empty LL or only 1 node
  if (head === null || head.next === null) return head

  let curr = head,
      prev = null

  while (curr) {
    const next = curr.next // store next node
    curr.next = prev // reverse pointer
    // move forward
    prev = curr 
    curr = next
  }

  return prev // curr will be null
}

/**
 * 21: Merge Two Sorted Lists
 * params = the heads of two sorted linked lists
 * list1 = [1, 2, 4], list2 = [1, 3, 4], return [1, 1, 2, 3, 4, 4]
 * @param {ListNode} list1 
 * @param {ListNode} list2 
 * @return {ListNode}
 */
// recursive solution
const mergeTwoLinkedLists = (list1, list2) => {
  // if either list is empty, return the other list
  if (list1 === null) return list2
  if (list2 === null) return list1

  // main logic, recursively calling the function with the next node
  if (list1.val <= list2.val) {
    list1.next = mergeTwoLinkedLists(list1.next, list2)
    return list1
  }

  if (list2.val <= list1.val) {
    list2.next = mergeTwoLinkedLists(list1, list2.next)
    return list2
  }
}

// iterative solution
const mergeTwoListsIterative = (list1, list2) => {
  let sentinel = tail = new ListNode(0)

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1
      list1 = list1.next
    } else {
      tail.next = list2
      list2 = list2.next
    }

    tail = tail.next
  }

  tail.next = list1 || list2 // remainder of non-empty list

  return sentinel.next
}

/**
 * 143: Reorder List
 * head = [1, 2, 3, 4], new head = [1, 4, 2, 3]
 * would be more readable to break down 3 parts into helper funcs
 * O(n) time and O(1) space
 * @param {ListNode} head 
 * @return {void} should modify head in-place and not return anything
 */
const reorderList = (head) => {
  // 1: find middle node - slow will be mid node after traversal
  let slow = head,
      fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  // 2: reverse second half of LL - prev will be the new head
  let prev = null,
      curr = slow // start reversal at mid node

  while (curr) { // standard LL reversal algorithm
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }

  // 3: merge the two halves
  let left = head,
      right = prev, // prev is head of reversed right half
      temp = null

  while (right.next) { // right half will either be shorter or same length as left
    // update and move from left
    temp = left.next
    left.next = right
    left = temp

    // update and move from right
    temp = right.next
    right.next = left
    right = temp
  }
}

/**
 * 141: Linked List Cycle
 * O(n) time, O(1) space
 * @param {ListNode} head 
 * @return {boolean} 
 */
const hasCycle = (head) => {
  if (!head || !head.next) return false

  // can either store a slow pointer var or just use the head instead
  let fast = head

  while (fast && fast.next) {
    head = head.next
    fast = fast.next.next
    if (head === fast) return true
  }

  return false
}

/**
 * 19: Remove Nth Node From End of List
 * head = [1, 2, 3, 4, 5], n = 2, return [1, 2, 3, 5]
 * head = [1, 2, 3, 4, 5], n = 5, return [2, 3, 4, 5]
 * @param {ListNode} head 
 * @param {number} n 
 * @return {ListNode}
 */
const removeNthFromEnd = (head, n) => {
  let slow = head,
      fast = head

  // move fast pointer so it is n length ahead of slow
  for (let i = 0; i < n; i++) {
    fast = fast.next
  }

  // edge case when n is the head node
  if (!fast) return head.next

  // will need slow's prev node so use fast.next instead of fast as while condition
  while (fast.next) {
    slow = slow.next
    fast = fast.next
  }

  // switch slow's next pointer to skip nth node
  slow.next = slow.next.next
  return head
}

/**
 * 138: Copy List with Random Pointer
 * Construct a deep copy of linked list with additional random pointers
 * @param {Node} head 
 * @return {Node}
 * function Node(val, next, random) {
 *  this.val = val
 *  this.next = next
 *  this.random = random
 * }
 */
const copyRandomList = (head) => {
  if (!head) return null

  const clones = new Map()
  let n = head

  while (n) {
    clones.set(n, new Node(n.val))
    n = n.next
  }

  n = head
  
  while (n) {
    clones.get(n).next = clones.get(n.next) || null
    clones.get(n).random = clones.get(n.random) || null
    n = n.next
  }

  return clones.get(head)
}

/**
 * 2: Add Two Numbers
 * https://leetcode.com/problems/add-two-numbers/solutions/3077723/only-4-lines-of-code-high-level-solution-explained-all-coding-steps/
 * @param {ListNode} l1 
 * @param {ListNode} l2 
 * @return {ListNode}
 */
const addTwoNumbers = (l1, l2, carry = 0) => {
  if (!l1 && !l2 && !carry) return null

  const total = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + (carry || 0)
  carry = parseInt(total / 10)
  return new ListNode(total % 10, addTwoNumbers(l1?.next, l2?.next, carry))
}

/**
 * 287: Find the Duplicate Number
 * only one repeated num in nums, return the repeated num
 * must solve without modifying the input array and in constant space
 * Floyd's cycle detection algorithm - impossible to know without solving previously
 * O(N) time and O(1) space (if using LL and Floyd's)
 * O(N * log(N)) time and O(1) space if use built in sort, then iterate and compare
 * @param {number[]} nums
 * @return {number} 
 */
const findDuplicate = (nums) => {
  // Floyd's algorithm = reset fast after 1st intersection, then next intersection is duplicate
  // https://www.youtube.com/watch?v=wjYnzkAhcNk&t=17s
  if (!nums.length) return -1

  // move fast to find first intersection
  let start = 0,
      slow = nums[start],
      fast = nums[nums[start]]

  while (slow !== fast) {
    slow = nums[slow]
    fast = nums[nums[fast]]
  }

  fast = start // reset fast

  // move slow to find next intersection
  while (slow !== fast) {
    slow = nums[slow]
    fast = nums[fast]
  }

  return slow
}

/**
 * 23: Merge k Sorted Lists
 * lists = [[1, 4, 5], [1, 3, 4], [2, 6]]
 * return = [1, 1, 2, 3, 4, 4, 5, 6]
 * @param {ListNode[]} lists 
 * @return {ListNode}
 */
const mergeKLists = (lists) => {
  let prev = null

  for (const list of lists) {
    prev = mergeTwoLinkedLists(prev, list)
  }

  return prev
}

/**
 * 25: Reverse Nodes in k-Group
 * @param {ListNode} head 
 * @param {number} k 
 * @return {ListNode}
 */
const reverseKGroup = (head, k) => {
  // helper func
  const getKth = (curr, k) => {
    while (curr && k) {
      curr = curr.next
      k--
    }
    return curr
  }

  const sentinel = tail = new ListNode(0, head)

  while (true) {
    // FIND FIRST KTH NODE
    let kth = getKth(tail, k)
    if (!kth) break // exit condition: if curr group size is < k
    let nextGroup = kth.next // start of next group

    // REVERSE CURR GROUP
    let prev = kth.next,
        curr = tail.next

    while (curr !== nextGroup) {
      const temp = curr.next
      curr.next = prev
      prev = curr
      curr = temp
    }

    // REASSIGN POINTERS
    const temp = tail.next // store first node in curr group
    tail.next = kth
    tail = temp
  }

  return sentinel.next
}
