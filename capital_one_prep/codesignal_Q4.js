/**
 * Longest consecutive sequence - leetcode 128
 * Constraint = solution must run in linear time
 * Input: nums = [100,4,200,1,3,2]
 * Output: 4
 * Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
 * @param {number[]} nums 
 * @returns {number}
 * O(n) time and O(n) space
 */
const longestConsecutive = (nums) => {
  if (!nums || nums.length === 0) return 0

  const set = new Set(nums) // remove duplicates
  let result = 0

  for (const num of set) {
    // skip nums we will later count
    // want to start counting from smallest num in sequence
    if (set.has(num - 1)) continue

    let currNum = num,
        count = 1 // initialize to 1

    while (set.has(currNum + 1)) {
      count++
      currNum++
    }

    result = Math.max(result, count)
  }

  return result
}

/**
 * Pairs of songs with total durations divisible by 60 - leetcode 1010
 * Input: time = [30,20,150,100,40]
 * Output: 3
 * Explanation: Three pairs have a total duration divisible by 60:
 * (time[0] = 30, time[2] = 150): total duration 180
 * (time[1] = 20, time[3] = 100): total duration 120
 * (time[1] = 20, time[4] = 40): total duration 60
 * @param {number[]} time 
 * @returns {number}
 * O(n) time and O(n) space
 */
const numPairsDivisibleBy60 = (times) => {
  const map = {}
  let result = 0

  for (const time of times) {
    const remainder = time % 60
    const left = (60 - remainder) % 60
    result += map[left] || 0
    map[remainder] = (map[remainder] || 0) + 1
  }
  
  return result
}


/**
 * 4 sum II - leetcode 454
 * @param {number[]} nums1 
 * @param {number[]} nums2 
 * @param {number[]} nums3 
 * @param {number[]} nums4 
 * @returns {number}
 */
const fourSumCount = (nums1, nums2, nums3, nums4) => {}

/**
 * Longest palindrome by concatenating two letter words - leetcode 2131
 * Input: words = ["lc","cl","gg"]
 * Output: 6
 * Explanation: One longest palindrome is "lc" + "gg" + "cl" = "lcggcl", of length 6.
 * Note that "clgglc" is another longest palindrome that can be created.
 * @param {string[]} words 
 * @returns {number}
 * O(n) time and O(n) space
 */
const longestPalindrome = (words) => {
  const map = {}
  let count = 0

  for (const word of words) {
    const reversed = word[1] + word[0] // don't need a reverse function since they are just 2 char strings

    if (map[reversed]) {
      map[reversed]--
      count += 4 // found matching pair, both strings together = 4 chars
    } else map[word] = (map[word] || 0) + 1
  }

  // check for words that are palindromes themselves - 'aa', 'gg', since they don't need a reversed pair to match
  const hasMorePalindromes = Object.keys(map).filter(key => map[key] && (key[1] + key[0]) === key) // map[key] is checking for non zero property value (frequency)
  if (hasMorePalindromes.length) count += 2 // can always add one of these single word palindromes to total count
  return count
}

/**
 * Array of doubled pairs - leetcode 954
 * Better description of problem - Could we find a pair for each number in the array, so one element of the pair is twice bigger than other?
 * Input: arr = [4,-2,2,-4]
 * Output: true
 * Explanation: We can take two groups, [-2,-4] and [2,4] to form [-2,-4,2,4] or [2,4,-2,-4].
 * @param {number[]} arr 
 * @returns {boolean}
 * O(n logn) time and O(n) space
 */
const canReorderDoubled = (arr) => {
  arr.sort((a, b) => a - b)
  const map = {}

  // populate frequency map
  for (const num of arr) {
    map[num] = (map[num] || 0) + 1
  }

  for (const num of arr) {
    // need this bc we delete both num and pair from the map after finding a match
    // so this condition skips nums that we have already matched on and deleted (-2 in the above example)
    if (!map[num]) continue

    // handle positive / negative nums differently
    const pair = num >= 0 ? num * 2 : num / 2

    // false case, if we find a num without a pair
    if (!map[pair]) return false

    for (const k of [num, pair]) {
      if (--map[k] === 0) delete map[k]
    }
  }

  return true
}

