// problems dealing with permutations / combinations can use this BFS approach

// SUBSETS
// O(2^n) time and O(2^n) space

const findSubsets = (nums) => {
  const subsets = [];
  subsets.push([]); // start by adding the empty subset

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];

    // take all existing subsets and insert curr num
    for (j = 0; j < subsets.length; j++) {
      const set1 = subsets[j].slice(0); // clone the permutation
      set1.push(currNum); // add curr num to existing permutation
      subsets.push(set1);
    }
  }

  return subsets;
};

/* - - - - - - - - - - - - - - - - - - - - */

// SUBSETS WITH DUPLICATES

const findSubsetsWithDuplicates = (nums) => {
  nums.sort((a, b) => a - b);

  const subsets = [];
  subsets.push([]);

  let start = 0;
  let end = 0;

  for (i = 0; i < nums.length; i++) {
    start = 0;
    // if curr and prev nums are equal, create new subsets only from the ones added in the previous step
    if (i > 0 && nums[i] === nums[i - 1]) {
      start = end + 1;
    }
    end = subsets.length - 1;
    for (j = start; j < end + 1; j++) {
      // create new subset and add curr element to it
      const set1 = subsets[j].slice(0);
      set1.push(nums[i]);
      subsets.push(set1);
    }
  }

  return subsets;
};

/* - - - - - - - - - - - - - - - - - - - - */

// PERMUTATIONS

/* - - - - - - - - - - - - - - - - - - - - */

// STRING PERMUTATIONS

/* - - - - - - - - - - - - - - - - - - - - */

// BALANCED PARENTHESIS