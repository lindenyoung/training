/**
 * 211: Design Add and Search Words Data Structure
 */

class TrieNode {
  constructor() {
    this.children = {}
    this.isWord = false
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode()  
  }

  addWord(word, node = this.root) {
    for (const char of word) {
      const child = node.children[char] || new TrieNode()

      node.children[char] = child

      node = child
    }

    node.isWord = true
  }

  search(word) {
    return this.dfs(word, this.root, 0)
  }

  dfs(word, node, level) {
    if (!node) return false

    // isWord check
    if (level === word.length) return node.isWord

    // isWildCard check
    if (word[level] === '.') return this.hasWildCard(word, node, level)

    return this.dfs(word, node.children[word[level]], level + 1)
  }

  hasWildCard(word, node, level) {
    for (const char of Object.keys(node.children)) {
      const child = node.children[char]

      const hasWord = this.dfs(word, child, level + 1)
      if (hasWord) return true
    }

    return false
  }
}
