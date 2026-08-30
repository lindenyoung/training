// 200. Number of Islands
/**
   * @param {character[][]} grid
   * @return {number}
   * Input: grid = [
      ["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]
  ]
   * Output: 3
*/
const numIslands = (grid) => {
  // O(n * m) time and space where n = # rows and m = # columns
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]],
        rows = grid.length,
        cols = grid[0].length;
  let islands = 0;

  const dfs = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    for (const [x, y] of directions) {
      dfs(r + x, c + y);
    }
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        dfs(r, c);
        islands++;
      }
    }
  }
  return islands;
};

// 133. Clone Graph
/**
   * @param {Node} node
   * @return {Node}
*/
const cloneGraph = (node) => {
  // O(v + e) time and O(v) space where v = # of vertices and e = # of edges
  const oldToNew = new Map();

  const dfs = (node) => {
    if (!node) return null;
    if (oldToNew.has(node)) {
      return oldToNew.get(node);
    }
    const copy = new Node(node.val);
    oldToNew.set(node, copy);
    for (const n of node.neighbors) {
      copy.neighbors.push(dfs(n));
    }
    return copy;
  }

  return dfs(node);
};

// 417. Pacific Atlantic Water Flow
/**
   * @param {number[][]} heights
   * @return {number[][]}
*/
const pacificAtlantic = (heights) => {
  // O(m * n) time and space where m = # rows and n = # columns
  const rows = heights.length,
        cols = heights[0].length,
        pac = new Set(),
        atl = new Set(),
        directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const dfs = (r, c, visit, prevHeight) => {
    const key = `${r},${c}`;
    // base case: out of bounds, already visited, or height issue
    if (
      r < 0 || c < 0 ||
      r >= rows || c >= cols ||
      visit.has(key) ||
      heights[r][c] < prevHeight
    ) return;

    // mark curr cell as visited in whichever ocean set
    visit.add(key);

    // explore all 4 directions
    for (const [x, y] of directions) {
      dfs(r + x, c + y, visit, heights[r][c]);
    }
  };

  // start along top and bottom sides
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pac, heights[0][c]); // top row
    dfs(rows - 1, c, atl, heights[rows - 1][c]); // bottom row
  }

  // start along right and left sides
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pac, heights[r][0]); // leftmost column
    dfs(r, cols - 1, atl, heights[r][cols - 1]); // rightmost column
  }

  const res = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (pac.has(key) && atl.has(key)) res.push([r, c]);
    }
  }

  return res;
};

// 207. Course Schedule
/**
   * @param {number} numCourses
   * @param {number[][]} prerequisites
   * @return {boolean}
   * Input: numCourses = 2, prerequisites = [[1,0]]
   * Output: true
   * To take course 1 you should have finished course 0. So it is possible.
   * Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
   * Output: false
*/
const canFinish = (numCourses, prerequisites) => {
  // O(v + e) time and space where v = # of courses and e = # of prereqs
  // populate prereq map
  const prereqMap = new Map();
  for (let i = 0; i < numCourses; i++) {
    prereqMap.set(i, []);
  }
  for (let [crs, pre] of prerequisites) {
    prereqMap.get(crs).push(pre);
  }

  // store all courses along curr DFS path
  const visiting = new Set();

  const dfs = (crs) => {
    if (visiting.has(crs)) return false; // cycle detected
    if (prereqMap.get(crs).length === 0) return true; // no prereqs for this course

    visiting.add(crs);
    for (const prereq of prereqMap.get(crs)) {
      if (!dfs(prereq)) return false;
    }
    visiting.delete(crs); // backtracking - wer'e done exploring this course's dependency tree, allows the course to be visited again in another DFS path
    prereqMap.set(crs, []); // memoization optimization, prevents redundant work in future DFS paths
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }

  return true;
};

// 261. Graph Valid Tree
/**
   * @param {number} n
   * @param {number[][]} edges
   * @returns {boolean}
   * definition of tree = an undirected graph with no cycles
   * Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
   * Output: true
   * Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
   * Output: false
*/
const validTree = (n, edges) => {
  // O(v + e) time and space
  if (!n) return true;
  if (edges.length > n - 1) return false;

  const adjMap = Array.from({ length: n }, () => []);
  for (const [n1, n2] of edges) {
    adjMap[n1].push(n2);
    adjMap[n2].push(n1);
  }

  const visit = new Set();

  const dfs = (node, parent) => {
    if (visit.has(node)) return false;
    visit.add(node);

    for (const nei of adjMap[node]) {
      if (nei === parent) continue;
      if (!dfs(nei, node)) return false;
    }

    return true;
  }

  return dfs(0, -1) && visit.size === n;
};

// 323. Number of Connected Components in an Undirected Graph
/**
   * @param {number} n
   * @param {number[][]} edges
   * @returns {number}
   * Input: n = 5, edges = [[0,1],[1,2],[3,4]]
   * Output: 2
*/
const countComponents = (n, edges) => {
  // O(v + e) time and space
  const adjMap = Array.from({ length: n }, () => []);
  const visit = Array(n).fill(false);

  for (const [n1, n2] of edges) {
    adjMap[n1].push(n2);
    adjMap[n2].push(n1);
  }

  const dfs = (node) => {
    for (const nei of adjMap[node]) {
      if (!visit[nei]) {
        visit[nei] = true;
        dfs(nei);
      }
    }
  };

  let res = 0;
  for (let i = 0; i < n; i++) {
    if (!visit[i]) {
      visit[i] = true;
      dfs(i);
      res++;
    }
  }
  return res;
};
