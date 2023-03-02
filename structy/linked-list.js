// LL values
const linkedListValues = (head) => {
  const values = [];
  let curr = head;

  while (curr) {
    values.push(curr.val);
    curr = curr.next;
  }

  return values;
};

// sum list
const sumList = (head) => {
  let sum = 0;
  let curr = head;

  while (curr) {
    sum += curr.val;
    curr = curr.next;
  }

  return sum;
};

// LL find
const linkedListFind = (head, target) => {
  let curr = head;

  while (curr) {
    if (curr.val === target) return true;
    curr = curr.next;
  }

  return false;
};

// get node value
const getNodeValue = (head, index) => {
  let curr = head;
  let count = 0;

  while (curr) {
    if (count === index) return curr.val;
    curr = curr.next;
    count++;
  }

  return null;
};

// reverse list
const reverseList = (head) => {
  let curr = head;
  let prev = null;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
};

// zipper lists
const zipperLists = (head1, head2) => {
  const head = head1;
  let tail = head;
  let curr1 = head1.next;
  let curr2 = head2;
  let count = 0;

  while (curr1 && curr2) {
    if (count % 2 === 0) {
      tail.next = curr2;
      curr2 = curr2.next;
    } else {
      tail.next = curr1;
      curr1 = curr1.next;
    }

    tail = tail.next;
    count++;
  }

  if (curr1) tail.next = curr1;
  if (curr2) tail.next = curr2;

  return head;
};

// merge lists
const mergeLists = (head1, head2) => {
  let dummyHead = new Node(null);
  let tail = dummyHead;
  let curr1 = head1;
  let curr2 = head2;

  while (curr1 && curr2) {
    if (curr1.val < curr2.val) {
      tail.next = curr1;
      curr1 = curr1.next;
    } else {
      tail.next = curr2;
      curr2 = curr2.next;
    }

    tail = tail.next;
  }

  if (curr1) tail.next = curr1;
  if (curr2) tail.next = curr2;

  return dummyHead.next; // first node in new list
};

// is univalue list
const isUnivalueList = (head) => {
  let curr = head;

  while (curr.next) {
    if (curr.val !== curr.next.val) return false;
    curr = curr.next;
  }

  return true;
};

// longest streak
const longestStreak = (head) => {
  if (!head) return 0; // edge case of null head node

  let curr = head;
  let streak = 1;
  let maxStreak = 0;

  while (curr.next) {
    if (curr.next.val === curr.val) {
      streak++;
      curr = curr.next;
    } else {
      maxStreak = Math.max(maxStreak, streak);
      streak = 1;
      curr = curr.next;
    }
  }

  maxStreak = Math.max(maxStreak, streak); // this catches case for when longest streak includes tail node, so line 143 never executes
  return maxStreak;
};

// remove node

// insert node

// create LL

// add lists