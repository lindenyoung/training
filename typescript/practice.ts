// write a function that takes an array of nums and returns the lowest three

const findLowestThreeNums = (nums: number[]): number[] => {
  // sort first method
  // const sortedNums = nums.sort((a, b) => a - b);
  // return sortedNums.slice(0, 3);

  // no sort method
  let lowestNums: number[] = [Infinity, Infinity, Infinity];

  for (let i = 0; i < nums.length; i++) {
    const currNum = nums[i];
    if (currNum < lowestNums[0]) {
      lowestNums[2] = lowestNums[1];
      lowestNums[1] = lowestNums[0];
      lowestNums[0] = currNum;
    } else if (currNum < lowestNums[1]) {
      lowestNums[2] = lowestNums[1];
      lowestNums[1] = currNum;
    } else if (currNum < lowestNums[2]) {
      lowestNums[2] = currNum;
    }
  }

  return lowestNums;
};

// console.log(findLowestThreeNums([5, 3, 1, 10, 20, 2]));