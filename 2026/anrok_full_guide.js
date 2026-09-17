/*
================================================================================
  ANROK CALLBACK CONCURRENCY CHEAT SHEET
================================================================================

  One file: the provided warm-up code, its solutions, and every practice
  problem from the study guide, ordered the way an interview is likely to
  build on itself.

  HOW TO RUN (Node 18+)
    node anrok-callback-cheatsheet.js            run every demo (fake network)
    node anrok-callback-cheatsheet.js limited    run one demo by name
    node anrok-callback-cheatsheet.js list       list demo names
    REAL=1 node anrok-callback-cheatsheet.js     use the real httpbin.org network

  The fake network uses setTimeout to imitate httpbin.org so everything runs
  offline and deterministically. URLs keep the httpbin format:
    https://httpbin.org/delay/2     responds after 2 seconds
    https://httpbin.org/status/500  fails (error-first functions only)

  CONTENTS
    PART 0  Concepts cheat sheet (comments only)
    PART 1  Provided by Anrok: httpGet, q, log
    PART 2  Warm-up: httpGetParallel, httpGetSerial
    PART 3  Concurrency control: limit, batches, in-order stream, task queue
    PART 4  Errors: error-first httpGetE, fail fast, all settled, first success
    PART 5  Time: timeout, retry with backoff, polling
    PART 6  Composition: withTimeout, withRetry, limitedSettled, httpGetRobust
    PART 7  Shared infrastructure: cache + dedupe, rate limiter, crawler
    PART 8  setTimeout utilities: once, every, debounce, throttle
    PART 9  Event loop quiz (comments only)
    PART 10 Fake network and demo runner

================================================================================
  PART 0: CONCEPTS CHEAT SHEET
================================================================================

  EVENT LOOP
  - One thread. A function always runs to completion; callbacks never
    interrupt it. So `remaining--` needs no lock. The races you handle are
    logical: requests finish in unpredictable order.
  - Loop: run one task (script, timer, I/O callback) -> drain ALL microtasks
    (process.nextTick queue first, then promise callbacks) -> next task.
  - Node phases: timers -> pending callbacks -> poll (I/O) -> check
    (setImmediate) -> close callbacks. Inside an I/O callback, setImmediate
    always runs before setTimeout(fn, 0).
  - The provided httpGet calls your callback inside a promise .then, so it
    runs as a microtask, and a throw inside it shows up as an unhandled
    rejection.

  setTimeout(fn, delay, ...args)
  - Delay is a MINIMUM. The callback waits for the stack to be empty.
  - Returns a handle; clearTimeout(handle) cancels. Clearing twice or after
    firing is a harmless no-op.
  - Same delay -> FIFO order. Node treats delay < 1 as 1ms. Browsers clamp
    nested timers to 4ms. Delay > 2^31-1 ms overflows (fires ~immediately).
  - A pending timer keeps a Node process alive (use .unref() to opt out).
  - Passing obj.method loses `this`; use an arrow function or bind.
  - `var` in a for loop shares one binding; `let` gives one per iteration.
  - For repeated async work, prefer recursive setTimeout over setInterval.

  CALLBACK RULES
  1. Call the callback exactly once. Empty input must still call back.
     Multiple finish paths (success/error/timeout) need a `finished` flag.
  2. Error-first convention: callback(err, result). `return` after
     reporting an error.
  3. Be consistently async. A cached/sync path should defer with
     setTimeout(..., 0) so callers see the same ordering every time.
  4. Decide your shared state up front and say it out loud:
     results[i] written only by request i, a counter of unfinished work,
     and a guard so completion happens once.

  QUESTIONS TO ASK BEFORE CODING
  - Results in input order or arrival order?
  - Empty input? Duplicate URLs?
  - Can requests fail? Fail fast or collect all? Callback signature?
  - Could httpGet call back synchronously or twice?
  - Valid limit / timeout values? Does a timeout include queue wait time?

  TESTING
  - Delays in reverse order (later URLs finish first), empty list, all
    equal delays. For limits, track in-flight count and assert the max.
*/

'use strict';

// =============================================================================
// PART 1: PROVIDED BY ANROK
// =============================================================================
// Kept as given. The only addition is that httpGet is reassigned to a fake
// in PART 10 unless you run with REAL=1.

// A non-blocking, callback-style function to make an HTTP GET request.
// When the request is complete, 'callback' will be called with
// the response body text. For simplicity, we're ignoring errors.
let httpGet = function httpGet(url, callback) {
  log(`HTTP start ${q(url)}`);
  // The 'fetch' API uses promises, but that's just an internal implementation detail of
  // 'httpGet'. In this exercise, you should do everything with callbacks, not promises.
  // The point of the exercise is to use callbacks everywhere else.
  fetch(url)
    .then((res) => {
      res.text().then((r) => {
        const truncated = r.substring(0, 20);
        log(`HTTP finish ${q(url)} -> ${q(truncated)}`);
        callback(truncated);
      });
    })
    .catch((err) => {
      throw err;
    });
};

function q(s) {
  return JSON.stringify(s);
}

function log(message) {
  const now = new Date();
  const nowLocalTz = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  ).toISOString();
  const time = nowLocalTz.substring(11, 21); // Just the time, with 1/10th of a second precision
  console.log(`[${time}] ${message}`);
}

// =============================================================================
// PART 2: WARM-UP
// =============================================================================

