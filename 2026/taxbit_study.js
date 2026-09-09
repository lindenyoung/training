/* ============================================================================
   TaxBit — SWE 2 coding round STUDY SHEET

     node 2026/taxbit_study.js      <- run the whole thing, read the output

   Companion to taxbit_prep.js. That file proves correctness with assertions;
   this one is for reading. Four problem shapes, each one:
   dummy data -> a function or two -> a console.log right underneath.

   Targets Node v16 — no toSorted / Object.groupBy / findLast.
   ============================================================================ */


/* ==========================================================================
   1. PARSE RAW TEXT -> RECORDS -> AGGREGATE

   The likeliest opener. They paste a wall of text, not a tidy array of
   objects, and step one is turning it into something you can work with.
   Note the blank line and the stray whitespace — that's on purpose.
   ========================================================================== */

const RAW_CSV = `
id,userId,asset,quantity,unitPriceUsd
t1,u1,BTC,0.5,20000
t2,u2,ETH,3,1500
t3,u1,BTC,1.5,22000

  t4,u3,SOL,100,35
t5,u2,ETH,2,1600
`;

// Header-driven so column ORDER never matters — don't index by position,
// the interviewer will reorder the columns to see if you hardcoded it.
// O(n * c) time | O(n * c) space, c = columns
function parseCsv(raw) {
  const lines = raw
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const headers = lines[0].split(',');
  const numericFields = ['quantity', 'unitPriceUsd'];

  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((header, i) => {
      const value = (cells[i] || '').trim();
      // everything off a CSV is a string until you convert it
      row[header] = numericFields.indexOf(header) !== -1 ? Number(value) : value;
    });
    return row;
  });
}

// O(n) time | O(a) space, a = distinct assets
function totalUsdByAsset(rows) {
  const totals = new Map();
  for (const row of rows) {
    const usd = row.quantity * row.unitPriceUsd;
    totals.set(row.asset, (totals.get(row.asset) || 0) + usd);
  }
  // Map -> object so console.log actually shows the contents
  return Object.fromEntries(totals);
}

// FOLLOW-UPS THEY'LL ASK:
//   "what if a field contains a comma?"  -> "Smith, Jr" breaks split(','). Real
//      CSV needs quote handling; I'd reach for a parser rather than regex it.
//   "what if a row is malformed?"        -> decide explicitly: skip it, or collect
//      it into an errors[] and return both. Never silently mangle it.
//   "what if the file is 10GB?"          -> stream line by line (readline), don't
//      hold the whole string in memory.

console.log('\n=== 1. parse raw text -> aggregate ===');
const parsedRows = parseCsv(RAW_CSV);
console.log('parsed', parsedRows.length, 'rows; first row:', parsedRows[0]);
// expect: BTC 43000 (10000 + 33000), ETH 7700 (4500 + 3200), SOL 3500
console.log('total USD by asset:', totalUsdByAsset(parsedRows));


/* ==========================================================================
   2. JOIN TWO DATASETS

   You get two arrays and have to stitch them together. The ONLY thing being
   tested is whether you build a lookup Map or write a nested .find().
   ========================================================================== */

const USERS = [
  { id: 'u1', name: 'Ada',   country: 'US' },
  { id: 'u2', name: 'Grace', country: 'US' },
  { id: 'u3', name: 'Linus', country: 'FI' }
];

const TRADES = [
  { id: 't1', userId: 'u1', asset: 'BTC', amountUsd: 10000 },
  { id: 't2', userId: 'u2', asset: 'ETH', amountUsd: 4500 },
  { id: 't3', userId: 'u1', asset: 'BTC', amountUsd: 33000 },
  { id: 't4', userId: 'u9', asset: 'SOL', amountUsd: 3500 }  // <- no such user
];

// THE WHOLE POINT: index once, then one pass.
// O(n + m) time | O(n) space
function enrichTrades(users, trades) {
  const usersById = new Map(users.map((u) => [u.id, u]));

  return trades.map((trade) => {
    const user = usersById.get(trade.userId);
    return {
      tradeId: trade.id,
      // an orphan row is a decision, not an accident — flag it, don't crash
      user: user ? user.name : '(unknown user ' + trade.userId + ')',
      userId: trade.userId,
      country: user ? user.country : null,
      asset: trade.asset,
      amountUsd: trade.amountUsd
    };
  });
}

// the version to NOT write, and to be able to explain why:
//   trades.map(t => users.find(u => u.id === t.userId))
// re-scans users for every single trade -> O(n * m). Fine for 4 rows, quadratic
// at 100k. Building the Map costs one extra pass and makes lookups O(1).

