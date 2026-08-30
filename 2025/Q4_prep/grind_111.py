from collections import deque


def reverseLinkedList(head):
  prev, curr = None, head
  while curr:
    temp = curr.next
    curr.next = prev
    prev = curr
    curr = temp
  return prev

def coinChange(coins: list[int], amount: int) -> int:
  dp = [amount + 1] * (amount + 1)
  dp[0] = 0

  for a in range(1, amount + 1):
    for c in coins:
      if a - c >= 0:
        dp[a] = min(dp[a], 1 + dp[a - c])

  return dp[amount] if dp[amount] != amount + 1 else -1

def rightSideView(root):
  res = []
  q = deque([root])

  while q:
    rightSide = None
    qLen = len(q)

    for i in range(qLen):
      node = q.popLeft()
      if node:
        rightSide = node
        q.append(node.left)
        q.append(node.right)
    if rightSide:
      res.append(rightSide.val)
  return res
