/**
 * Valid parentheses
 * s = "()[]{}" -> true
 * s = "([{}])" -> true
 * O(n) time | O(n) space
 * @param {string} s 
 * @param {string[]} stack
 * @return {boolean}
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
 * @return {number}
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
 * @return {number[]}
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

/**
 * Min stack (design a stack that supports push, pop, top, and retriving the min element in constant time)
 */
class MinStack {
  constructor() {
    this.stack = []
  }
  push(val) {
    this.stack.push({
      value: val,
      min: this.stack.length === 0 ? val : Math.min(val, this.getMin())
    })
  }
  pop() { this.stack.pop() }
  top() { return this.stack[this.stack.length - 1].value }
  getMin() { return this.stack[this.stack.length - 1].min }
}

/**
 * Car Fleet
 * target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3] -> 3
 * @param {number} target 
 * @param {number[]} position 
 * @param {number[]} speed 
 * @return {number}
 */
const carFleet = (target, positions, speeds) => {
  // combine position and speed arrays, then sort by position in descending order
  const cars = []
  positions.forEach((position, i) => cars.push([position, speeds[i]]))
  cars.sort((a, b) => b[0] - a[0])

  const stack = []
  cars.forEach((car, i) => {
    stack.push((target - car[0]) / car[1]) // formula for time to reach destination
    // if cars collide, remove the car with lower starting position (last pushed car)
    if (stack.length >= 2 && stack[stack.length - 1] <= stack[stack.length - 2]) stack.pop()
  })

  return stack.length
}

/**
 * Generate Parenthesis
 * n = 3 -> ["((()))","(()())","(())()","()(())","()()()"]
 * O(4^n / sqrt(n)) | O(n)
 * @param {number} n 
 * @return {string[]}
 */
const generateParenthesis = (n) => {
  const result = []

  const generate = (open, close, currString) => {
    // add valid combinations to result
    if (currString.length === 2 * n) {
      result.push(currString)
      return
    }

    // if # of opening parens is less than n, add paren and recursively call helper func
    if (open < n) generate(open + 1, close, currString + '(')
    // if # of closing parens is less than # of opening parens, add paren and recursively call helper func
    if (close < open) generate(open, close + 1, currString + ')')
  }

  generate(0, 0, '')
  return result
}
