// useful with sorted arrays or linked lists
// used to find set of elements that fulfill certain constraints


// two sum

// O(n) time and O(1) space

function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) return [left, right];
    if (sum < target) left++;
    if (sum > target) right--;
  }

  return [-1, -1];
}

// console.log(twoSum([1, 2, 3, 4, 5], 4)); // -> [0, 2]

/* - - - - - - - - - - - - - - - - - - - - */

// remove duplicates - must be O(1) space and use an in-place algorithm, return length of non-duplicate subarray

function removeDuplicates(arr) {
  let nextNonDuplicate = 1; // where to place non-duplicates pointer - starts at second position
  let i = 0; // traversal pointer

  while (i < arr.length) {
    if (arr[nextNonDuplicate - 1] !== arr[i]) {
      arr[nextNonDuplicate] = arr[i];
      nextNonDuplicate++;
    }
    i++;
  }

  return nextNonDuplicate;
}

// console.log(removeDuplicates([2, 2, 2, 11])); // -> 2

/* - - - - - - - - - - - - - - - - - - - - */

// sorted squaring of sorted array

function makeSquaresArr(arr) {
  const n = arr.length;
  const squares = Array(n).fill(0);
  let highestSquareIndex = n - 1; // fill largest to smallest, right to left
  let left = 0, // create vars for two pointers
    right = n - 1;

 while (left <= right) {
  let leftSquare = arr[left] * arr[left], // create vars for squared values
    rightSquare = arr[right] * arr[right];
  if (leftSquare > rightSquare) { // add larger value to squares array
    squares[highestSquareIndex] = leftSquare;
    left++; // increment left pointer
  } else {
    squares[highestSquareIndex] = rightSquare;
    right--; // decrement right pointer
  }
  highestSquareIndex--; // filling array from right to left, largest to smallest
 }

 return squares;
}

// console.log(makeSquaresArr([-2, -1, 0, 2, 3])); // -> [0, 1, 4, 4, 9];

/* - - - - - - - - - - - - - - - - - - - - */

// triplet sum to zero

// a + b + c = 0
// b + c = -a

function searchTriplets(arr) {
  arr.sort((a, b) => a - b);
  const triplets = [];
  for (let i = 0; i < arr.length; i++) {
    // skip same element to avoid duplicate triplets
    if (i > 0 && arr[i] === arr[i - 1]) continue;
    searchPair(arr, -arr[i], i + 1, triplets); // -arr[i] based on above algebra
  }
  return triplets;
}

function searchPair(arr, targetSum, left, triplets) {
  let right = arr.length - 1;
  while (left < right) {
    const currSum = arr[left] + arr[right];
    if (currSum === targetSum) { // found the triplet
      triplets.push([-targetSum, arr[left], arr[right]]); // push three nums that sum to zero
      left++;
      right--;
      while (left < right && arr[left] === arr[left - 1]) left++;
      while (left < right && arr[right] === arr[right + 1]) right--;
    } else if (currSum < targetSum) {
      left++;
    } else {
      right--;
    }
  }
}

// console.log(searchTriplets([-3, 0, 1, 2, -1, 1, -2]));

/* - - - - - - - - - - - - - - - - - - - - */

// dutch flag sort (0, 1, 2)

function dutchFlagSort(arr) {
  let low = 0,
    high = arr.length - 1,
    i = 0;

  while (i <= high) {
    // el is a 0
    if (arr[i] === 0) {
      [arr[i], arr[low]] = [arr[low], arr[i]]; // swap
      i++;
      low++;
    // el is a 1
    } else if (arr[i] === 1) {
      i++;
    // el is a 2
    } else {
      [arr[i], arr[high]] = [arr[high], arr[i]]; // swap
      high--; // only decrement high, not i, bc el at i could be 0,1,2 after swapping
    }
  }
  return arr;
}

// console.log(dutchFlagSort([1, 0, 2, 1, 0])); // [0, 0, 1, 1, 2]