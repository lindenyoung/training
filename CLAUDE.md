# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal scratchpad of data structures & algorithms interview prep (per `README.md`). It is not a buildable
application: there is no `package.json`, no test runner, no linter, and no build step. Files are standalone
solutions to LeetCode-style problems, organized by the course/source/company they came from.

## Running code

There's no project tooling — run files directly with the language runtime:

```bash
node path/to/file.js       # most files are plain Node-compatible JS (no imports/exports, no framework)
npx tsx typescript/practice.ts   # or ts-node, for the one TypeScript file
python3 path/to/file.py     # for the few Python files
```

Since files have no exports, to execute a specific function ad hoc, temporarily add a call at the bottom of the
file (e.g. `console.log(twoSum([2,7,11,15], 9));`) and run it with `node`, then remove it — or use `node -e` /
the Node REPL and paste the function in. Don't add permanent test scaffolding or an npm setup unless asked.

## Layout

Directories correspond to distinct study sources rather than a single taxonomy — don't expect one consistent
organizing scheme across the repo:

- `neetcode150/` — one file per NeetCode 150 topic (e.g. `arrays_&_hashing.js`, `dynamic_programming.js`),
  each containing many independent solutions.
- `grind-75/`, `2025/blind_75/` — similar topic-list grinds, organized by week or by topic.
- `gtci/`, `capital_one_prep/grokking_tci/` — Grokking the Coding Interview patterns (two pointers, sliding
  window, cyclic sort, etc.), numbered by pattern.
- `structy/` — Structy course problems, by data structure.
- `capital_one_prep/`, `2026/goldman_sachs/`, `2026/visa_prep.js`, `code-signal/` — company- or
  assessment-specific prep, sometimes including behavioral/system-design notes (e.g. `power_day/behavioral.js`,
  `power_day/system_design.js`) alongside coding problems.
- `2025/`, `2026/` — the newer, date-based prep folders; expect the newest/active work here.

## Conventions found in existing files

- Each function is preceded by a comment with the problem name/number and often the Big-O complexity
  (e.g. `// O(n) | O(n)`), sometimes with LeetCode tagging-frequency notes or approach tradeoffs.
  Follow this style when adding new solutions.
- Multiple approaches to the same problem are often kept side by side, with alternates left commented out
  rather than deleted — this is intentional (a study reference), not dead code to clean up.
- Solutions favor plain functions (`function foo() {}` or `const foo = () => {}`) with no imports/exports,
  classes, or external dependencies — keep new solutions self-contained the same way.
