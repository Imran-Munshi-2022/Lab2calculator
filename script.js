const display = document.getElementById('display');
let currentInput = '';

// Append value
function appendValue(value) {
  if (value === '.' && currentInput.includes('.')) return; // prevent multiple dots
  currentInput += value;
  updateDisplay();
}

// Clear display
function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

// Delete last character
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// Calculate result
function calculateResult() {
  try {
    let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
    let result = eval(expression);
    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    display.textContent = 'Error';
    currentInput = '';
  }
}

// Update display
function updateDisplay() {
  display.textContent = currentInput || '0';
}

// Temperature conversion
function convertTemp(type) {
  if (!currentInput) return;
  let value = parseFloat(currentInput);
  let result;

  switch(type) {
    case 'C2F': // Celsius to Fahrenheit
      result = (value * 9/5) + 32;
      break;
    case 'F2C': // Fahrenheit to Celsius
      result = (value - 32) * 5/9;
      break;
    case 'C2K': // Celsius to Kelvin
      result = value + 273.15;
      break;
    default:
      return;
  }

  currentInput = result.toFixed(2); // round to 2 decimals
  updateDisplay();
}
