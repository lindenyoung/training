/**
 * Valid parentheses
 * s = "()[]{}" -> true
 * s = "([{}])" -> true
 * O(n) time | O(n) space
 * @param {string} s 
 * @param {string[]} stack
 * @returns {boolean}
 */

const validParenthesis = (s, stack = []) => {
  const charMap = {
    ')': '(',
    ']': '[',
    '}': '{',
  }

  for (const char of s) {
    // if curr char is an opening paren, push to stack
    if (!(char in charMap)) {
      stack.push(char)
      continue
    }

    // if stack isn't empty and curr char (ending paren) matches top stack element, pop
    if (stack.length && stack[stack.length - 1] === charMap[char]) {
      stack.pop()
      continue
    }

    // curr char is not a match, so return false
    return false
  }

  // emptpy stack = true condition
  return stack.length === 0
}