// -----------------------------------------------------------------------------
// httpGetParallel(urls, callback)
// Start every request at once. When all have finished, call back with bodies
// in the same order as `urls`.
// Key ideas: store by index (not push), count completions with a separate
// counter (not results.length, which jumps when a later index is set first),
// and call back immediately for an empty list or it never fires.
// -----------------------------------------------------------------------------
function httpGetParallel(urls, callback) {
  const results = new Array(urls.length);
  let remaining = urls.length;

  if (remaining === 0) {
    callback(results);
    return;
  }

  urls.forEach((url, i) => {
    // forEach gives each callback its own i
    httpGet(url, (body) => {
      results[i] = body; // input order, not arrival order
      remaining--;
      if (remaining === 0) {
        callback(results); // exactly once, after the last one
      }
    });
  });
}

// -----------------------------------------------------------------------------
// httpGetSerial(urls, callback)
// One request at a time: the next starts only when the previous calls back.
// Key idea: a loop can't do this (loops are synchronous and would start
// everything). Recurse from inside the callback instead; it's the callback
// version of `await` in a loop. No stack overflow: each call starts fresh.
// -----------------------------------------------------------------------------
function httpGetSerial(urls, callback) {
  const results = [];

  function next(i) {
    if (i === urls.length) {
      // base case; also handles []
      callback(results);
      return;
    }
    httpGet(urls[i], (body) => {
      results.push(body); // push is safe: only one in flight
      next(i + 1);
    });
  }

  next(0);
}

// -----------------------------------------------------------------------------
// httpGetSerialReduce(urls, callback)
// Alternative serial: build the chain of callbacks right-to-left, then run it.
// Good to recognize; the recursive version is easier to extend under pressure.
// -----------------------------------------------------------------------------
function httpGetSerialReduce(urls, callback) {
  const results = [];
  const run = urls.reduceRight(
    (then, url) => () =>
      httpGet(url, (body) => {
        results.push(body);
        then();
      }),
    () => callback(results),
  );
  run();
}

/*
  BUG GALLERY (what not to write)

  // 1. push records ARRIVAL order
  httpGet(url, body => { results.push(body); ... });

  // 2. results.length as the counter: results[2] = x makes length 3 at once
  httpGet(url, body => { results[i] = body; if (results.length === urls.length) callback(results); });

  // 3. var in a loop: every callback sees i === urls.length
  for (var i = 0; i < urls.length; i++) httpGet(urls[i], body => { results[i] = body; });

  // 4. "serial" loop is actually parallel, and calls back immediately with []
  for (let i = 0; i < urls.length; i++) httpGet(urls[i], body => results.push(body));
  callback(results);

  // 5. completion check OUTSIDE the callback: runs synchronously, never fires
  urls.forEach((url, i) => { httpGet(url, b => { results[i] = b; count++; }); if (count === urls.length) callback(results); });
*/

// =============================================================================
// PART 3: CONCURRENCY CONTROL
// =============================================================================

// -----------------------------------------------------------------------------
// httpGetLimited(urls, limit, callback)          <- most likely first follow-up
// Parallel, but never more than `limit` requests in flight. Whenever one
// finishes, start the next URL. Results in input order.
// Key ideas: a shared `nextIndex` claimed synchronously (safe, single thread),
// start `limit` workers up front, each completion refills its own slot
// (sliding window, not batches). Completion counted separately from starts.
// Edge cases: [] input; limit > urls.length; limit <= 0 would never call back.
// -----------------------------------------------------------------------------
function httpGetLimited(urls, limit, callback) {
  const results = new Array(urls.length);
  let nextIndex = 0; // next URL not yet started
  let completed = 0; // finished requests

  if (urls.length === 0) {
    callback(results);
    return;
  }
  if (!(limit >= 1)) limit = 1; // defensive: treat bad limits as 1

  function launch() {
    const i = nextIndex++;
    httpGet(urls[i], (body) => {
      results[i] = body;
      completed++;
      if (completed === urls.length) {
        callback(results);
        return;
      }
      if (nextIndex < urls.length) {
        launch(); // a slot freed up: refill it
      }
    });
  }

  for (let k = 0; k < Math.min(limit, urls.length); k++) {
    launch();
  }
}

// -----------------------------------------------------------------------------
// httpGetInBatches(urls, batchSize, callback)
// Run `batchSize` in parallel, wait for the whole batch, then the next batch.
// Key idea: simple (reuses httpGetParallel) but one slow request stalls its
// batch while slots sit idle. Delays [1,2,1,3,1], size 2: batches take 6s,
// the pool in httpGetLimited takes 5s. Be ready to explain the tradeoff.
// -----------------------------------------------------------------------------
function httpGetInBatches(urls, batchSize, callback) {
  const results = [];

  function runBatch(start) {
    if (start >= urls.length) {
      callback(results);
      return;
    }
    const batch = urls.slice(start, start + batchSize);
    httpGetParallel(batch, (bodies) => {
      results.push(...bodies);
      runBatch(start + batchSize);
    });
  }

  runBatch(0);
}

