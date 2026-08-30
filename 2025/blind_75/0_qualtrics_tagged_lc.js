// 735. Asteroid Collision
// medium, one of two asked in last 6 months, 97.7% frequency in "all" dropdown, 100% in last 3 months
/*
  Input: asteroids = [5,10,-5]
  Output: [5,10]
  Explanation: The 10 and -5 collide resulting in 10. The 5 and 10 never collide.
  Example 2:

  Input: asteroids = [8,-8]
  Output: []
  Explanation: The 8 and -8 collide exploding each other.
*/
const asteroidCollisionV1 = (asteroids) => {
  const stack = [];

  for (const a of asteroids) {
    let shouldAdd = true;

    while (stack.length && a < 0 && stack[stack.length - 1] > 0) {
      if (-a > stack[stack.length - 1]) {
        stack.pop();
        continue; // check for more collisions
      } else if (-a === stack[stack.length - 1]) {
        stack.pop();
        shouldAdd = false;
        break;
      } else {
        shouldAdd = false;
        break;
      }
    }

    if (shouldAdd) {
      stack.push(a);
    }
  }

  return stack;
};

const asteroidCollisionV2 = (asteroids) => {
  // generally O(n)time but technically O(n^2) worst case time and O(n) space
  // if the last asteroid in the input array is the largest, it will take an extra n operations within the for loop = n * n
  const stack = [];

  for (let i = 0; i < asteroids.length; i++) {
    const curr = asteroids[i];
    const last = stack[stack.length - 1];

    if (!stack.length || last < 0 || curr > 0) {
      stack.push(curr);
    } else if (-curr === last) {
      stack.pop();
    } else if (-curr > last) {
      stack.pop();
      i--; // bit tricky intuition here, this is to reset the i pointer to curr asteroid to check for more collisions
    }
  }

  return stack;
};

/* ----- ----- ----- */

// 76. Minimum Window Substring
// hard, one of two asked in last 6 months, 65.5% frequency in "all" dropwdown, 100% in last 3 months
/*
  * return the shortest substring of s such that every character in t, including duplicates, is present in the substring
  * Input: s = "OUZODYXAZV", t = "XYZ"
  * Output: "YXAZ"
  * Input: s = "x", t = "xy"
  * Output: ""
*/
const minWindow = (s, t) => {
  // O(n) time and O(m) space
  if (t.length === 0 || s.length < t.length) return "";
  const tMap = {},
        windowMap = {};
  for (const c of t) {
    tMap[c] = (tMap[c] || 0) + 1;
  }
  let haveCount = 0,
      needCount = Object.keys(tMap).length,
      l = 0,
      resInd = [-1, -1],
      resLength = Infinity;

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    windowMap[c] = (windowMap[c] || 0) + 1;

    if (c in tMap && windowMap[c] === tMap[c]) {
      haveCount++;
    }
    while (haveCount === needCount) {
      // update result
      if (r - l + 1 < resLength) {
        resInd = [l, r];
        resLength = r - l + 1;
      }
      // shrink window from left
      windowMap[s[l]]--;
      if (s[l] in tMap && windowMap[s[l]] < tMap[s[l]]) {
        haveCount--;
      }
      l++;
    }
  }
  return resLength !== Infinity
    ? s.slice(resInd[0], resInd[1] + 1)
    : "";
};

/* ----- ----- ----- */

// 49. Group Anagrams
// medium, not asked in last 6 months, 65.5% frequency in "all" dropdown
// 49. Group Anagrams
/*
  * Input: strs = ["act","pots","tops","cat","stop","hat"]
  * Output: [["hat"],["act", "cat"],["stop", "pots", "tops"]]
*/
const groupAnagrams = (strs) => {
  // O(m * nlog(n)) time and O(m * n) space where m = # of strings and n = length of longest string
  const map = {};

  for (const s of strs) {
    const sortedS = s.split('').sort().join('');
    if (!map[sortedS]) {
      map[sortedS] = [];
    }
    map[sortedS].push(s);
  }
  return Object.values(map);
};

const groupAnagrams_hash = (strs) => {
  // O(m * n) time and O(m * n) space (map storage) where m = # of strings and n = length of longest string
  const map = {};
  for (let s of strs) {
    const count = new Array(26).fill(0);

    for (let c of s) {
        // each str needs a freq count of chars
        count[c.charCodeAt(0) - 'a'.charCodeAt(0)] += 1;
    }
    // turn frequency count into a string so it can be used as a key
    const key = count.join(',');
    // same logic as sorting solution
    if (!map[key]) {
        map[key] = [];
    }
    map[key].push(s);
  }
  return Object.values(map);
};

/* ----- ----- ----- */

// 1925. Count Square Sum Triples
// easy, not asked in last 6 months, 100% frequency (?) in "all" dropdown
