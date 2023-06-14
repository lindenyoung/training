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

/**
 * Evaluate reverse polish notation
 * O(n) | O(n) using a stack
 * tokens = ["2", "1", "+", "3", "*"] -> 9 ((2 + 1) * 3)
 * @param {string[]} tokens 
 * @param {number[]} stack // default param
 * @returns {number}
 */
const evalRPN = (tokens, stack = []) => {
  const operatorsMap = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => ~~(a/b), // basically Math.floor or Math.trunc
  }

  for (const char of tokens) {
    // if curr char is an operator, perform logic
    if (char in operatorsMap) {
      const [ b, a ] = [ stack.pop(), stack.pop() ] // grab right and left vals
      const correctOperation = operatorsMap[char] // grab correct operation to perform
      stack.push(correctOperation(a,b)) // push new value to stack
      continue
    }

    // curr char is not an operator, so push to stack as a number
    stack.push(Number(char))
  }

  return stack.pop()
}

/**
 * Daily temperatures
 * temps = [73,74,75,71,69,72,76,73] -> [1,1,4,2,1,1,0,0]
 * temps = [30, 40, 50, 60] -> [1, 1, 1, 0]
 * @param {number[]} temps 
 * @returns {number[]}
 */
const dailyTemperatures = (temps) => {
  const stack = [],
        result = Array(temps.length).fill(0)

  for (let i = 0; i < temps.length; i++) {
    // if stack isn't empty and temp at last lesser temp's index is less than curr temp
    // update result array for the top stack temp index
    while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
      const poppedIndex = stack.pop()
      // update result value for popped temp's index
      result[poppedIndex] = i - poppedIndex
    }

    stack.push(i)
  }

  return result
}
