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
