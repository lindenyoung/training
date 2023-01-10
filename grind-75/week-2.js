// 1 - FIRST BAD VERSION

const firstBadVersion = (n) => {
  let minVersion = null;
  let start = 1;
  let end = n;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (isBadVersion(mid)) {
      minVersion = mid;
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return minVersion;
};

// helper function
function isBadVersion(num) {
  return num >= 4 ? true : false;
}

// 2 -  RANSOM NOTE
const ransomNote = (note, magazine) => {
  // create hash map for magazine letters and frequencies
  const magazineMap = {};

  for (let i = 0; i < magazine.length; i++) {
    const currLetter = magazine[i];
    if (magazineMap[currLetter]) {
      magazineMap[currLetter]++;
    } else {
      magazineMap[currLetter] = 1;
    }
  }

  // iterate over note, checking letters against magazine hash map
  for (let i = 0; i < note.length; i++) {
    const currLetter = note[i];
    if (!magazineMap[currLetter]) { // letter not in magazine
      return false;
    } else if (magazineMap[currLetter] < 1) { // not enough of letter in magazine
      return false;
    } else { // decrement letter count in map
      magazineMap[currLetter]--;
    }
  }

  return true;
};

// 3 - CLIMBING STAIRS

// 4 - LONGEST PALINDROME

// 5 - REVERSE LINKED LIST

// 6 - MAJORITY ELEMENT

// 7 - ADD BINARY

// 8 - DIAMETER OF BINARY TREE

// 9 - MIDDLE OF LINKED LIST

// 10 - MAX DEPTH OF BINARY TREE

// 11 - CONTAINS DUPLICATE

// 12 - MAX SUBARRAY