// -----------------------------------------------------------------------------
// httpGetStreamInOrder(urls, onResult, onDone)
// All in parallel, but emit onResult(i, body) in index order, each as early
// as possible. If URL 0 is slow, 1 and 2 wait; when 0 lands, flush all ready.
// Key idea: a reorder buffer with a `nextToEmit` pointer. Memory note:
// results after a slow early request are buffered until it arrives.
// -----------------------------------------------------------------------------
function httpGetStreamInOrder(urls, onResult, onDone) {
  const results = new Array(urls.length);
  const arrived = new Array(urls.length).fill(false);
  let nextToEmit = 0;

  if (urls.length === 0) {
    onDone();
    return;
  }

  urls.forEach((url, i) => {
    httpGet(url, (body) => {
      results[i] = body;
      arrived[i] = true;
      while (nextToEmit < urls.length && arrived[nextToEmit]) {
        onResult(nextToEmit, results[nextToEmit]);
        nextToEmit++;
      }
      if (nextToEmit === urls.length) onDone();
    });
  });
}

// -----------------------------------------------------------------------------
// createQueue(concurrency) -> { push(task, callback), drain(fn) }
// Generalized httpGetLimited for any async task `(done) => void`, where tasks
// can be pushed at any time, even while others are running.
// Key ideas: `running` count + `pending` list; runNext() fills free slots;
// drain fires when nothing is running or pending. This is the core of
// async.queue. Follow-ups: pause/resume, priorities, per-task timeout.
// -----------------------------------------------------------------------------
function createQueue(concurrency) {
  const pending = [];
  let running = 0;
  let onDrain = null;

  function runNext() {
    while (running < concurrency && pending.length > 0) {
      const { task, callback } = pending.shift();
      running++;
      task((...args) => {
        running--;
        if (callback) callback(...args);
        if (running === 0 && pending.length === 0 && onDrain) onDrain();
        runNext();
      });
    }
  }

  return {
    push(task, callback) {
      pending.push({ task, callback });
      runNext();
    },
    drain(fn) {
      onDrain = fn;
    },
  };
}

// =============================================================================
// PART 4: ERRORS
// =============================================================================
// In the interview they may simply say "now httpGet can fail" and change its
// signature. To keep both versions in one file, the error-first variant is
// named httpGetE here: httpGetE(url, (err, body) => ...).

// -----------------------------------------------------------------------------
// httpGetE(url, callback)   error-first variant of the provided httpGet
// Reports network errors and non-2xx statuses as errors.
// Key idea: calling back through setTimeout(..., 0) moves your callback out
// of the promise chain, so an exception in it crashes loudly instead of
// becoming a swallowed/unhandled promise rejection.
// -----------------------------------------------------------------------------
let httpGetE = function httpGetE(url, callback) {
  log(`HTTP start ${q(url)}`);
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res.text();
    })
    .then(
      (r) => {
        const truncated = r.substring(0, 20);
        log(`HTTP finish ${q(url)} -> ${q(truncated)}`);
        setTimeout(() => callback(null, truncated), 0);
      },
      (err) => {
        log(`HTTP error ${q(url)} -> ${err.message}`);
        setTimeout(() => callback(err), 0);
      },
    );
};

// -----------------------------------------------------------------------------
// httpGetParallelFailFast(urls, callback)
// Parallel; callback(err) as soon as ANY request fails, else
// callback(null, results). Mirrors Promise.all.
// Key idea: warm-up + a `finished` flag checked first in every callback, so
// we never call back twice (a second error, or results after an error).
// In-flight requests can't be aborted with this API; we ignore them.
// -----------------------------------------------------------------------------
function httpGetParallelFailFast(urls, callback) {
  const results = new Array(urls.length);
  let remaining = urls.length;
  let finished = false;

  if (remaining === 0) {
    callback(null, results);
    return;
  }

  urls.forEach((url, i) => {
    httpGetE(url, (err, body) => {
      if (finished) return;
      if (err) {
        finished = true;
        callback(err);
        return;
      }
      results[i] = body;
      remaining--;
      if (remaining === 0) {
        finished = true;
        callback(null, results);
      }
    });
  });
}

// -----------------------------------------------------------------------------
// httpGetAllSettled(urls, callback)
// Parallel; wait for everything and report per-request outcome.
// Mirrors Promise.allSettled. Never short-circuits.
// -----------------------------------------------------------------------------
function httpGetAllSettled(urls, callback) {
  const results = new Array(urls.length);
  let remaining = urls.length;

  if (remaining === 0) {
    callback(results);
    return;
  }

  urls.forEach((url, i) => {
    httpGetE(url, (err, body) => {
      results[i] = err
        ? { status: 'rejected', reason: err.message }
        : { status: 'fulfilled', value: body };
      remaining--;
      if (remaining === 0) callback(results);
    });
  });
}

// -----------------------------------------------------------------------------
// httpGetFirst(urls, callback)
// Request all mirrors; call back with the first SUCCESS (body, url). Fail
// only if every request fails. Mirrors Promise.any.
// Variation: first to finish, success or failure = Promise.race (drop the
// failure counter). Hedged request = start a 2nd only if the 1st is slow.
// -----------------------------------------------------------------------------
function httpGetFirst(urls, callback) {
  let finished = false;
  let failures = 0;

  if (urls.length === 0) {
    callback(new Error('No URLs given'));
    return;
  }

  urls.forEach((url) => {
    httpGetE(url, (err, body) => {
      if (finished) return;
      if (!err) {
        finished = true;
        callback(null, body, url);
        return;
      }
      failures++;
      if (failures === urls.length) {
        finished = true;
        callback(new Error('Every request failed'));
      }
    });
  });
}

// =============================================================================
// PART 5: TIME (setTimeout-heavy)
// =============================================================================

