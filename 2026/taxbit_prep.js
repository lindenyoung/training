/* ============================================================================
   TaxBit — SWE 2 coding round prep
   ----------------------------------------------------------------------------
   HOW TO RUN (from repo root: ~/career/interviewing/training)

     node --version                    # this file targets Node v16 — no toSorted/Object.groupBy
     node 2026/taxbit_prep.js          # run everything, all checks should print PASS
     node 2026/taxbit_prep.js drills   # Part 1 only — grouping / aggregation ladder
     node 2026/taxbit_prep.js fifo     # Part 2 only — cost basis & realized gains
     node 2026/taxbit_prep.js repo     # Part 3 only — model + data access + service

   Ad hoc, without editing the file (both replay main()'s output first):
     node -e "$(cat 2026/taxbit_prep.js); console.log(topNByUsdValue(TRANSACTIONS, 3))"

   Interactive — best for "can you also show me X?" mid-call:
     node -i
     > .load 2026/taxbit_prep.js
     > totalVolumeByUser(TRANSACTIONS)
     > realizedGains(TRANSACTIONS, 'u2', 'hifo')

   No watch mode on v16 — just re-run after each edit. Normal loop is:
   write function -> add a console.log at the bottom -> node the file -> read output.

   Format notes: pair programming, any language, no pseudocode, must run clean.
   Expect "data in -> process -> answer", then follow-ups that build on the answer.
   ============================================================================ */

/* --------------------------------------------------------------------------
   1. Micro test harness
   Hand-rolled on purpose: zero deps, instant output. Say out loud that in a
   real repo this is Jest — this is just so we can vet output together live.
   -------------------------------------------------------------------------- */

let PASSED = 0;
let FAILED = 0;

// stable stringify: sorts object keys so a deep compare doesn't care about
// insertion order (Maps preserve it, and my expected values won't match it)
function stable(value) {
  return JSON.stringify(value, function (key, val) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).sort().reduce(function (acc, k) { acc[k] = val[k]; return acc; }, {});
    }
    return val;
  });
}

function check(label, actual, expected) {
  const a = stable(actual);
  const e = stable(expected);
  if (a === e) {
    PASSED++;
    console.log('  PASS  ' + label);
  } else {
    FAILED++;
    console.log('  FAIL  ' + label);
    console.log('        expected: ' + e);
    console.log('        actual:   ' + a);
  }
}

function section(title) {
  console.log('\n' + '='.repeat(70));
  console.log(title);
  console.log('='.repeat(70));
}

/* --------------------------------------------------------------------------
   2. Sample data — a crypto transaction ledger
   Deliberately NOT in chronological order: sorting is a step I should have to
   notice, not one the data hands me for free.
   -------------------------------------------------------------------------- */

