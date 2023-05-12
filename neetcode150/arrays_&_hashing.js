// Contains Duplicate
const containsDuplicate = (nums) => {
  // SET: O(n) time and O(n) space
  const numsSet = new Set(nums);
  return nums.length === numsSet.size;

  // SORT: O(n * log(n)) time and O(1) space
  // const sortedNums = nums.sort((a, b) => a - b);
  // for (let i = 0; i < sortedNums.length; i++) {
  //   if (sortedNums[i] === sortedNums[i + 1]) return true;
  // }
  // return false;
}


// Valid Anagram


// Two Sum


// Group Anagrams


// Top K Frequent Elements


