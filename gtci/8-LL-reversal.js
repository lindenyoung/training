// In-place reversal of a linked list

// REVERSE LL
const reveresLL = (head) => {
  let curr = head;
  let prev = null;

  while (curr) {
    const next = curr.next; // temp storage of next node
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
};

/* - - - - - - - - - - - - - - - - - - - - */

// REVERSE A SUB-LIST
const reverseSubListLL = (head, p, q) => {
  if (p === q) return head;

  // after skipping p - 1 nodes, curr will point to the p node
  let curr = head;
  let prev = null;
  let i = 0;

  while (curr !== null && i < p - 1) {
    prev = curr;
    curr = curr.next;
    i++;
  }

  const lastNodeOfFirstPart = prev;
  const lastNodeOfSubList = curr; // curr will become last node of sub-list after reversal
  let next = null; // will use to temp store next node

  i = 0;

  // reverse nodes between p and q
  while (curr !== null && i < q - p + 1) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
    i++;
  }

  // connect with first part
  if (lastNodeOfFirstPart !== null) {
    lastNodeOfFirstPart.next = prev; // prev is now the first node of the sub-list
  } else {
    head = prev;
  }

  // connect with last part
  lastNodeOfSubList.next = curr;
  return head;
};

/* - - - - - - - - - - - - - - - - - - - - */

// REVERSE EVERY K-ELEMENT SUB-LIST
const reverseEveryKElementSubList = (head, k) => {
  if (k <= 1 || head === null) return head;

  let curr = head;
  let prev = null;
  while (true) {
    const lastNodeOfPrevPart = prev;
    const lastNodeOfSubList = curr;
    let next = null;
    let i = 0;

    while (curr !== null && i < k) {
      next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
      i++;
    }

    // connect with prev part
    if (lastNodeOfPrevPart !== null) {
      lastNodeOfPrevPart.nexxt = prev;
    } else {
      head = prev;
    }

    // connect with next part
    lastNodeOfSubList.next = curr;

    if (curr === null) break;
    prev = lastNodeOfSubList;
  }

  return head;
};