// -----------------------------------------------------------------------------
// httpGetWithTimeout(url, ms, callback)
// callback(timeoutError) if no response within `ms`; ignore late responses;
// clear the timer if the response wins.
// Key idea: a race between two callbacks. Whoever runs first sets `settled`;
// the loser sees the flag and returns. clearTimeout matters: a live timer
// keeps Node alive. Real code would also abort (AbortController).
// -----------------------------------------------------------------------------
function httpGetWithTimeout(url, ms, callback) {
  let settled = false;

  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    callback(new Error(`Timed out after ${ms}ms: ${url}`));
  }, ms);

  httpGetE(url, (err, body) => {
    if (settled) return; // arrived after the timeout: drop it
    settled = true;
    clearTimeout(timer);
    callback(err, body);
  });
}

// -----------------------------------------------------------------------------
// httpGetWithRetry(url, retries, baseDelayMs, callback)
// On failure wait, then retry, up to `retries` extra attempts. Delay grows
// exponentially. Report the LAST error if all attempts fail.
// Key ideas: named attempt(n) + setTimeout for the wait. "Full jitter"
// (random delay in [0, base * 2^n)) stops many clients retrying in lockstep.
// Real world: retry only transient errors (timeouts, 429, 5xx), only
// idempotent requests, and honor Retry-After.
// -----------------------------------------------------------------------------
function httpGetWithRetry(url, retries, baseDelayMs, callback) {
  function attempt(n) {
    httpGetE(url, (err, body) => {
      if (!err) {
        callback(null, body);
        return;
      }
      if (n >= retries) {
        callback(err);
        return;
      }
      const delay = Math.random() * baseDelayMs * 2 ** n;
      log(`attempt ${n + 1} failed; retrying in ${Math.round(delay)}ms`);
      setTimeout(() => attempt(n + 1), delay);
    });
  }
  attempt(0);
}

// -----------------------------------------------------------------------------
// pollUntil(check, intervalMs, timeoutMs, callback)
// Call check((err, isDone, value) => ...) repeatedly until done, waiting
// `intervalMs` between checks; give up after `timeoutMs`.
// Key idea: schedule the next check only AFTER the previous one returns, so
// slow checks never overlap (the argument against setInterval).
// -----------------------------------------------------------------------------
function pollUntil(check, intervalMs, timeoutMs, callback) {
  const deadline = Date.now() + timeoutMs;

  function tick() {
    check((err, isDone, value) => {
      if (err) {
        callback(err);
        return;
      }
      if (isDone) {
        callback(null, value);
        return;
      }
      if (Date.now() + intervalMs > deadline) {
        callback(new Error('Polling timed out'));
        return;
      }
      setTimeout(tick, intervalMs);
    });
  }

  tick();
}

// =============================================================================
// PART 6: COMPOSITION (how the progressive build usually ends up)
// =============================================================================
// Once you have several features, hard-coding httpGet/httpGetE inside each
// function stops scaling. Wrappers that take a `get` function and return a
// function with the SAME signature can be stacked freely:
//     withRetry(withTimeout(httpGetE, 1500), 2, 200)
// is still (url, (err, body) => ...), so any runner can use it.

// -----------------------------------------------------------------------------
// withTimeout(get, ms) -> get
// Same logic as httpGetWithTimeout, as a reusable wrapper.
// -----------------------------------------------------------------------------
function withTimeout(get, ms) {
  return function timedGet(url, callback) {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      callback(new Error(`Timed out after ${ms}ms: ${url}`));
    }, ms);
    get(url, (err, body) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback(err, body);
    });
  };
}

// -----------------------------------------------------------------------------
// withRetry(get, retries, baseDelayMs) -> get
// Same logic as httpGetWithRetry, as a reusable wrapper.
// Order matters: withRetry(withTimeout(...)) times out EACH attempt;
// withTimeout(withRetry(...)) puts one deadline on all attempts combined.
// -----------------------------------------------------------------------------
function withRetry(get, retries, baseDelayMs) {
  return function retryingGet(url, callback) {
    function attempt(n) {
      get(url, (err, body) => {
        if (!err || n >= retries) {
          callback(err, body);
          return;
        }
        const delay = Math.random() * baseDelayMs * 2 ** n;
        setTimeout(() => attempt(n + 1), delay);
      });
    }
    attempt(0);
  };
}

// -----------------------------------------------------------------------------
// limitedSettled(urls, limit, get, callback)
// httpGetLimited with an injectable error-first `get` and per-item outcomes
// (so one failure doesn't lose the others).
// -----------------------------------------------------------------------------
function limitedSettled(urls, limit, get, callback) {
  const results = new Array(urls.length);
  let nextIndex = 0;
  let completed = 0;

  if (urls.length === 0) {
    callback(results);
    return;
  }

  function launch() {
    const i = nextIndex++;
    get(urls[i], (err, body) => {
      results[i] = err
        ? { status: 'rejected', reason: err.message }
        : { status: 'fulfilled', value: body };
      completed++;
      if (completed === urls.length) {
        callback(results);
        return;
      }
      if (nextIndex < urls.length) launch();
    });
  }

  for (let k = 0; k < Math.min(Math.max(1, limit), urls.length); k++) {
    launch();
  }
}

