const input = document.getElementById("numberInput");
const hint = document.getElementById("hint");
const errorEl = document.getElementById("error");
const baseButtons = document.querySelectorAll("#baseSelect button");

const outputs = {
  bin: document.getElementById("outBin"),
  oct: document.getElementById("outOct"),
  dec: document.getElementById("outDec"),
  hex: document.getElementById("outHex"),
};

const rules = {
  2:  { regex: /^[01]+$/,           hint: "Allowed: digits 0 and 1." },
  8:  { regex: /^[0-7]+$/,          hint: "Allowed: digits 0-7." },
  10: { regex: /^[0-9]+$/,          hint: "Allowed: digits 0-9." },
  16: { regex: /^[0-9a-fA-F]+$/,    hint: "Allowed: digits 0-9 and letters A-F." },
};

let currentBase = 10;

function setBase(base) {
  currentBase = base;
  baseButtons.forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.base) === base)
  );
  hint.textContent = rules[base].hint;
  errorEl.textContent = "";
}

// Convert using BigInt so large numbers stay exact
function parseToBigInt(str, base) {
  const digits = "0123456789abcdef";
  let result = 0n;
  const b = BigInt(base);
  for (const ch of str.toLowerCase()) {
    result = result * b + BigInt(digits.indexOf(ch));
  }
  return result;
}

function convert() {
  const raw = input.value.trim().replace(/\s+/g, "");
  errorEl.textContent = "";

  if (raw === "") {
    errorEl.textContent = "Please enter a number.";
    return;
  }
  if (!rules[currentBase].regex.test(raw)) {
    errorEl.textContent = "Invalid input for the selected number system. " + rules[currentBase].hint;
    return;
  }

  const value = parseToBigInt(raw, currentBase);
  outputs.bin.textContent = value.toString(2);
  outputs.oct.textContent = value.toString(8);
  outputs.dec.textContent = value.toString(10);
  outputs.hex.textContent = value.toString(16).toUpperCase();
}

function clearAll() {
  input.value = "";
  errorEl.textContent = "";
  Object.values(outputs).forEach((el) => (el.textContent = "\u2014"));
  input.focus();
}

baseButtons.forEach((b) =>
  b.addEventListener("click", () => setBase(Number(b.dataset.base)))
);
document.getElementById("convertBtn").addEventListener("click", convert);
document.getElementById("clearBtn").addEventListener("click", clearAll);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") convert();
});

document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.target).textContent;
    if (text === "\u2014") return;
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch (err) {
      errorEl.textContent = "Copy failed. Please copy manually.";
    }
  });
});

setBase(10);
