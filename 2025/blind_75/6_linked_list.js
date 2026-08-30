// 206. Reverse Linked List
/**
  * @param {ListNode} head
  * @return {ListNode}
  * Input: head = [0,1,2,3]
  * Output: [3,2,1,0]
*/
const reverseList = (head) => {
  // O(n) time and O(1) space
  let prev = null, curr = head;
  // basically just switching pointers for each node in a single pass of the list
  while (curr) {
    let nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
};

// 21. Merge Two Sorted Lists
/**
  * @param {ListNode} list1
  * @param {ListNode} list2
  * @return {ListNode}
  * Input: list1 = [1,2,4], list2 = [1,3,5]
  * Output: [1,1,2,3,4,5]
*/
const mergeTwoLists = (list1, list2) => {
  // O(n + m) time and O(1) space
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

  // one list will be empty before the other
  if (list1) {
    node.next = list1;
  } else {
    node.next = list2;
  }

  return dummy.next;
};

// 141. Linked List Cycle
/**
  * @param {ListNode} head
  * @return {boolean}
  * Input: head = [1,2,3,4], index = 1
  * Output: true
*/
const = hasCycle = (head) => {
  // O(n) time and O(1) space
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (fast === slow) return true;
  }
  return false;
};

// 143. Reorder List
/**
  * @param {ListNode} head
  * @return {void}
  * Input: head = [2,4,6,8]
  * Output: [2,8,4,6]
  * try to solve without extra space - O(1)
*/
const reorderList = (head) => {
  // O(n) time and O(1) space
  // reverse second half of list then merge two halves
  // find mid point
  let slow = head,
      fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // reverse right half pointers
  let right = slow.next, // first node in second/right half
      prev = null;
  slow.next = null;
  while (right) {
    const nxt = right.next;
    right.next = prev;
    prev = right;
    right = nxt;
  }

  // merge two halfs
  let left = head;
  right = prev;
  while (right) { // right half will be the smaller half
    let temp1 = left.next,
        temp2 = right.next;
    // move pointers
    left.next = right;
    right.next = temp1;
    // iterate through LL
    left = temp1;
    right = temp2;
  }
};

// 19. Remove Nth Node From End of List
/**
  * @param {ListNode} head
  * @param {number} n
  * @return {ListNode}
  * Remove the nth node FROM THE END of the list and return the beginning of the list
  * Input: head = [1,2,3,4], n = 2
  * Output: [1,2,4]
*/
const removeNthFromEnd = (head, n) => {
  // O(n) time and O(1) space
  // use two pointer approach, with right n nodes ahead of left
  let left = head, right = head;
  for (let i = 0; i < n; i++) {
    right = right.next;
  }
  // edge case of head node being the node to remove
  if (!right) return head.next;
  // use right.next bc on completion, we want the right pointer to be at the last node in list
  while (right.next) {
    left = left.next;
    right = right.next;
  }
  left.next = left.next.next;
  return head;
};

// 23. Merge k Sorted Lists
    /**
     * @param {ListNode[]} lists
     * @return {ListNode}
     */
const mergeKLists = (lists) => {
  // complexity
};
