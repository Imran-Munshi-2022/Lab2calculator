const display = document.getElementById("display");
let currentInput = "";

/* ---------- Display ---------- */
function updateDisplay() {
  display.textContent = currentInput || "0";
}

/* ---------- Helpers ---------- */
// returns the last number chunk after an operator
function getLastNumberChunk(expr) {
  const parts = expr.split(/[\+\-\*\/%]/);
  return parts[parts.length - 1] ?? "";
}

/* ---------- Input ---------- */
function appendValue(value) {
  // If Error shown, start fresh
  if (display.textContent === "Error") currentInput = "";

  // Prevent multiple dots in the CURRENT number only
  if (value === ".") {
    const lastChunk = getLastNumberChunk(currentInput);
    if (lastChunk.includes(".")) return;
    if (lastChunk === "") currentInput += "0"; // start as 0.
  }

  // Avoid starting with multiple operators
  if (currentInput === "" && ["+", "*", "/", "%"].includes(value)) return;

  currentInput += value;
  updateDisplay();
}

function clearDisplay() {
  currentInput = "";
  updateDisplay();
}

function deleteLast() {
  if (!currentInput) return;
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

/* ---------- Calculation ---------- */
function calculateResult() {
  try {
    if (!currentInput) return;

    // Allow only safe characters
    if (!/^[0-9+\-*/().%\s]*$/.test(currentInput)) {
      display.textContent = "Error";
      currentInput = "";
      return;
    }

    // Convert percentages: 50% => (50/100)
    let expression = currentInput.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    // Prevent ending with operator
    if (/[+\-*/.]$/.test(expression)) {
      display.textContent = "Error";
      currentInput = "";
      return;
    }

    // Evaluate
    const result = Function(`"use strict"; return (${expression})`)();

    if (!isFinite(result)) {
      display.textContent = "Error";
      currentInput = "";
      return;
    }

    currentInput = Number(result.toFixed(10)).toString();
    updateDisplay();
  } catch (error) {
    display.textContent = "Error";
    currentInput = "";
  }
}

/* ---------- Temperature Conversion ---------- */
function convertTemp(type) {
  if (!currentInput) return;

  // Conversion should only run when input is a pure number (not 5+2)
  if (/[+\-*/%()]/.test(currentInput.trim())) {
    display.textContent = "Error";
    currentInput = "";
    return;
  }

  const value = parseFloat(currentInput);
  if (isNaN(value)) return;

  let result;

  if (type === "C2F") {
    result = (value * 9) / 5 + 32;
  } else if (type === "F2C") {
    result = ((value - 32) * 5) / 9;
  } else if (type === "C2K") {
    result = value + 273.15;
  } else {
    return;
  }

  currentInput = Number(result.toFixed(2)).toString();
  updateDisplay();
}

/* ---------- Keyboard Support (optional) ---------- */
document.addEventListener("keydown", (e) => {
  const k = e.key;

  if ((k >= "0" && k <= "9") || k === ".") {
    appendValue(k);
  } else if (["+", "-", "*", "/"].includes(k)) {
    appendValue(k);
  } else if (k === "Enter" || k === "=") {
    e.preventDefault();
    calculateResult();
  } else if (k === "Backspace") {
    deleteLast();
  } else if (k === "Escape") {
    clearDisplay();
  } else if (k === "%") {
    appendValue("%");
  }
});