// -----------------------------------------------------------------------------
// httpGetRobust(urls, options, callback)
// Everything together: concurrency limit + per-attempt timeout + retries,
// results in input order with per-item success/failure.
// options: { limit, timeoutMs, retries, baseDelayMs }
// -----------------------------------------------------------------------------
function httpGetRobust(urls, options, callback) {
  const {
    limit = 3,
    timeoutMs = 2000,
    retries = 2,
    baseDelayMs = 200,
  } = options;
  const get = withRetry(withTimeout(httpGetE, timeoutMs), retries, baseDelayMs);
  limitedSettled(urls, limit, get, callback);
}

// =============================================================================
// PART 7: SHARED INFRASTRUCTURE
// =============================================================================

// -----------------------------------------------------------------------------
// makeCachedGet(get) -> cachedGet(url, callback)
// Same signature as httpGet. Cached URLs answer from cache; a URL already in
// flight doesn't start a second request, it waits for the first.
// Key ideas: a `waiting` map of callbacks per in-flight URL (request
// coalescing / single-flight), and the cache hit stays ASYNC (no Zalgo).
// Clarify: cache errors? expiry?
// -----------------------------------------------------------------------------
function makeCachedGet(get) {
  const cache = new Map(); // url -> body
  const waiting = new Map(); // url -> callbacks for in-flight request

  return function cachedGet(url, callback) {
    if (cache.has(url)) {
      const body = cache.get(url);
      setTimeout(() => callback(body), 0);
      return;
    }
    if (waiting.has(url)) {
      waiting.get(url).push(callback);
      return;
    }
    waiting.set(url, [callback]);
    get(url, (body) => {
      cache.set(url, body);
      const callbacks = waiting.get(url);
      waiting.delete(url);
      callbacks.forEach((cb) => cb(body));
    });
  };
}

// -----------------------------------------------------------------------------
// makeRateLimitedGet(get, max, windowMs) -> rateLimitedGet(url, callback)
// No more than `max` requests may START in any rolling `windowMs` window;
// extra requests queue.
// Concurrency limit vs rate limit: the first caps how many run at once (fast
// requests free slots quickly); the second caps starts per unit of time no
// matter how fast they finish. Third-party APIs usually impose the second.
// Key ideas: remember recent start times; when full, set ONE timer for the
// exact moment the oldest start leaves the window (no busy polling).
// Alternative design: token bucket (allows bursts, enforces average rate).
// -----------------------------------------------------------------------------
function makeRateLimitedGet(get, max, windowMs) {
  const startTimes = [];
  const queue = [];
  let timer = null;

  function pump() {
    timer = null;
    const now = Date.now();
    while (startTimes.length > 0 && now - startTimes[0] >= windowMs) {
      startTimes.shift();
    }
    while (queue.length > 0 && startTimes.length < max) {
      const { url, callback } = queue.shift();
      startTimes.push(Date.now());
      get(url, callback);
    }
    if (queue.length > 0 && timer === null) {
      const wait = windowMs - (Date.now() - startTimes[0]);
      timer = setTimeout(pump, wait);
    }
  }

  return function rateLimitedGet(url, callback) {
    queue.push({ url, callback });
    if (timer === null) pump();
  };
}

// -----------------------------------------------------------------------------
// crawl(startUrl, limit, fetchLinks, callback)
// fetchLinks(url, links => ...) fetches a page and returns its links. Visit
// every reachable page once, at most `limit` fetches at a time; call back
// with all visited URLs.
// Key ideas: no fixed list, so "done" = nothing running AND nothing queued.
// Mark URLs seen when ENQUEUED (not when fetched), or two pages linking to
// the same URL both enqueue it. Follow-ups: max depth, per-domain limit.
// -----------------------------------------------------------------------------
function crawl(startUrl, limit, fetchLinks, callback) {
  const seen = new Set([startUrl]);
  const queue = [startUrl];
  let active = 0;

  function pump() {
    while (active < limit && queue.length > 0) {
      const url = queue.shift();
      active++;
      fetchLinks(url, (links) => {
        active--;
        for (const link of links) {
          if (!seen.has(link)) {
            seen.add(link);
            queue.push(link);
          }
        }
        if (active === 0 && queue.length === 0) {
          callback([...seen]);
        } else {
          pump();
        }
      });
    }
  }

  pump();
}

// =============================================================================
// PART 8: setTimeout UTILITIES
// =============================================================================

// -----------------------------------------------------------------------------
// once(fn)
// Wrap a callback so extra calls are ignored. Use when several paths can
// finish (success / error / timeout / cancel).
// -----------------------------------------------------------------------------
function once(fn) {
  let called = false;
  return function (...args) {
    if (called) return;
    called = true;
    return fn.apply(this, args);
  };
}

// -----------------------------------------------------------------------------
// every(ms, work) -> stop()
// Self-scheduling repeat: work(done) is async; the next run is scheduled only
// after done() is called, so runs never pile up (unlike setInterval).
// -----------------------------------------------------------------------------
function every(ms, work) {
  let timer = null;
  let stopped = false;

  function tick() {
    work(() => {
      if (!stopped) timer = setTimeout(tick, ms);
    });
  }

  timer = setTimeout(tick, ms);
  return function stop() {
    stopped = true;
    clearTimeout(timer);
  };
}