// roll-up variant: one row per user instead of one row per trade
// O(n + m) time | O(n) space
function summaryByUser(users, trades) {
  const summary = new Map();
  for (const user of users) {
    summary.set(user.id, { name: user.name, tradeCount: 0, totalUsd: 0 });
  }
  for (const trade of trades) {
    const row = summary.get(trade.userId);
    if (!row) continue; // orphan trade, counted nowhere
    row.tradeCount++;
    row.totalUsd += trade.amountUsd;
  }
  return Array.from(summary.values());
}

console.log('\n=== 2. join two datasets ===');
// expect 4 rows, the last one showing "(unknown user u9)"
console.table(enrichTrades(USERS, TRADES)) // console.log(enrichTrades(USERS, TRADES));
// expect Ada 2/$43000, Grace 1/$4500, Linus 0/$0
console.log('per-user summary:', summaryByUser(USERS, TRADES));


/* ==========================================================================
   3. STATEFUL PASS / RUNNING TOTALS

   Walk records in order, carrying state. "In order" is the trap: the input
   array is NOT sorted, and nothing about it warns you.
   ========================================================================== */

const EVENTS = [
  { id: 'e3', timestamp: '2024-03-15T00:00:00Z', type: 'withdrawal', amount: 900 },
  { id: 'e1', timestamp: '2024-01-10T00:00:00Z', type: 'deposit',    amount: 500 },
  { id: 'e4', timestamp: '2024-04-02T00:00:00Z', type: 'deposit',    amount: 250 },
  { id: 'e2', timestamp: '2024-02-01T00:00:00Z', type: 'deposit',    amount: 300 },
  { id: 'e5', timestamp: '2024-05-20T00:00:00Z', type: 'withdrawal', amount: 100 }
];

// Sort first, then a single pass carrying state. The sort dominates.
// O(n log n) time | O(n) space (the copy; O(1) extra if you may mutate)
function walkBalance(events) {
  // .slice() first — sort() mutates, and silently reordering the caller's
  // array is the kind of bug that shows up three functions away
  const ordered = events.slice().sort((a, b) => {
    return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
  });

  let balance = 0;
  let peakBalance = 0;
  let peakAt = null;
  let firstOverdraft = null;
  const history = [];

  for (const event of ordered) {
    balance += event.type === 'deposit' ? event.amount : -event.amount;

    if (balance > peakBalance) {
      peakBalance = balance;
      peakAt = event.timestamp;
    }
    if (balance < 0 && firstOverdraft === null) {
      firstOverdraft = { eventId: event.id, at: event.timestamp, balance: balance };
    }
    history.push({ at: event.timestamp.slice(0, 10), event: event.id, balance: balance });
  }

  return {
    finalBalance: Math.round(balance * 100) / 100, // round at the boundary, not mid-loop
    peakBalance: peakBalance,
    peakAt: peakAt,
    firstOverdraft: firstOverdraft,
    history: history
  };
}

// FOLLOW-UPS: "longest streak in the red?" / "balance as of a given date?"
//   -> both fall out of the same history array, no second traversal needed.
// Money note: these are floats. 0.1 + 0.2 === 0.30000000000000004, so errors
// compound across a long ledger. Production keeps integer cents.

console.log('\n=== 3. stateful pass / running balance ===');
const walk = walkBalance(EVENTS);
// running: 500 -> 800 -> -100 (overdraft at e3) -> 150 -> 50
console.log('running balance:');
console.table(walk.history) // console.log(walk.history);
console.log('final:', walk.finalBalance, '| peak:', walk.peakBalance, 'on', walk.peakAt);
console.log('first overdraft:', walk.firstOverdraft);


/* ==========================================================================
   4. CRUD API + VALIDATION

   If the prompt is "design an API with model and data access layers", this is
   the shape. Three layers, and the separation IS the answer:
     validate -> knows the shape of a trade, nothing about storage
     store    -> knows storage, never validates
     service  -> orchestrates, never touches the Map directly
   Swap the Map for Postgres later and only the store changes.
   ========================================================================== */

const VALID_SIDES = ['buy', 'sell'];

