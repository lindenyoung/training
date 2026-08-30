// 20. Valid Parentheses
/**
  * @param {string} s
  * @return {boolean}
  * Input: s = "([{}])"
  * Output: true
  * Input: s = "[(])"
  * Output: false
*/
const isValid = (s) => {
  // O(n) time and O(n) space
  const stack = [];
  const closeToOpen = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  for (const c of s) {
    if (c in closeToOpen) {
      if (stack.length > 0 && stack[stack.length - 1] === closeToOpen[c]) {
        stack.pop();
      }
      else return false;
    }
    else {
      stack.push(c);
    }
  }
  return stack.length === 0 ? true : false;
};
