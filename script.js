const passwordBox = document.getElementById("password");
const length = 20;

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "!@#$%^&*()_-+={}|:'<>,./?~`";

const allChars = upperCase + lowerCase + number + symbol;

// Math.random() is not seeded from a cryptographic source, so passwords it
// produces are predictable in principle. crypto.getRandomValues() is.
//
// Taking `value % max` would bias the result towards low indices whenever max
// does not divide 2^32 evenly, so draws landing in the final partial bucket
// are discarded and retried instead.
function randomIndex(max) {
  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

function randomCharFrom(set) {
  return set[randomIndex(set.length)];
}

function generatePassword() {
  // One character from each set guarantees the password satisfies the usual
  // complexity rules.
  const chars = [
    randomCharFrom(upperCase),
    randomCharFrom(lowerCase),
    randomCharFrom(number),
    randomCharFrom(symbol),
  ];

  while (chars.length < length) {
    chars.push(randomCharFrom(allChars));
  }

  // Without this the first four positions are always upper/lower/digit/symbol
  // in that order, which is structure an attacker can exploit.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  passwordBox.value = chars.join("");
}

async function copyPassword() {
  if (!passwordBox.value) return;

  try {
    await navigator.clipboard.writeText(passwordBox.value);
  } catch {
    // Clipboard API needs a secure context, so opening the file over file://
    // falls back to the deprecated path rather than failing silently.
    passwordBox.select();
    document.execCommand("copy");
  }
}
