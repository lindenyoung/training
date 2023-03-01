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

// zipper lists

// merge lists

// is univalue list

// longest streak

// remove node

// insert node

// create LL

// add lists