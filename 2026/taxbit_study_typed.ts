/* ============================================================================
   TaxBit — SWE 2 coding round STUDY SHEET (TypeScript)

     npx tsx@3 2026/taxbit_study_typed.ts     <- run it. PIN @3: tsx v4 needs
                                                 Node 18+, this machine is on 16.
     tsc --noEmit --strict --target es2020 2026/taxbit_study_typed.ts
                                              <- typecheck only, no output files

   WARNING: do NOT run bare `tsc` on a .ts file here. With no tsconfig it emits
   a .js next to the source — `tsc 2026/taxbit_study.ts` would overwrite the
   JavaScript study file. That's why this one is named _typed.

   Same four problems as taxbit_study.js, typed. The types aren't decoration:
   each section notes where the compiler catches something JS would let through.
   ============================================================================ */


/* ==========================================================================
   1. PARSE RAW TEXT -> RECORDS -> AGGREGATE

   TS lesson: data off a CSV is `string`, always. The types you write here are
   a CLAIM about untrusted input, not a guarantee — so parse into a known
   shape explicitly rather than casting the whole blob and hoping.
   ========================================================================== */

interface CsvTrade {
  id: string;
  userId: string;
  asset: string;
  quantity: number;
  unitPriceUsd: number;
}

const RAW_CSV: string = `
id,userId,asset,quantity,unitPriceUsd
t1,u1,BTC,0.5,20000
t2,u2,ETH,3,1500
t3,u1,BTC,1.5,22000

  t4,u3,SOL,100,35
t5,u2,ETH,2,1600
`;

// Header-driven so column ORDER never matters. Note the two-step: build an
// untyped Record<string, string> from the headers, THEN map it to the real
// shape field by field. That second step is where `string` becomes `number`,
// and it's the only place a bad column name can hide.
// O(n * c) time | O(n * c) space, c = columns
function parseCsv(raw: string): CsvTrade[] {
  const lines: string[] = raw
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const headers: string[] = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const cell: Record<string, string> = {};
    headers.forEach((header, i) => {
      cell[header] = (cells[i] ?? '').trim();
    });

    // the conversion boundary — everything above is strings
    return {
      id: cell.id,
      userId: cell.userId,
      asset: cell.asset,
      quantity: Number(cell.quantity),
      unitPriceUsd: Number(cell.unitPriceUsd)
    };
  });
}

// O(n) time | O(a) space, a = distinct assets
function totalUsdByAsset(rows: CsvTrade[]): Record<string, number> {
  const totals = new Map<string, number>();
  for (const row of rows) {
    const usd = row.quantity * row.unitPriceUsd;
    totals.set(row.asset, (totals.get(row.asset) ?? 0) + usd);
  }
  return Object.fromEntries(totals);
}

// FOLLOW-UPS THEY'LL ASK:
//   "what if a field contains a comma?"  -> "Smith, Jr" breaks split(','). Real
//      CSV needs quote handling; I'd reach for a parser rather than regex it.
//   "what if a row is malformed?"        -> decide explicitly: skip it, or return
//      { rows, errors }. Never silently mangle it. In TS the honest signature is
//      parseCsv(raw): { rows: CsvTrade[]; errors: string[] }.
//   "what if the file is 10GB?"          -> stream line by line, don't hold the
//      whole string in memory.

console.log('\n=== 1. parse raw text -> aggregate ===');
const parsedRows: CsvTrade[] = parseCsv(RAW_CSV);
console.log('parsed', parsedRows.length, 'rows; first row:', parsedRows[0]);
// expect: BTC 43000 (10000 + 33000), ETH 7700 (4500 + 3200), SOL 3500
console.log('total USD by asset:', totalUsdByAsset(parsedRows));


/* ==========================================================================
   2. JOIN TWO DATASETS

   TS lesson: Map.get() returns `User | undefined`. The compiler will NOT let
   you write user.name until you handle the miss — so the orphan row stops
   being an edge case you forgot and becomes one you were forced to decide on.
   That's the single best argument for TS in a data-processing round.
   ========================================================================== */

interface User {
  id: string;
  name: string;
  country: string;
}

interface Trade {
  id: string;
  userId: string;
  asset: string;
  amountUsd: number;
}

interface EnrichedTrade {
  tradeId: string;
  user: string;
  userId: string;
  country: string | null;
  asset: string;
  amountUsd: number;
}

