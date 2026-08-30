// 53. Maximum Subarray
/**
  * @param {number[]} nums
  * @return {number}
  * Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
  * Output: 6
  * Explanation: The subarray [4,-1,2,1] has the largest sum 6.
*/
const maxSubArray = (nums) => {
  // O(n) time and O(1) space
  let maxSum = nums[0],
      currSum = 0;

  for (const num of nums) {
    if (currSum < 0) currSum = 0; // effectively sliding left pointer to the right to ignore negative sum prefixes
    currSum += num;
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum;
};

// 55. Jump Game
/**
  * @param {number[]} nums
  * @return {boolean}
  * Input: nums = [3,2,1,0,4]
  * Output: false
  * Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
  * Input: nums = [1,2,0,1,0]
  * Output: true
*/
const canJump = (nums) => {
  // O(n) time and O(1) space
  // goal starts as # of steps needed to get from first to last index
  let goal = nums.length - 1;
  // start loop at 2nd to last index
  for (let i = nums.length - 2; i >= 0; i--) {
    if (i + nums[i] >= goal) {
      goal = i;
    }
  }
  return goal === 0;
};
