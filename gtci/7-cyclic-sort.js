// efficient sorting method for arrays containing numbers in a given range

// CYCLIC SORT - O(n) time and O(1) space
const cyclicSort = (nums) => {
  let i = 0;
  while (i < nums.length) {
    const j = nums[i] - 1; // j = the correct index (location) for given num
    if (nums[i] !== nums[j]) { // if curr num is not in the right spot
      [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
    } else {
      i++;
    }
  }
  return nums;
};

// const test = [2, 6, 4, 3, 1, 5];
// console.log(cyclicSort(test));

/* - - - - - - - - - - - - - - - - - - - - */

// FIND THE MISSING NUMBER - range 0 to n, since arr only has n nums out of total n+1, find missing num
// O(n) time and O(1) space
const findMissingNumber = (nums) => {
  let i = 0;
  const n = nums.length; // n distinct numbers
  while (i < n) {
    j = nums[i]; // the correct index for curr el
    if (nums[i] < n && nums[i] !== nums[j]) { // extra check here - curr num < arr length
      [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
    } else {
      i++;
    }
  }

  // find the first num missing from its index
  for (i = 0; i < n; i++) {
    if (nums[i] !== i) return i; // return missing num if found
  }

  return n; // must be the last number
};

// const test = [4, 0, 3, 1];
// console.log(findMissingNumber(test));

/* - - - - - - - - - - - - - - - - - - - - */

// FIND ALL MISSING NUMBERS - range 1 to n, arr can have duplicates, find missing nums
// O(n) time and O(1) space
const findAllMissingNums = (nums) => {
  let i = 0;
  while (i < nums.length) {
    const j = nums[i] - 1; // correct index (location), since range is 1 - n, need the minus 1
    if (nums[i] !== nums[j]) {
      [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
    } else {
      i++;
    }
  }

  const missingNums = []; // create result var

  // find missing nums
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      missingNums.push(i + 1);
    }
  }

  return missingNums;
};

// console.log(findAllMissingNums([2, 3, 1, 6, 2, 3, 5, 1]));

/* - - - - - - - - - - - - - - - - - - - - */

// FIND DUPLICATE NUMBER - // n+1 numbers taken from range 1 to n, find the one duplicate without using extra space
// O(n) time and O(1) space
const findDuplicateNum = (nums) => {
  let i = 0;
  while (i < nums.length) {
    if (nums[i] !== i + 1) {
      const j = nums[i] - 1; // correct index
      if (nums[i] !== nums[j]) {
        [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
      } else { // if the two nums are the same, we've found duplicate
        return nums[i];
      }
    } else {
      i++;
    }
  }
  return -1;
};

// console.log(findDuplicateNum([1, 4, 4, 3, 2]));
// console.log(findDuplicateNum([2, 4, 1, 4, 4]));


/* - - - - - - - - - - - - - - - - - - - - */

// FIND ALL DUPLICATE NUMBERS
// O(n) time and O(1) space
const findAllDuplicateNums = (nums) => {
  let i = 0;
  while (i < nums.length) {
    const j = nums[i] - 1;
    if (nums[i] !== nums[j]) {
      [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
    } else {
      i++;
    }
  }

  const duplicateNums = [];

  for (i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      duplicateNums.push(nums[i]);
    }
  }

  return duplicateNums;
};

// console.log(findAllDuplicateNums([3, 4, 4, 5, 5]));
// console.log(findAllDuplicateNums([5, 4, 7, 2, 3, 5, 3]));

/* - - - - - - - - - - - - - - - - - - - - */

// PROBLEM CHALLENGE #1

/* - - - - - - - - - - - - - - - - - - - - */

// FIND THE DUPLICATE AND MISSING NUMBER

const findCorruptPair = (nums) => {
  let i = 0;
  // cyclic sort
  while (i < nums.length) {
    const j = nums[i] - 1;
    if (nums[i] !== nums[j]) {
      [nums[i], nums[j]] = [nums[j], nums[i]]; // swap
    } else {
      i++;
    }
  }
  // iterate to find duplicate and missing
  for (i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      return [nums[i], i + 1];
    }
  }
  return [-1, -1];
};