// Pure function, no I/O — trivially testable, and reusable on any entry point
// (HTTP, a CSV import, a queue consumer).
// O(1) time | O(1) space
function validateTrade(input) {
  const errors = [];
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['payload must be an object'] };
  }
  if (!input.userId) errors.push('userId is required');
  if (!input.asset) errors.push('asset is required');
  if (VALID_SIDES.indexOf(input.side) === -1) errors.push('side must be buy or sell');
  if (typeof input.quantity !== 'number' || !(input.quantity > 0)) {
    errors.push('quantity must be a positive number');
  }
  // collect ALL the errors and return them together — don't bail on the first,
  // one round trip per mistake is a bad API
  return { valid: errors.length === 0, errors: errors };
}

// Data access layer. The Map is closed over, so nothing outside can reach in
// and mutate it — the same guarantee a real database gives you.
function createStore() {
  const rows = new Map();
  let nextId = 1;

  return {
    // O(1)
    create: function (data) {
      const record = Object.assign({ id: 'tr_' + nextId++ }, data);
      rows.set(record.id, record);
      return Object.assign({}, record); // return a copy, not the live object
    },
    // O(1)
    get: function (id) {
      const found = rows.get(id);
      return found ? Object.assign({}, found) : null;
    },
    // O(n) — full scan. THIS is the line you'd replace with an index or a SQL
    // WHERE clause, and it's the natural "how does this scale?" follow-up.
    list: function (filter) {
      const f = filter || {};
      return Array.from(rows.values()).filter((row) => {
        return Object.keys(f).every((key) => row[key] === f[key]);
      });
    },
    // O(1)
    update: function (id, patch) {
      const existing = rows.get(id);
      if (!existing) return null;
      const updated = Object.assign({}, existing, patch, { id: id });
      rows.set(id, updated);
      return Object.assign({}, updated);
    },
    // O(1)
    remove: function (id) {
      return rows.delete(id);
    }
  };
}

// Service layer — the actual API surface. Thin on purpose.
function createTradeService(store) {
  return {
    addTrade: function (input) {
      const validation = validateTrade(input);
      if (!validation.valid) return { ok: false, errors: validation.errors };
      return { ok: true, trade: store.create(input) };
    },

    getUserTrades: function (userId) {
      return store.list({ userId: userId });
    },

    // net holdings per asset — the read model the client actually wants
    // O(n) time | O(a) space
    getPortfolio: function (userId) {
      const holdings = new Map();
      for (const trade of store.list({ userId: userId })) {
        const delta = trade.side === 'buy' ? trade.quantity : -trade.quantity;
        holdings.set(trade.asset, (holdings.get(trade.asset) || 0) + delta);
      }
      return Object.fromEntries(holdings);
    }
  };
}

console.log('\n=== 4. crud api + validation ===');
const store = createStore();
const trades = createTradeService(store);

// rejected: bad side, non-positive quantity, missing asset -> 3 errors
console.log('bad payload  ->', trades.addTrade({ userId: 'u1', side: 'short', quantity: 0 }));
// accepted, and the store assigns the id
console.log('good payload ->', trades.addTrade({ userId: 'u1', asset: 'BTC', side: 'buy', quantity: 2 }));

trades.addTrade({ userId: 'u1', asset: 'BTC', side: 'sell', quantity: 0.5 });
trades.addTrade({ userId: 'u1', asset: 'ETH', side: 'buy',  quantity: 10 });
trades.addTrade({ userId: 'u2', asset: 'SOL', side: 'buy',  quantity: 40 });

console.log('u1 trades:', trades.getUserTrades('u1').length);      // expect 3
console.log('u1 portfolio:', trades.getPortfolio('u1'));            // expect BTC 1.5, ETH 10
console.log('u2 portfolio:', trades.getPortfolio('u2'));            // expect SOL 40


/* ==========================================================================
   TALKING POINTS — glance at this right before the call

   - Nested .find() inside .map() is O(n*m). Build a Map first: O(n+m). This is
     the most common "make it faster" follow-up there is.
   - Anything with "running", "so far", or "as of" means: sort first, then one
     pass carrying state. Say the sort is O(n log n) and dominates.
   - .slice() before .sort(). sort() mutates the caller's array.
   - Grouping/counting/deduping is a Map or a Set. Reach for it by default.
   - Keep validation OUT of the store. Pure validators are testable and reusable
     across HTTP, imports, and queue consumers.
   - Money as a float compounds error across a ledger. Real systems use integer
     minor units. Round once at the display boundary, never mid-loop.
   - "How would this scale?" -> stream instead of loading the file, index instead
     of scanning, paginate instead of returning everything.
   - State assumptions out loud and write them as a comment. Ambiguity in the
     prompt is usually deliberate — they want to hear you notice it.
   ========================================================================== */