const TRANSACTIONS = [
  // u1 — BTC, two buys then a partial sell (exercises FIFO lot splitting)
  { id: 't3',  userId: 'u1', timestamp: '2024-03-10T10:00:00Z', asset: 'BTC', side: 'sell', quantity: 1.2, unitPriceUsd: 40000, feeUsd: 100 },
  { id: 't1',  userId: 'u1', timestamp: '2024-01-05T10:00:00Z', asset: 'BTC', side: 'buy',  quantity: 1.0, unitPriceUsd: 20000, feeUsd: 50 },
  { id: 't2',  userId: 'u1', timestamp: '2024-01-20T10:00:00Z', asset: 'BTC', side: 'buy',  quantity: 0.5, unitPriceUsd: 30000, feeUsd: 25 },

  // u1 — ETH, held >1yr (exercises the short-term / long-term split)
  { id: 't4',  userId: 'u1', timestamp: '2023-01-10T09:00:00Z', asset: 'ETH', side: 'buy',  quantity: 10,  unitPriceUsd: 1500,  feeUsd: 0 },
  { id: 't5',  userId: 'u1', timestamp: '2024-02-15T09:00:00Z', asset: 'ETH', side: 'sell', quantity: 4,   unitPriceUsd: 3000,  feeUsd: 0 },

  // u2 — SOL, three buys at different prices then one sell.
  // Chosen so FIFO / LIFO / HIFO give three different answers.
  { id: 't6',  userId: 'u2', timestamp: '2024-01-08T12:00:00Z', asset: 'SOL', side: 'buy',  quantity: 100, unitPriceUsd: 20,    feeUsd: 0 },
  { id: 't7',  userId: 'u2', timestamp: '2024-02-08T12:00:00Z', asset: 'SOL', side: 'buy',  quantity: 100, unitPriceUsd: 50,    feeUsd: 0 },
  { id: 't8',  userId: 'u2', timestamp: '2024-03-08T12:00:00Z', asset: 'SOL', side: 'buy',  quantity: 100, unitPriceUsd: 35,    feeUsd: 0 },
  { id: 't9',  userId: 'u2', timestamp: '2024-04-08T12:00:00Z', asset: 'SOL', side: 'sell', quantity: 150, unitPriceUsd: 60,    feeUsd: 0 },

  // u3 — a sell with no prior buy (overdraft / unmatched disposal edge case)
  { id: 't10', userId: 'u3', timestamp: '2024-02-01T08:00:00Z', asset: 'BTC', side: 'sell', quantity: 0.5, unitPriceUsd: 45000, feeUsd: 10 },

  // u3 — ETH over a few days in May, with 05-03 and 05-04 missing (gap filling)
  { id: 't11', userId: 'u3', timestamp: '2024-05-01T10:00:00Z', asset: 'ETH', side: 'buy',  quantity: 2,   unitPriceUsd: 3100,  feeUsd: 5 },
  { id: 't12', userId: 'u3', timestamp: '2024-05-02T10:00:00Z', asset: 'ETH', side: 'buy',  quantity: 1,   unitPriceUsd: 3200,  feeUsd: 5 },
  { id: 't13', userId: 'u3', timestamp: '2024-05-05T10:00:00Z', asset: 'ETH', side: 'sell', quantity: 1,   unitPriceUsd: 3300,  feeUsd: 5 }
];

/* --------------------------------------------------------------------------
   Shared helpers
   -------------------------------------------------------------------------- */