interface UserSummary {
  name: string;
  tradeCount: number;
  totalUsd: number;
}

const USERS: User[] = [
  { id: 'u1', name: 'Ada',   country: 'US' },
  { id: 'u2', name: 'Grace', country: 'US' },
  { id: 'u3', name: 'Linus', country: 'FI' }
];

const TRADES: Trade[] = [
  { id: 't1', userId: 'u1', asset: 'BTC', amountUsd: 10000 },
  { id: 't2', userId: 'u2', asset: 'ETH', amountUsd: 4500 },
  { id: 't3', userId: 'u1', asset: 'BTC', amountUsd: 33000 },
  { id: 't4', userId: 'u9', asset: 'SOL', amountUsd: 3500 }  // <- no such user
];

// THE WHOLE POINT: index once, then one pass.
// O(n + m) time | O(n) space
function enrichTrades(users: User[], trades: Trade[]): EnrichedTrade[] {
  const usersById = new Map<string, User>(users.map((u) => [u.id, u]));

  return trades.map((trade) => {
    // type is `User | undefined` — the compiler makes the miss unmissable
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
//   trades.map((t) => users.find((u) => u.id === t.userId))
// re-scans users for every single trade -> O(n * m). Fine for 4 rows, quadratic
// at 100k. Building the Map costs one extra pass and makes lookups O(1).
// (.find() also returns `User | undefined`, so TS doesn't save you here — only
//  the complexity changes.)

// roll-up variant: one row per user instead of one row per trade
// O(n + m) time | O(n) space
function summaryByUser(users: User[], trades: Trade[]): UserSummary[] {
  const summary = new Map<string, UserSummary>();
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
console.table(enrichTrades(USERS, TRADES));
// expect Ada 2/$43000, Grace 1/$4500, Linus 0/$0
console.log('per-user summary:', summaryByUser(USERS, TRADES));


/* ==========================================================================
   3. STATEFUL PASS / RUNNING TOTALS

   Walk records in order, carrying state. "In order" is the trap: the input
   array is NOT sorted, and nothing about it warns you.

   TS lesson: `peakAt: string | null` forces the caller to handle "no events
   yet". A union with null is cheaper and clearer than an optional field.
   ========================================================================== */

type LedgerEventType = 'deposit' | 'withdrawal';

interface LedgerEvent {
  id: string;
  timestamp: string;
  type: LedgerEventType;
  amount: number;
}

interface Overdraft {
  eventId: string;
  at: string;
  balance: number;
}

interface BalancePoint {
  at: string;
  event: string;
  balance: number;
}

interface BalanceWalk {
  finalBalance: number;
  peakBalance: number;
  peakAt: string | null;
  firstOverdraft: Overdraft | null;
  history: BalancePoint[];
}

const EVENTS: LedgerEvent[] = [
  { id: 'e3', timestamp: '2024-03-15T00:00:00Z', type: 'withdrawal', amount: 900 },
  { id: 'e1', timestamp: '2024-01-10T00:00:00Z', type: 'deposit',    amount: 500 },
  { id: 'e4', timestamp: '2024-04-02T00:00:00Z', type: 'deposit',    amount: 250 },
  { id: 'e2', timestamp: '2024-02-01T00:00:00Z', type: 'deposit',    amount: 300 },
  { id: 'e5', timestamp: '2024-05-20T00:00:00Z', type: 'withdrawal', amount: 100 }
];

// Sort first, then a single pass carrying state. The sort dominates.
// O(n log n) time | O(n) space (the copy; O(1) extra if you may mutate)
function walkBalance(events: LedgerEvent[]): BalanceWalk {
  // .slice() first — sort() mutates, and silently reordering the caller's
  // array is the kind of bug that shows up three functions away
  const ordered = events.slice().sort((a, b) => {
    return a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0;
  });

  let balance = 0;
  let peakBalance = 0;
  let peakAt: string | null = null;
  let firstOverdraft: Overdraft | null = null;
  const history: BalancePoint[] = [];

  for (const event of ordered) {
    // because LedgerEventType is a union of two literals, adding a third
    // ('transfer') makes the compiler flag every place that switches on it
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
// compound across a long ledger. Production keeps integer cents. TS does not
// help here at all — `number` is a float either way. Worth saying out loud.

console.log('\n=== 3. stateful pass / running balance ===');
const walk: BalanceWalk = walkBalance(EVENTS);
// running: 500 -> 800 -> -100 (overdraft at e3) -> 150 -> 50
console.log('running balance:');
console.table(walk.history);
console.log('final:', walk.finalBalance, '| peak:', walk.peakBalance, 'on', walk.peakAt);
console.log('first overdraft:', walk.firstOverdraft);


/* ==========================================================================
   4. CRUD API + VALIDATION

   Three layers, and the separation IS the answer:
     validate -> knows the shape of a trade, nothing about storage
     store    -> knows storage, never validates
     service  -> orchestrates, never touches the Map directly

   TS lesson, and the best thing to show off in this round: the input is
   `unknown`, and validation is what turns it into a typed value. A
   discriminated union result means you CANNOT read .trade without first
   checking .ok — the compiler enforces the error handling.
   ========================================================================== */

type Side = 'buy' | 'sell';

interface TradeRecord {
  id: string;
  userId: string;
  asset: string;
  side: Side;
  quantity: number;
}

// Omit<> keeps this in sync with TradeRecord automatically — add a field there
// and it appears here, with no second definition to forget to update.
type NewTrade = Omit<TradeRecord, 'id'>;

type ValidationResult =
  | { valid: true; value: NewTrade }
  | { valid: false; errors: string[] };

const VALID_SIDES: Side[] = ['buy', 'sell'];

// Takes `unknown`, not NewTrade — that's the honest signature for anything
// arriving over the wire. Pure, no I/O, reusable from HTTP / CSV import /
// a queue consumer.
// O(1) time | O(1) space
function validateTrade(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: ['payload must be an object'] };
  }

  // narrow once, then check fields — Partial<> says "these keys may be missing"
  const candidate = input as Partial<NewTrade>;
  const errors: string[] = [];

  if (!candidate.userId) errors.push('userId is required');
  if (!candidate.asset) errors.push('asset is required');
  if (VALID_SIDES.indexOf(candidate.side as Side) === -1) {
    errors.push('side must be buy or sell');
  }
  if (typeof candidate.quantity !== 'number' || !(candidate.quantity > 0)) {
    errors.push('quantity must be a positive number');
  }

  // collect ALL the errors and return them together — don't bail on the first,
  // one round trip per mistake is a bad API
  if (errors.length > 0) return { valid: false, errors: errors };
  return { valid: true, value: candidate as NewTrade };
}

/* ---- data access layer -------------------------------------------------- */

interface Entity {
  id: string;
}

// Generic over the row type, so the same store works for trades, users, or
// anything else with an id. Worth reaching for when they say "now add users".
interface Store<T extends Entity> {
  create(data: Omit<T, 'id'>): T;
  get(id: string): T | null;
  list(filter?: Partial<T>): T[];
  update(id: string, patch: Partial<Omit<T, 'id'>>): T | null;
  remove(id: string): boolean;
}

// The Map is closed over, so nothing outside can reach in and mutate it —
// the same guarantee a real database gives you.
function createStore<T extends Entity>(prefix: string): Store<T> {
  const rows = new Map<string, T>();
  let nextId = 1;

  return {
    // O(1)
    create(data: Omit<T, 'id'>): T {
      // the one unavoidable cast: TS can't prove { id } & Omit<T,'id'> is T
      const record = { ...data, id: prefix + nextId++ } as T;
      rows.set(record.id, record);
      return { ...record }; // return a copy, not the live object
    },

    // O(1) — `T | null` makes the caller handle the miss
    get(id: string): T | null {
      const found = rows.get(id);
      return found ? { ...found } : null;
    },

    // O(n) — full scan. THIS is the line you'd replace with an index or a SQL
    // WHERE clause, and it's the natural "how does this scale?" follow-up.
    list(filter?: Partial<T>): T[] {
      const f = (filter ?? {}) as Partial<T>;
      const keys = Object.keys(f) as Array<keyof T>;
      return Array.from(rows.values()).filter((row) =>
        keys.every((key) => row[key] === f[key])
      );
    },

    // O(1)
    update(id: string, patch: Partial<Omit<T, 'id'>>): T | null {
      const existing = rows.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...patch, id: id } as T;
      rows.set(id, updated);
      return { ...updated };
    },

    // O(1)
    remove(id: string): boolean {
      return rows.delete(id);
    }
  };
}

/* ---- service layer ------------------------------------------------------ */

// Same discriminated-union trick: you can't touch .trade until you've checked
// .ok, and you can't touch .errors on a success. No optional fields, no nulls.
type AddTradeResult =
  | { ok: true; trade: TradeRecord }
  | { ok: false; errors: string[] };

interface TradeService {
  addTrade(input: unknown): AddTradeResult;
  getUserTrades(userId: string): TradeRecord[];
  getPortfolio(userId: string): Record<string, number>;
}

function createTradeService(store: Store<TradeRecord>): TradeService {
  return {
    addTrade(input: unknown): AddTradeResult {
      const validation = validateTrade(input);
      if (!validation.valid) return { ok: false, errors: validation.errors };
      // inside this branch validation.value is NewTrade — narrowed by .valid
      return { ok: true, trade: store.create(validation.value) };
    },

    getUserTrades(userId: string): TradeRecord[] {
      return store.list({ userId: userId });
    },

    // net holdings per asset — the read model the client actually wants
    // O(n) time | O(a) space
    getPortfolio(userId: string): Record<string, number> {
      const holdings = new Map<string, number>();
      for (const trade of store.list({ userId: userId })) {
        const delta = trade.side === 'buy' ? trade.quantity : -trade.quantity;
        holdings.set(trade.asset, (holdings.get(trade.asset) ?? 0) + delta);
      }
      return Object.fromEntries(holdings);
    }
  };
}

console.log('\n=== 4. crud api + validation ===');
const store = createStore<TradeRecord>('tr_');
const trades = createTradeService(store);

// rejected: missing asset, bad side, non-positive quantity -> 3 errors
console.log('bad payload  ->', trades.addTrade({ userId: 'u1', side: 'short', quantity: 0 }));
// accepted, and the store assigns the id
console.log('good payload ->', trades.addTrade({ userId: 'u1', asset: 'BTC', side: 'buy', quantity: 2 }));

trades.addTrade({ userId: 'u1', asset: 'BTC', side: 'sell', quantity: 0.5 });
trades.addTrade({ userId: 'u1', asset: 'ETH', side: 'buy',  quantity: 10 });
trades.addTrade({ userId: 'u2', asset: 'SOL', side: 'buy',  quantity: 40 });

console.log('u1 trades:', trades.getUserTrades('u1').length);   // expect 3
console.log('u1 portfolio:', trades.getPortfolio('u1'));         // expect BTC 1.5, ETH 10
console.log('u2 portfolio:', trades.getPortfolio('u2'));         // expect SOL 40

// narrowing in action — this is the bit to show them:
const result = trades.addTrade({ userId: 'u3', asset: 'ETH', side: 'buy', quantity: 1 });
if (result.ok) {
  console.log('narrowed to success, id =', result.trade.id);  // .trade is safe here
} else {
  console.log('narrowed to failure:', result.errors);         // .errors is safe here
}


/* ==========================================================================
   TALKING POINTS — glance at this right before the call

   JS points, all still true:
   - Nested .find() inside .map() is O(n*m). Build a Map first: O(n+m). This is
     the most common "make it faster" follow-up there is.
   - Anything with "running", "so far", or "as of" means: sort first, then one
     pass carrying state. Say the sort is O(n log n) and dominates.
   - .slice() before .sort(). sort() mutates the caller's array.
   - Grouping/counting/deduping is a Map or a Set. Reach for it by default.
   - Keep validation OUT of the store. Pure validators are testable and reusable.
   - Money as a float compounds error across a ledger. Real systems use integer
     minor units. `number` is a float in TS too — types don't help here.
   - "How would this scale?" -> stream, index, paginate.

   TS-specific things worth saying:
   - Type the INPUT as `unknown` and let validation produce the typed value.
     Typing a wire payload as your interface is a lie the compiler believes.
   - Discriminated unions ({ ok: true, ... } | { ok: false, ... }) beat
     { ok: boolean; data?: T; error?: string } — they make the bad state
     unrepresentable instead of merely discouraged.
   - Map.get() returns `T | undefined`. Let that force the missing-key decision.
   - Union of string literals ('buy' | 'sell') over a bare string: adding a
     case later makes the compiler show you every site that must change.
   - Omit / Partial / Pick keep derived types in sync with one source of truth.
   - Generics on the storage layer, not the domain layer. Store<T> is reusable;
     a generic Trade is just noise.
   ========================================================================== */