// -----------------------------------------------------------------------------
// debounce(fn, ms)
// Run fn only after calls have STOPPED for `ms` (search-as-you-type).
// Key idea: every call clears the pending timer and starts a new one.
// -----------------------------------------------------------------------------
function debounce(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// -----------------------------------------------------------------------------
// throttle(fn, ms)
// Run fn at most once per `ms`, plus one trailing call with the latest args.
// Key idea: run immediately if enough time passed; otherwise remember the
// latest args and schedule one trailing call for when the window ends.
// -----------------------------------------------------------------------------
function throttle(fn, ms) {
  let lastRun = -Infinity;
  let timer = null;
  let latestArgs = null;

  return function (...args) {
    const wait = ms - (Date.now() - lastRun);
    if (wait <= 0) {
      lastRun = Date.now();
      fn.apply(this, args);
      return;
    }
    latestArgs = args;
    if (timer === null) {
      timer = setTimeout(() => {
        timer = null;
        lastRun = Date.now();
        fn.apply(this, latestArgs);
      }, wait);
    }
  };
}

// =============================================================================
// PART 9: EVENT LOOP QUIZ (verified in Node 22, CommonJS)
// =============================================================================
/*
  Q1
    console.log('A');
    setTimeout(() => console.log('B'), 0);
    Promise.resolve().then(() => console.log('C'));
    process.nextTick(() => console.log('D'));
    console.log('E');
  -> A E D C B   sync first; nextTick queue before promises; timer is a task

  Q2
    setTimeout(() => { console.log('t1'); Promise.resolve().then(() => console.log('p1')); }, 0);
    setTimeout(() => { console.log('t2'); Promise.resolve().then(() => console.log('p2')); }, 0);
  -> t1 p1 t2 p2   microtasks drain after EACH timer callback (Node >= 11)

  Q3
    const start = Date.now();
    setTimeout(() => console.log('elapsed', Date.now() - start), 100);
    const end = Date.now() + 500; while (Date.now() < end) {}
    console.log('loop done');
  -> loop done, then elapsed ~500   delay is a minimum; sync code blocks timers

  Q4
    require('fs').readFile(__filename, () => {
      setTimeout(() => console.log('timeout'), 0);
      setImmediate(() => console.log('immediate'));
    });
  -> immediate, timeout (always)   check phase follows poll. At top level: unpredictable

  Q5
    function getData(cb) { cb('value'); }
    let status = 'before';
    getData(() => console.log('status is', status));
    status = 'after';
  -> status is before   a callback parameter doesn't make a function async (Zalgo)

  Q6
    for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);   -> 3 3 3
    for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);   -> 0 1 2
*/

// =============================================================================
// PART 10: FAKE NETWORK AND DEMO RUNNER
// =============================================================================

const IS_NODE =
  typeof process !== 'undefined' && process.versions && process.versions.node;
const USE_REAL_NETWORK = IS_NODE && process.env.REAL === '1';

// Divide fake delays by this to make demos quicker. Set to 1 for real timing.
const FAKE_SPEEDUP = 4;

let inFlight = 0;
let maxInFlight = 0;
function resetStats() {
  inFlight = 0;
  maxInFlight = 0;
}

function fakeDelayMs(url) {
  const delay = url.match(/\/delay\/([\d.]+)/);
  return (delay ? Number(delay[1]) * 1000 : 100) / FAKE_SPEEDUP;
}

// Imitates httpbin.org using setTimeout. Same logging as the provided httpGet.
function fakeHttpGet(url, callback) {
  inFlight++;
  maxInFlight = Math.max(maxInFlight, inFlight);
  log(`HTTP start ${q(url)}  (in flight: ${inFlight})`);
  setTimeout(() => {
    inFlight--;
    const body = `{"url": "${url}"}`.substring(0, 20);
    log(`HTTP finish ${q(url)} -> ${q(body)}`);
    callback(body);
  }, fakeDelayMs(url));
}

// Error-first fake: /status/4xx or /status/5xx fails.
function fakeHttpGetE(url, callback) {
  inFlight++;
  maxInFlight = Math.max(maxInFlight, inFlight);
  log(`HTTP start ${q(url)}  (in flight: ${inFlight})`);
  setTimeout(() => {
    inFlight--;
    const status = url.match(/\/status\/(\d+)/);
    if (status && Number(status[1]) >= 400) {
      log(`HTTP error ${q(url)} -> ${status[1]}`);
      callback(new Error(`HTTP ${status[1]} for ${url}`));
      return;
    }
    const body = `{"url": "${url}"}`.substring(0, 20);
    log(`HTTP finish ${q(url)} -> ${q(body)}`);
    callback(null, body);
  }, fakeDelayMs(url));
}

if (!USE_REAL_NETWORK) {
  httpGet = fakeHttpGet;
  httpGetE = fakeHttpGetE;
}

// Small assertion helper that works in Node and browser playgrounds.
let failures = 0;
function check(condition, message) {
  if (condition) {
    console.log(`  PASS ${message}`);
  } else {
    failures++;
    console.log(`  FAIL ${message}`);
  }
}

const D1 = 'https://httpbin.org/delay/1';
const D2 = 'https://httpbin.org/delay/2';
const D3 = 'https://httpbin.org/delay/3';
const FAIL = 'https://httpbin.org/status/500';
const WARMUP_URLS = [D1, D2, D1];
const FIVE_URLS = [D1, D2, D1, D3, D1];

// Each demo is (done) => void, so the runner itself is callback-based.
const demos = {
  parallel(done) {
    resetStats();
    httpGetParallel(WARMUP_URLS, (responses) => {
      log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
      check(
        responses.length === 3 && responses.every(Boolean),
        'three bodies in order',
      );
      if (!USE_REAL_NETWORK)
        check(maxInFlight === 3, 'all three in flight together');
      httpGetParallel([], (empty) => {
        check(
          Array.isArray(empty) && empty.length === 0,
          'empty input calls back with []',
        );
        done();
      });
    });
  },

  serial(done) {
    resetStats();
    httpGetSerial(WARMUP_URLS, (responses) => {
      log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
      check(responses.length === 3, 'three bodies');
      if (!USE_REAL_NETWORK)
        check(maxInFlight === 1, 'never more than one in flight');
      httpGetSerialReduce([D1, D1], (r) => {
        check(r.length === 2, 'reduceRight version works');
        done();
      });
    });
  },

  limited(done) {
    resetStats();
    httpGetLimited(FIVE_URLS, 2, (responses) => {
      log(`Got responses: ${JSON.stringify(responses)}`);
      check(
        responses.length === 5 && responses.every(Boolean),
        'five bodies in order',
      );
      if (!USE_REAL_NETWORK) check(maxInFlight === 2, 'max 2 in flight');
      done();
    });
  },

  batches(done) {
    resetStats();
    httpGetInBatches(FIVE_URLS, 2, (responses) => {
      log(`Got responses: ${JSON.stringify(responses)}`);
      check(responses.length === 5, 'five bodies');
      if (!USE_REAL_NETWORK) check(maxInFlight === 2, 'max 2 in flight');
      done();
    });
  },

  stream(done) {
    const order = [];
    httpGetStreamInOrder(
      [D2, D1, D1],
      (i, body) => {
        log(`onResult(${i})`);
        order.push(i);
      },
      () => {
        check(order.join(',') === '0,1,2', 'emitted in index order');
        done();
      },
    );
  },

  queue(done) {
    const q2 = createQueue(2);
    let running = 0,
      peak = 0,
      finished = 0;
    const task = (ms) => (cb) => {
      running++;
      peak = Math.max(peak, running);
      setTimeout(() => {
        running--;
        cb(`slept ${ms}ms`);
      }, ms);
    };
    q2.drain(() => {
      check(peak === 2, 'never more than 2 tasks running');
      check(finished === 5, 'all 5 callbacks fired');
      done();
    });
    [300, 100, 200, 50, 150].forEach((ms) =>
      q2.push(task(ms), (result) => {
        finished++;
        log(result);
      }),
    );
  },

  failFast(done) {
    httpGetParallelFailFast([D2, FAIL, D1], (err, results) => {
      log(`fail-fast callback: ${err ? err.message : JSON.stringify(results)}`);
      check(err instanceof Error, 'reports the first error');
      httpGetParallelFailFast([D1, D1], (err2, ok) => {
        check(err2 === null && ok.length === 2, 'succeeds when nothing fails');
        // Let the stray delay/2 request finish before the next demo.
        setTimeout(done, fakeDelayMs(D2));
      });
    });
  },

  allSettled(done) {
    httpGetAllSettled([D1, FAIL], (results) => {
      log(`settled: ${JSON.stringify(results)}`);
      check(
        results[0].status === 'fulfilled' && results[1].status === 'rejected',
        'per-item outcomes',
      );
      done();
    });
  },

  first(done) {
    httpGetFirst([FAIL, D2, D1], (err, body, url) => {
      log(`first success from ${url}`);
      check(!err && url === D1, 'fastest success wins, failures ignored');
      setTimeout(done, fakeDelayMs(D2));
    });
  },

  timeout(done) {
    const ms = USE_REAL_NETWORK ? 1500 : 1500 / FAKE_SPEEDUP;
    httpGetWithTimeout(D2, ms, (err) => {
      log(`timeout result: ${err && err.message}`);
      check(err && /Timed out/.test(err.message), 'slow request times out');
      httpGetWithTimeout(D1, ms, (err2, body) => {
        check(!err2 && body, 'fast request succeeds');
        setTimeout(done, fakeDelayMs(D2));
      });
    });
  },

  retry(done) {
    // Temporarily make httpGetE flaky: fail twice, then succeed.
    const original = httpGetE;
    let calls = 0;
    httpGetE = (url, cb) => {
      calls++;
      setTimeout(
        () => (calls < 3 ? cb(new Error('flaky')) : cb(null, 'ok')),
        20,
      );
    };
    httpGetWithRetry(D1, 4, 50, (err, body) => {
      httpGetE = original;
      check(
        !err && body === 'ok' && calls === 3,
        'succeeds on the third attempt',
      );
      httpGetWithRetry(FAIL, 2, 20, (err2) => {
        check(
          err2 instanceof Error,
          'reports last error after retries run out',
        );
        done();
      });
    });
  },

  poll(done) {
    let checks = 0;
    const checkJob = (cb) =>
      setTimeout(() => {
        checks++;
        log(`status check #${checks}`);
        cb(null, checks >= 3, { status: 'complete' });
      }, 20);
    pollUntil(checkJob, 100, 2000, (err, value) => {
      check(!err && value.status === 'complete', 'resolves when job completes');
      pollUntil(
        (cb) => cb(null, false),
        50,
        200,
        (err2) => {
          check(
            err2 && /timed out/.test(err2.message),
            'gives up after timeout',
          );
          done();
        },
      );
    });
  },

  robust(done) {
    resetStats();
    const timeoutMs = USE_REAL_NETWORK ? 2500 : 2500 / FAKE_SPEEDUP;
    httpGetRobust(
      [D1, D3, FAIL, D1, D2],
      { limit: 2, timeoutMs, retries: 1, baseDelayMs: 50 },
      (results) => {
        log(`robust: ${JSON.stringify(results, null, 2)}`);
        check(results[0].status === 'fulfilled', 'fast request succeeds');
        check(
          results[1].status === 'rejected' &&
            /Timed out/.test(results[1].reason),
          'slow request times out',
        );
        check(
          results[2].status === 'rejected',
          'failing request rejected after retry',
        );
        if (!USE_REAL_NETWORK)
          check(
            maxInFlight <= 3,
            'bounded concurrency (late timed-out responses may overlap)',
          );
        setTimeout(done, fakeDelayMs(D3));
      },
    );
  },

  cache(done) {
    let networkCalls = 0;
    const cachedGet = makeCachedGet((url, cb) => {
      networkCalls++;
      httpGet(url, cb);
    });
    let answered = 0;
    const onBody = () => {
      answered++;
      if (answered < 3) return;
      check(networkCalls === 1, 'three concurrent callers share one request');
      let sync = true;
      cachedGet(D1, () => {
        check(!sync, 'cache hit still calls back asynchronously');
        check(networkCalls === 1, 'cache hit makes no request');
        done();
      });
      sync = false;
    };
    cachedGet(D1, onBody);
    cachedGet(D1, onBody);
    cachedGet(D1, onBody);
  },

  rateLimit(done) {
    const starts = [];
    const limitedGet = makeRateLimitedGet(
      (url, cb) => {
        starts.push(Date.now());
        log(`started ${url}`);
        setTimeout(() => cb(url), 10);
      },
      2,
      300,
    );
    let finished = 0;
    for (let i = 0; i < 5; i++) {
      limitedGet(`request-${i}`, () => {
        finished++;
        if (finished < 5) return;
        const rel = starts.map((t) => t - starts[0]);
        const ok = rel.every(
          (a) => rel.filter((t) => t >= a && t < a + 300).length <= 2,
        );
        check(ok, 'no more than 2 starts in any 300ms window');
        done();
      });
    }
  },

  crawl(done) {
    const site = {
      '/home': ['/about', '/pricing'],
      '/about': ['/team', '/home'],
      '/pricing': ['/about', '/docs'],
      '/team': [],
      '/docs': ['/team'],
    };
    let active = 0,
      peak = 0;
    const fetchLinks = (url, cb) => {
      active++;
      peak = Math.max(peak, active);
      log(`fetch ${url}`);
      setTimeout(
        () => {
          active--;
          cb(site[url] || []);
        },
        50 + Math.random() * 100,
      );
    };
    crawl('/home', 2, fetchLinks, (visited) => {
      log(`visited: ${visited.join(', ')}`);
      check(visited.length === 5, 'every page visited exactly once');
      check(peak <= 2, 'max 2 fetches at a time');
      done();
    });
  },

  timers(done) {
    const debounced = [];
    const d = debounce((x) => debounced.push(x), 50);
    d(1);
    d(2);
    d(3);

    const throttled = [];
    const t = throttle((x) => throttled.push(x), 100);
    t('a');
    t('b');
    t('c');

    let ticks = 0;
    const stop = every(30, (next) => {
      ticks++;
      setTimeout(next, 10);
    });

    let onceCount = 0;
    const cb = once(() => onceCount++);
    cb();
    cb();
    cb();

    setTimeout(() => {
      stop();
      check(debounced.join() === '3', 'debounce: only the last call runs');
      check(throttled.join() === 'a,c', 'throttle: leading + trailing call');
      check(ticks >= 3, `every: ticked ${ticks} times without overlap`);
      check(onceCount === 1, 'once: extra calls ignored');
      done();
    }, 200);
  },

  // The original test from the warm-up file (it uses promises only to
  // sequence the two tests; your implementations stay callback-based).
  original(done) {
    async function testAsync() {
      const urls = [D1, D2, D1];
      log('Testing httpGetParallel...');
      await new Promise((resolve) => {
        httpGetParallel(urls, (responses) => {
          log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
          resolve();
        });
      });
      log('Testing httpGetSerial...');
      await new Promise((resolve) => {
        httpGetSerial(urls, (responses) => {
          log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
          resolve();
        });
      });
    }
    testAsync().then(done, (err) => {
      console.error(err);
      failures++;
      done();
    });
  },
};

function runDemos(names, i, callback) {
  if (i === names.length) {
    callback();
    return;
  }
  const name = names[i];
  console.log(`\n=== ${name} ${'='.repeat(Math.max(0, 60 - name.length))}`);
  demos[name](() => runDemos(names, i + 1, callback));
}

(function main() {
  const arg = IS_NODE ? process.argv[2] : undefined;
  if (arg === 'list') {
    console.log(Object.keys(demos).join('\n'));
    return;
  }
  if (arg && !demos[arg]) {
    console.log(
      `Unknown demo "${arg}". Available:\n${Object.keys(demos).join('\n')}`,
    );
    return;
  }
  const names = arg ? [arg] : Object.keys(demos);
  console.log(
    `Network: ${USE_REAL_NETWORK ? 'REAL (httpbin.org)' : `fake (setTimeout, ${FAKE_SPEEDUP}x speed)`}`,
  );
  runDemos(names, 0, () => {
    console.log(
      `\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}`,
    );
  });
})();
