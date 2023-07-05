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