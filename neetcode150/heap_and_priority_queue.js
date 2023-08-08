/**
 * 1046: Last Stone Weight
 * @param {number[]} stones 
 * @return {number}
 */
const lastStoneWeight = (stones) => {
  if (stones.length < 2) return stones[0] ?? 0
  
  stones.sort((a, b) => a - b)
  
  const a = stones.pop(),
        b = stones.pop()        
        
  stones.push(Math.abs(a - b))
  return lastStoneWeight(stones)
}