/**
 * 3 sum with multiplicity (combinatorics solution) - leetcode 923
 * Input: arr = [1,1,2,2,3,3,4,4,5,5], target = 8
 * Output: 20
 * Explanation: Enumerating by the values (arr[i], arr[j], arr[k]): (1, 2, 5) occurs 8 times, (1, 3, 4) occurs 8 times, (2, 2, 4) occurs 2 times, (2, 3, 3) occurs 2 times.
 * Constraints:
* 3 <= arr.length <= 3000
* 0 <= arr[i] <= 100
* 0 <= target <= 300
 * @param {number[]} arr
 * @param {number} target 
 * @returns {number}
 * O(n^2) time and O(n) space
 */
// very fast solution but kinda of hard to understand
const threeSumMulti = (arr, target) => {
  let nmap = new Uint16Array(101),
      third = target / 3,
      ans = 0

  for (let i in arr) nmap[arr[i]]++
  
  for (let k = Math.min(target, 100); k >= third; k--) {
    let rem = target - k,
        half = rem / 2
    
    for (let j = Math.min(rem, k); j >= half; j--) {
        let i = rem - j,
            x = nmap[i],
            y = nmap[j],
            z = nmap[k],
            res
        
        if (i === k) res = x * (x-1) * (x-2) / 6
        else if (i === j) res = x * (x-1) / 2 * z
        else if (j === k) res = x * y * (y-1) / 2
        else res = x * y * z
        ans = (ans + res) % 1000000007
    }
  }

  return ans
}

// much slower solution but easier to understand
const threeSumMulti2 = (arr, target) => {
  const map = {},
        mod = 1000000007

  let result = 0

  for (let i = 0; i < arr.length; i++) {
    result = (result + (map[target - arr[i]] || 0)) % mod

    for (let j = 0; j < i; j++) {
      const temp = arr[i] + arr[j]
      map[temp] = (map[temp] || 0) + 1
    }
  }

  return result
}

/**
 * Count number of nice subarrays - leetcode 1248
 * Input: nums = [1,1,2,1,1], k = 3
 * Output: 2
 * Explanation: The only sub-arrays with 3 odd numbers are [1,1,2,1] and [1,2,1,1].
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 */
const numberOfSubarrays = (nums, k) => {
  const isOdd = (n) => n % 2 !== 0
  
  let odds = 0,
      currCount = 0, // curr count of nice subarrays
      left = 0,
      result = 0

  // expand window
  for (let right = 0; right < nums.length; right++) {
    if (isOdd(nums[right])) {
      odds++
      currCount = 0
    }

    // shrink window condition
    while (odds === k && left <= right) {
      if (isOdd(nums[left])) odds--
      left++
      currCount++
    }

    result += currCount
  }

  return result
}

/**
 * K-diff pairs in an array - leetcode 532
 * Input: nums = [3,1,4,1,5], k = 2
 * Output: 2
 * Explanation: There are two 2-diff pairs in the array, (1, 3) and (3, 5). Although we have two 1s in the input, we should only return the number of unique pairs.
 * @param {number[]} nums 
 * @param {number} k 
 * @returns {number}
 */
const findPairs = (nums, k) => {
  const map = {}
  let result = 0

  // populate frequency map
  for (const num of nums) {
    map[num] = (map[num] || 0) + 1
  }

  for (const key of Object.keys(map)) {
    if (k !== 0) {
      // |a - b| = k
      // a = k + b
      const b = k + +key // typecast string to number using + which is basically parseInt(i)
      if (map[b]) result++
    // edge case of k = 0
    } else {
      if (map[key] >= 2) result++
    }
  }

  return result
}
