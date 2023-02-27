// uncompress
  // O(n*m) time and space

  const uncompress = (s) => {
    let result = [];
    const numbers = '0123456789';
    let i = 0;
    let j = 0;

    while (j < s.length) {
      if (numbers.includes(s[j])) {
        j++;
      } else {
        const num = Number(s.slice(i, j));
        for (let count = 0; count < num; count++) {
          result.push(s[j]);
        }
        j++;
        i = j;
      }
    }

    return result.join('');
  };

// compress
  // O(n) time and space

const compress = (s) => {
  let result = [];
  let i = 0;
  let j = 0;

  while (j <= s.length) { // <= to include last char's else block below
    if (s[i] === s[j]) {
      j++;
    } else {
      const num = j - i;
      if (num === 1) result.push(s[i]);
      else result.push(String(num), s[i]);
      i = j;
    }
  }

  return result.join('');
};

// anagrams

const anagrams = (s1, s2) => {
  if (s1.length !== s2.length) return false;

  const s1Map = {};
  const s2Map = {};

  for (const char of s1) {
    s1Map[char] = s1Map[char] + 1 || 1; // if s1Map[char] exists, add 1, else 1
  }

  for (const char of s2) {
    s2Map[char] = s2Map[char] + 1 || 1; // if s2Map[char] exists, add 1, else 1
  }

  for (const char in s1Map) {
    if (s1Map[char] !== s2Map[char]) return false;
  }

  return true;
};

// most frequent char
  // O(n) time and space for either solution (2n -> n)

const mostFrequentChar = (s) => {
  // if it doesnt matter which char is returned when multiple are tied for most frequent
  // const charMap = {};
  // let max = 0;
  // let result = '';

  // for (const char of s) {
  //   charMap[char] = charMap[char] + 1 || 1;
  //   if (charMap[char] > max) {
  //     max = charMap[char];
  //     result = char;
  //   }
  // }

  // return result;

  // if problems says to return the first appearing char in s when multiple chars are tied for most frequent
  const charMap = {};

  for (let char of s) {
    charMap[char] = charMap[char] + 1 || 1;
  }

  let max = null;
  for (let char of s) {
    if (max === null || charMap[char] > charMap[max]) {
      max = char;
    }
  }

  return max;
};

// pair sum

const pairSum = (nums, target) => {
  const numMap = {};

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const diff = target - num;
    if (diff in numMap) return [numMap[diff], i];
    numMap[num] = i;
  }

  return null;
};

// pair product

const pairProduct = (nums, target) => {
  const numMap = {};

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target / num;
    if (complement in numMap) return [numMap[complement], i];
    numMap[num] = i;
  }

  return null;
};

// intersection

const intersection = (a, b) => {
  const result = [];
  const setA = new Set(a);

  for (let num of b) {
    if (setA.has(num)) result.push(num);
  }

  return result;
};

// five sort

const fiveSort = (nums) => {
  let i = 0;
  let j = nums.length - 1;

  while (i < j) {
    if (nums[j] === 5) j--;
    else if (nums[i] !== 5) i++;
    else { // swap condition
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i++;
      j--;
    }
  }

  return nums;
};

// quiz