// gross notional, fees excluded — "volume" in the exchange sense
function usdValue(txn) {
  return txn.quantity * txn.unitPriceUsd;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// crypto quantities need more precision than money does
function round8(n) {
  return Math.round(n * 1e8) / 1e8;
}

function dayKey(timestamp) {
  return timestamp.slice(0, 10); // ISO strings are already YYYY-MM-DD...
}

function byTimeAsc(a, b) {
  return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
}

// Map -> plain object, so console.log and JSON.stringify actually show contents.
// Worth saying out loud: I aggregate into a Map (any key type, no prototype
// collisions on keys like "constructor"), then convert at the boundary.
function mapToObj(map) {
  return Object.fromEntries(map);
}

/* ==========================================================================
   PART 1 — the data-processing ladder
   Each level is the previous level plus one more requirement, which is how
   these rounds actually go ("nice — now can you also...").
   ========================================================================== */

// Level 1: total USD volume per user
// O(n) time | O(u) space, u = distinct users
function totalVolumeByUser(txns) {
  const totals = new Map();
  for (const txn of txns) {
    totals.set(txn.userId, (totals.get(txn.userId) || 0) + usdValue(txn));
  }
  return mapToObj(totals);
}

// Level 2: break that down per user PER ASSET
// O(n) time | O(u * a) space
// Two ways to key a 2-D grouping. Nested maps read better and let you ask
// "everything for u1" in one lookup; a composite "u1|BTC" key is flatter and
// faster to write but you have to split the string to get the parts back.
function volumeByUserAndAsset(txns) {
  const byUser = new Map();
  for (const txn of txns) {
    if (!byUser.has(txn.userId)) byUser.set(txn.userId, new Map());
    const byAsset = byUser.get(txn.userId);
    byAsset.set(txn.asset, (byAsset.get(txn.asset) || 0) + usdValue(txn));
  }
  const out = {};
  for (const [userId, byAsset] of byUser) out[userId] = mapToObj(byAsset);
  return out;
}

// alternate: composite key, one flat pass — keep both, discuss the tradeoff
// function volumeByUserAndAssetFlat(txns) {
//   const totals = new Map();
//   for (const txn of txns) {
//     const key = txn.userId + '|' + txn.asset;
//     totals.set(key, (totals.get(key) || 0) + usdValue(txn));
//   }
//   return mapToObj(totals);
// }

// Level 3: running balance per user per asset, flagging sells that overdraw
// O(n log n) time (the sort dominates) | O(u * a) space
// The sort is the whole point: "running" means order matters, and the input
// array is not sorted. Balances are rounded because 1.0 + 0.5 - 1.2 in binary
// floating point is 0.30000000000000004, not 0.3.
function runningBalances(txns) {
  const ordered = txns.slice().sort(byTimeAsc);
  const balances = new Map(); // userId -> Map<asset, qty>
  const overdrafts = [];

  for (const txn of ordered) {
    if (!balances.has(txn.userId)) balances.set(txn.userId, new Map());
    const byAsset = balances.get(txn.userId);
    const available = byAsset.get(txn.asset) || 0;

    if (txn.side === 'sell' && txn.quantity > available) {
      overdrafts.push({
        txnId: txn.id,
        userId: txn.userId,
        asset: txn.asset,
        attempted: txn.quantity,
        available: round8(available)
      });
    }

    const delta = txn.side === 'buy' ? txn.quantity : -txn.quantity;
    byAsset.set(txn.asset, round8(available + delta));
  }

  const out = {};
  for (const [userId, byAsset] of balances) out[userId] = mapToObj(byAsset);
  return { balances: out, overdrafts: overdrafts };
}

// Level 4: N largest transactions by USD value
// O(n log n) time | O(n) space
// Explicit tiebreak so the result is deterministic — equal value, earlier wins.
// Follow-up worth naming: a size-N min-heap gets this to O(n log N), which
// matters when n is millions and N is 10. Not worth it at this size.
function topNByUsdValue(txns, n) {
  return txns
    .slice()
    .sort(function (a, b) {
      const diff = usdValue(b) - usdValue(a);
      if (diff !== 0) return diff;
      return byTimeAsc(a, b);
    })
    .slice(0, n);
}

// Level 5: daily volume series for one asset, with missing days filled as 0
// O(n + d) time | O(d) space, d = days in the window
// The gap filling is the classic follow-up. Iterating in UTC milliseconds
// avoids every DST / local-timezone trap.
function dailyVolumeSeries(txns, asset, startDate, endDate) {
  const totals = new Map();
  for (const txn of txns) {
    if (txn.asset !== asset) continue;
    const day = dayKey(txn.timestamp);
    if (day < startDate || day > endDate) continue;
    totals.set(day, (totals.get(day) || 0) + usdValue(txn));
  }

  const series = [];
  let cursor = Date.parse(startDate + 'T00:00:00Z');
  const end = Date.parse(endDate + 'T00:00:00Z');
  const ONE_DAY = 24 * 60 * 60 * 1000;

  while (cursor <= end) {
    const day = new Date(cursor).toISOString().slice(0, 10);
    series.push({ date: day, volumeUsd: round2(totals.get(day) || 0) });
    cursor += ONE_DAY;
  }
  return series;
}

/* ==========================================================================
   PART 2 — cost basis & realized gain/loss
   This is TaxBit's actual domain, and it is exactly the shape these rounds
   like: walk a ledger in order, maintain state, emit a computed result.

   Model: every buy opens a "lot". Every sell closes lots, oldest first (FIFO),
   splitting a lot when the sell only consumes part of it.
     cost basis = what you paid, fees included
     proceeds   = what you got, fees deducted
     gain       = proceeds - cost basis
     term       = long if held > 365 days, else short
   ========================================================================== */

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function holdingTerm(acquiredAt, soldAt) {
  return Date.parse(soldAt) - Date.parse(acquiredAt) > ONE_YEAR_MS ? 'long' : 'short';
}

// FIRST PASS — FIFO only. Kept because the progression from this to the
// strategy-driven version below is the interesting part of the conversation.
// O(n log n) time | O(L) space, L = open lots
function realizedGainsFifo(txns, userId) {
  const ordered = txns
    .filter((t) => t.userId === userId)
    .sort(byTimeAsc);

  const lotsByAsset = new Map(); // asset -> array of lots, oldest first
  const disposals = [];
  const unmatched = [];
  let total = 0;

  for (const txn of ordered) {
    if (!lotsByAsset.has(txn.asset)) lotsByAsset.set(txn.asset, []);
    const lots = lotsByAsset.get(txn.asset);

    if (txn.side === 'buy') {
      // fees paid on acquisition increase your basis
      lots.push({
        qty: txn.quantity,
        costBasisPerUnit: (txn.quantity * txn.unitPriceUsd + txn.feeUsd) / txn.quantity,
        acquiredAt: txn.timestamp
      });
      continue;
    }

    let remaining = txn.quantity;
    while (remaining > 1e-9 && lots.length > 0) {
      const lot = lots[0];                       // <-- FIFO: always the oldest
      const taken = Math.min(lot.qty, remaining);

      // fees paid on disposal reduce proceeds, split across lots by quantity
      const proceeds = taken * txn.unitPriceUsd - txn.feeUsd * (taken / txn.quantity);
      const costBasis = taken * lot.costBasisPerUnit;

      disposals.push({
        txnId: txn.id,
        asset: txn.asset,
        qty: round8(taken),
        proceeds: round2(proceeds),
        costBasis: round2(costBasis),
        gain: round2(proceeds - costBasis),
        acquiredAt: lot.acquiredAt,
        soldAt: txn.timestamp,
        term: holdingTerm(lot.acquiredAt, txn.timestamp)
      });

      total += proceeds - costBasis;
      lot.qty = round8(lot.qty - taken);
      remaining = round8(remaining - taken);
      if (lot.qty <= 1e-9) lots.shift();
    }

    // sold more than we ever acquired — real data does this constantly
    // (transfers in from another exchange, missing history)
    if (remaining > 1e-9) {
      unmatched.push({ txnId: txn.id, asset: txn.asset, qty: round8(remaining) });
    }
  }

  const remainingLots = {};
  for (const [asset, lots] of lotsByAsset) {
    if (lots.length > 0) remainingLots[asset] = lots;
  }

  return {
    disposals: disposals,
    unmatched: unmatched,
    totalRealizedGain: round2(total),
    remainingLots: remainingLots
  };
}

// THE FOLLOW-UP — "now support LIFO and HIFO too."
// The whole loop above is identical; the ONLY thing that varies is which open
// lot you consume next. So pull exactly that out and leave everything else
// alone, rather than copy-pasting the function three times.
//   fifo — oldest lot first (default, and what the IRS assumes)
//   lifo — newest lot first
//   hifo — highest cost basis first, which minimizes the taxable gain
function pickLotIndex(lots, strategy) {
  if (strategy === 'lifo') return lots.length - 1;
  if (strategy === 'hifo') {
    let best = 0;
    for (let i = 1; i < lots.length; i++) {
      if (lots[i].costBasisPerUnit > lots[best].costBasisPerUnit) best = i;
    }
    return best;
  }
  return 0; // fifo
}

// O(n log n + d * L) time | O(L) space — the d*L term is the HIFO lot scan;
// a max-heap keyed on basis would make it d log L if L ever got large.
function realizedGains(txns, userId, strategy) {
  const pick = strategy || 'fifo';
  const ordered = txns
    .filter(function (t) { return t.userId === userId; })
    .sort(byTimeAsc);

  const lotsByAsset = new Map();
  const disposals = [];
  const unmatched = [];
  let total = 0;

  for (const txn of ordered) {
    if (!lotsByAsset.has(txn.asset)) lotsByAsset.set(txn.asset, []);
    const lots = lotsByAsset.get(txn.asset);

    if (txn.side === 'buy') {
      lots.push({
        qty: txn.quantity,
        costBasisPerUnit: (txn.quantity * txn.unitPriceUsd + txn.feeUsd) / txn.quantity,
        acquiredAt: txn.timestamp
      });
      continue;
    }

    let remaining = txn.quantity;
    while (remaining > 1e-9 && lots.length > 0) {
      const idx = pickLotIndex(lots, pick);   // <-- the only line that changed
      const lot = lots[idx];
      const taken = Math.min(lot.qty, remaining);

      const proceeds = taken * txn.unitPriceUsd - txn.feeUsd * (taken / txn.quantity);
      const costBasis = taken * lot.costBasisPerUnit;

      disposals.push({
        txnId: txn.id,
        asset: txn.asset,
        qty: round8(taken),
        proceeds: round2(proceeds),
        costBasis: round2(costBasis),
        gain: round2(proceeds - costBasis),
        acquiredAt: lot.acquiredAt,
        soldAt: txn.timestamp,
        term: holdingTerm(lot.acquiredAt, txn.timestamp)
      });

      total += proceeds - costBasis;
      lot.qty = round8(lot.qty - taken);
      remaining = round8(remaining - taken);
      if (lot.qty <= 1e-9) lots.splice(idx, 1);
    }

    if (remaining > 1e-9) {
      unmatched.push({ txnId: txn.id, asset: txn.asset, qty: round8(remaining) });
    }
  }

  return { disposals: disposals, unmatched: unmatched, totalRealizedGain: round2(total) };
}

// second follow-up: split the total by tax treatment, since short-term and
// long-term are taxed at different rates. Reuses the result above — no new
// traversal of the ledger.
// O(d) time | O(1) space
function gainsByTerm(txns, userId, strategy) {
  const result = realizedGains(txns, userId, strategy);
  let short = 0;
  let long = 0;
  for (const d of result.disposals) {
    if (d.term === 'long') long += d.gain;
    else short += d.gain;
  }
  return { shortTerm: round2(short), longTerm: round2(long), total: result.totalRealizedGain };
}

/* ==========================================================================
   PART 3 — model + data access layer + service
   The fallback if the prompt is "build an API" rather than "compute this".
   In-memory, no HTTP, no deps — but the LAYERING is the point:
     validation  knows the shape of a transaction, nothing else
     repository  knows storage and indexes, never validates
     service     orchestrates; never touches the underlying Map
   Swapping the repo for Postgres later touches exactly one of those three.
   ========================================================================== */

const VALID_SIDES = ['buy', 'sell'];

// O(1) time | O(1) space
function validateTransaction(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return { valid: false, errors: ['payload must be an object'] };

  if (!input.userId) errors.push('userId is required');
  if (!input.asset) errors.push('asset is required');
  if (VALID_SIDES.indexOf(input.side) === -1) errors.push('side must be one of: ' + VALID_SIDES.join(', '));
  if (typeof input.quantity !== 'number' || !(input.quantity > 0)) errors.push('quantity must be a positive number');
  if (typeof input.unitPriceUsd !== 'number' || input.unitPriceUsd < 0) errors.push('unitPriceUsd must be a non-negative number');
  if (input.feeUsd != null && (typeof input.feeUsd !== 'number' || input.feeUsd < 0)) errors.push('feeUsd must be a non-negative number');
  if (!input.timestamp || isNaN(Date.parse(input.timestamp))) errors.push('timestamp must be a parseable date');

  return { valid: errors.length === 0, errors: errors };
}

// Data access layer. Closure over the storage so nothing outside can reach in
// and mutate the Map directly — same guarantee a real DB gives you.
function createTxnRepo(seed) {
  const byId = new Map();                    // id -> transaction
  const byUserAsset = new Map();             // "userId|asset" -> Set<id>   (secondary index)
  let nextId = 1;

  function indexKey(userId, asset) {
    return userId + '|' + asset;
  }

  function addToIndex(txn) {
    const key = indexKey(txn.userId, txn.asset);
    if (!byUserAsset.has(key)) byUserAsset.set(key, new Set());
    byUserAsset.get(key).add(txn.id);
  }

  function removeFromIndex(txn) {
    const set = byUserAsset.get(indexKey(txn.userId, txn.asset));
    if (set) {
      set.delete(txn.id);
      if (set.size === 0) byUserAsset.delete(indexKey(txn.userId, txn.asset));
    }
  }

  const repo = {
    // O(1)
    insert: function (txn) {
      const record = Object.assign({}, txn);
      if (!record.id) record.id = 'txn_' + nextId++;
      if (record.feeUsd == null) record.feeUsd = 0;
      if (byId.has(record.id)) throw new Error('duplicate id: ' + record.id);
      byId.set(record.id, record);
      addToIndex(record);
      return Object.assign({}, record); // hand back a copy, not our internal object
    },

    // O(1)
    findById: function (id) {
      const found = byId.get(id);
      return found ? Object.assign({}, found) : null;
    },

    // O(k) when the filter hits the index, O(n) when it doesn't.
    // This is the interesting bit to talk through: it's the same tradeoff a
    // real query planner makes — use the index if the predicate matches it,
    // otherwise fall back to a full scan.
    findBy: function (filter) {
      const f = filter || {};
      let candidates;

      if (f.userId && f.asset) {
        const ids = byUserAsset.get(indexKey(f.userId, f.asset));
        candidates = ids ? Array.from(ids, function (id) { return byId.get(id); }) : [];
      } else {
        candidates = Array.from(byId.values()); // full scan
      }

      return candidates
        .filter(function (t) {
          if (f.userId && t.userId !== f.userId) return false;
          if (f.asset && t.asset !== f.asset) return false;
          if (f.side && t.side !== f.side) return false;
          if (f.from && t.timestamp < f.from) return false;
          if (f.to && t.timestamp > f.to) return false;
          return true;
        })
        .map(function (t) { return Object.assign({}, t); })
        .sort(byTimeAsc);
    },

    // O(1) — reindexes if the patch moves the record to a different bucket
    update: function (id, patch) {
      const existing = byId.get(id);
      if (!existing) return null;
      const updated = Object.assign({}, existing, patch, { id: id });
      removeFromIndex(existing);
      byId.set(id, updated);
      addToIndex(updated);
      return Object.assign({}, updated);
    },

    // O(1)
    remove: function (id) {
      const existing = byId.get(id);
      if (!existing) return false;
      removeFromIndex(existing);
      byId.delete(id);
      return true;
    },

    // O(n)
    all: function () {
      return Array.from(byId.values(), function (t) { return Object.assign({}, t); }).sort(byTimeAsc);
    },

    count: function () {
      return byId.size;
    }
  };

  if (seed) for (const txn of seed) repo.insert(txn);
  return repo;
}

// Service layer — the "API" surface. Validates, delegates to the repo, and
// composes the Part 1 / Part 2 functions. Note it never touches a Map.
function createLedgerService(repo) {
  return {
    recordTrade: function (input) {
      const validation = validateTransaction(input);
      if (!validation.valid) return { ok: false, errors: validation.errors };
      return { ok: true, transaction: repo.insert(input) };
    },

    getTransactions: function (filter) {
      return repo.findBy(filter);
    },

    // current holdings per asset for one user
    getPortfolio: function (userId) {
      const txns = repo.findBy({ userId: userId });
      const holdings = new Map();
      for (const txn of txns) {
        const delta = txn.side === 'buy' ? txn.quantity : -txn.quantity;
        holdings.set(txn.asset, round8((holdings.get(txn.asset) || 0) + delta));
      }
      return mapToObj(holdings);
    },

    getRealizedGains: function (userId, strategy) {
      return gainsByTerm(repo.findBy({ userId: userId }), userId, strategy);
    }
  };
}

/* --------------------------------------------------------------------------
   A NOTE ON MONEY — say this before they ask

   0.1 + 0.2 === 0.30000000000000004. Binary floating point cannot represent
   most decimal fractions, so errors compound across a long ledger. Production
   accounting keeps integer minor units (cents, or satoshis) or a decimal
   library, and only converts to a float at the display boundary. Crypto also
   needs far more than 2 decimal places — BTC goes to 8, ETH to 18.

   I use plain numbers here for readability, round8() on quantities, round2()
   on dollars, and an epsilon (1e-9) instead of === 0 when draining a lot.
   -------------------------------------------------------------------------- */

/* ==========================================================================
   Runner
   ========================================================================== */

function runDrills() {
  section('PART 1 — grouping / aggregation ladder');

  console.log('\nLevel 1 — total USD volume by user:');
  console.log(totalVolumeByUser(TRANSACTIONS));
  check('volume by user', totalVolumeByUser(TRANSACTIONS), { u1: 110000, u2: 19500, u3: 35200 });

  console.log('\nLevel 2 — volume by user and asset:');
  console.log(JSON.stringify(volumeByUserAndAsset(TRANSACTIONS), null, 2));
  check('volume by user+asset', volumeByUserAndAsset(TRANSACTIONS), {
    u1: { BTC: 83000, ETH: 27000 },
    u2: { SOL: 19500 },
    u3: { BTC: 22500, ETH: 12700 }
  });

  console.log('\nLevel 3 — running balances + overdrafts:');
  const rb = runningBalances(TRANSACTIONS);
  console.log(JSON.stringify(rb, null, 2));
  check('final balances', rb.balances, {
    u1: { ETH: 6, BTC: 0.3 },
    u2: { SOL: 150 },
    u3: { BTC: -0.5, ETH: 2 }
  });
  check('one overdraft detected', rb.overdrafts.map(function (o) { return o.txnId; }), ['t10']);

  console.log('\nLevel 4 — top 3 transactions by USD value:');
  const top3 = topNByUsdValue(TRANSACTIONS, 3);
  console.log(top3.map(function (t) { return t.id + ': $' + usdValue(t); }));
  check('top 3 ids', top3.map(function (t) { return t.id; }), ['t3', 't10', 't1']);
  // tiebreak: t4 and t2 are both $15,000 — earlier timestamp wins
  check('tiebreak by timestamp', topNByUsdValue(TRANSACTIONS, 5).map(function (t) { return t.id; }),
    ['t3', 't10', 't1', 't4', 't2']);

  console.log('\nLevel 5 — daily ETH volume for May 1-5 (gaps filled with 0):');
  const series = dailyVolumeSeries(TRANSACTIONS, 'ETH', '2024-05-01', '2024-05-05');
  console.table ? console.table(series) : console.log(series);
  check('daily series with gaps', series, [
    { date: '2024-05-01', volumeUsd: 6200 },
    { date: '2024-05-02', volumeUsd: 3200 },
    { date: '2024-05-03', volumeUsd: 0 },
    { date: '2024-05-04', volumeUsd: 0 },
    { date: '2024-05-05', volumeUsd: 3300 }
  ]);
}

function runFifo() {
  section('PART 2 — cost basis & realized gains');

  console.log('\nu1 — FIFO disposals (first-pass implementation):');
  const u1 = realizedGainsFifo(TRANSACTIONS, 'u1');
  console.log(JSON.stringify(u1.disposals, null, 2));
  console.log('total realized gain: $' + u1.totalRealizedGain);

  // hand-checked:
  //   ETH: sold 4 @ $3000 = $12,000 proceeds, basis 4 * $1500 = $6,000  -> +$6,000 (long, held 401d)
  //   BTC: sold 1.2 @ $40,000 less $100 fee = $47,900 proceeds
  //        basis = 1.0 @ $20,050 + 0.2 @ $30,050 = $26,060             -> +$21,840 (short)
  check('u1 total realized gain', u1.totalRealizedGain, 27840);
  check('u1 disposal count', u1.disposals.length, 3);
  check('u1 ETH lot is long-term', u1.disposals[0].term, 'long');
  check('u1 has no unmatched sells', u1.unmatched, []);
  check('u1 leftover BTC lot', round8(u1.remainingLots.BTC[0].qty), 0.3);

  console.log('\nu3 — sell with no prior buy (unmatched disposal):');
  const u3 = realizedGainsFifo(TRANSACTIONS, 'u3');
  console.log(u3.unmatched);
  check('u3 unmatched sell flagged', u3.unmatched, [{ txnId: 't10', asset: 'BTC', qty: 0.5 }]);

  console.log('\nFOLLOW-UP — same ledger, three lot-selection strategies (u2 SOL):');
  // bought 100 @ $20, 100 @ $50, 100 @ $35; sold 150 @ $60 = $9,000 proceeds
  const fifo = realizedGains(TRANSACTIONS, 'u2', 'fifo');
  const lifo = realizedGains(TRANSACTIONS, 'u2', 'lifo');
  const hifo = realizedGains(TRANSACTIONS, 'u2', 'hifo');
  console.log('  fifo: $' + fifo.totalRealizedGain + '  (basis 100@$20 + 50@$50 = $4,500)');
  console.log('  lifo: $' + lifo.totalRealizedGain + '  (basis 100@$35 + 50@$50 = $6,000)');
  console.log('  hifo: $' + hifo.totalRealizedGain + '  (basis 100@$50 + 50@$35 = $6,750)');
  check('u2 fifo gain', fifo.totalRealizedGain, 4500);
  check('u2 lifo gain', lifo.totalRealizedGain, 3000);
  check('u2 hifo gain', hifo.totalRealizedGain, 2250);
  check('refactor matches first pass', realizedGains(TRANSACTIONS, 'u1', 'fifo').totalRealizedGain,
    realizedGainsFifo(TRANSACTIONS, 'u1').totalRealizedGain);

  console.log('\nFOLLOW-UP — split u1 by tax treatment:');
  const split = gainsByTerm(TRANSACTIONS, 'u1', 'fifo');
  console.log(split);
  check('u1 short/long split', split, { shortTerm: 21840, longTerm: 6000, total: 27840 });
}

function runRepo() {
  section('PART 3 — model, data access layer, service');

  const repo = createTxnRepo(TRANSACTIONS);
  const ledger = createLedgerService(repo);

  console.log('\nseeded ' + repo.count() + ' transactions');
  check('seeded count', repo.count(), 13);

  console.log('\nvalidation rejects a bad payload:');
  const bad = ledger.recordTrade({ userId: 'u4', asset: 'BTC', side: 'short', quantity: -1, unitPriceUsd: 100 });
  console.log(bad.errors);
  check('bad trade rejected', bad.ok, false);
  // 3 errors: invalid side, non-positive quantity, missing timestamp
  check('bad trade error count', bad.errors.length, 3);

  console.log('\nvalidation accepts a good one, and the repo assigns an id:');
  const good = ledger.recordTrade({
    userId: 'u4', asset: 'BTC', side: 'buy',
    quantity: 0.25, unitPriceUsd: 60000, feeUsd: 15,
    timestamp: '2024-06-01T00:00:00Z'
  });
  console.log(good.transaction);
  check('good trade accepted', good.ok, true);
  check('id was generated', good.transaction.id, 'txn_1');

  console.log('\nindexed lookup — findBy({ userId: u1, asset: BTC }):');
  const u1btc = repo.findBy({ userId: 'u1', asset: 'BTC' });
  console.log(u1btc.map(function (t) { return t.id; }));
  check('indexed lookup', u1btc.map(function (t) { return t.id; }), ['t1', 't2', 't3']);

  console.log('\nfull scan fallback — findBy({ side: sell }):');
  check('scan fallback', repo.findBy({ side: 'sell' }).map(function (t) { return t.id; }),
    ['t10', 't5', 't3', 't9', 't13']);

  console.log('\ndate-range filter — u1 BTC in Q1 2024:');
  check('range filter', repo.findBy({ userId: 'u1', asset: 'BTC', from: '2024-01-10', to: '2024-02-01' })
    .map(function (t) { return t.id; }), ['t2']);

  console.log('\nservice — u1 portfolio:');
  console.log(ledger.getPortfolio('u1'));
  check('u1 portfolio', ledger.getPortfolio('u1'), { BTC: 0.3, ETH: 6 });

  console.log('\nservice — u1 realized gains:');
  console.log(ledger.getRealizedGains('u1', 'fifo'));
  check('service gains match', ledger.getRealizedGains('u1', 'fifo'),
    { shortTerm: 21840, longTerm: 6000, total: 27840 });

  console.log('\nupdate + remove:');
  repo.update('t1', { quantity: 2.0 });
  check('update applied', repo.findById('t1').quantity, 2.0);
  check('remove returns true', repo.remove('t1'), true);
  check('remove is idempotent', repo.remove('t1'), false);
  check('gone from index', repo.findBy({ userId: 'u1', asset: 'BTC' }).map(function (t) { return t.id; }),
    ['t2', 't3']);
}

function main() {
  const which = process.argv[2] || 'all';

  if (which === 'all' || which === 'drills') runDrills();
  if (which === 'all' || which === 'fifo') runFifo();
  if (which === 'all' || which === 'repo') runRepo();

  section(FAILED === 0 ? 'ALL CHECKS PASSED (' + PASSED + ')' : PASSED + ' passed, ' + FAILED + ' FAILED');
  if (FAILED > 0) process.exitCode = 1;
}

main();
