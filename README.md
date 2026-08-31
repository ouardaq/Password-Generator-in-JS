# Random Password Generator

A 20-character password generator in the browser. No build step, no dependencies — open `index.html`.

## Features

- Generates a 20-character password drawn from 89 characters: upper case, lower case, digits, and symbols
- Guarantees at least one character from each of the four sets, so the result satisfies the usual complexity rules
- One-click copy to the clipboard

## How the randomness works

`Math.random()` is not seeded from a cryptographic source, so the sequence it produces is predictable in principle — fine for a dice roll, not for a password. This uses `crypto.getRandomValues()` instead.

That introduces a subtlety worth naming. The obvious way to turn a random 32-bit integer into an index is `value % max`, but unless `max` divides 2³² evenly, the low indices come up slightly more often than the high ones — the last partial bucket is short. `randomIndex()` discards any draw that lands past the largest exact multiple of `max` and tries again, so every index is equally likely.

The password is also shuffled with a Fisher–Yates pass. Without it, the four guaranteed characters stay where they were placed and every password reads uppercase-lowercase-digit-symbol in its first four positions — structure an attacker can exploit to cut the search space.

## Running it

```bash
git clone https://github.com/ouardaq/Password-Generator-in-JS.git
cd Password-Generator-in-JS
open index.html
```

The clipboard button uses the async Clipboard API, which browsers only expose in a secure context. Over `file://` it falls back to the deprecated `document.execCommand("copy")`; serve the folder over HTTP if you want the modern path:

```bash
python3 -m http.server 8000
```

## Notes

The password never leaves the page — there is no backend, no network request, and nothing stored.
