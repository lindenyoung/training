/* ------------------ 11.9.23 ------------------ */

// Rearrange input array and return whether that new array is in strictly ascending order
// For a = [1, 3, 5, 6, 4, 2], the output should be solution(a) = true. The new array b will look like [1, 2, 3, 4, 5, 6], which is in strictly ascending order, so the answer is true.
// O(n) time and O(n) space
function rearrangeAndIsAscending(a) {
  // initialize variables
  let left = 0,
      right = a.length - 1,
      b = []
  
  // iterate over input array
  for (let i = 0; i < a.length; i++) {
    // grab curr val based on i
    const even = i % 2 === 0
    const val = even ? a[left] : a[right]
    
    // invalid case - val is less than last val added to b array
    if (val <= b[b.length - 1]) return false
    
    // push val to b array and increment / decrement left or right pointers
    b.push(val)
    if (even) left++
    else right--
  }
  
  // valid case
  return true
}


// Sawtooth sequence
// https://stackoverflow.com/questions/69356332/counting-contiguous-sawtooth-subarrays
// For arr = [9, 8, 7, 6, 5], the output should be solution(arr) = 4. Since all the elements are arranged in decreasing order, it won't be possible to form any sawtooth subarrays of length 3 or more. There are 4 possible subarrays containing two elements, so the answer is 4.
// O(n) time and O(1) space
function countContiguousSawtoothSubarrays(arr) {
  // handle edge cases
  if (!arr || arr.length < 2) return 0
  
  // initialize vars
  let count = 0,
      streak = 0,
      prevIncreasing = null
  
  // iterate over input arr
  for (let i = 1; i < arr.length; i++) {
    // curr val same as prev val
    if (arr[i] === arr[i - 1]) {
      streak = 0
      prevIncreasing = null
      continue
    }
    
    const currIncreasing = arr[i] > arr[i - 1]
    
    // valid sawtooth
    if (currIncreasing !== prevIncreasing) {
      streak++
      prevIncreasing = currIncreasing
    } else streak = 1
    
    count += streak
  }
  
  return count
}

/* ------------------ 11.10.23 ------------------ */
