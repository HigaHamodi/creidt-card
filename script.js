// Get references to form elements and error messages
const formCreditData = document.getElementById("form-Credit-Data");
const fullNameInput = document.getElementById("Name");
const creditNumberInput = document.getElementById("Card-Number");
const expiryInput = document.getElementById("Expiry");
const cvcInput = document.getElementById("CVC");
const discountInput = document.getElementById("Discount-Code");
const cardTypeImage = document.getElementById("card-type-img");
const nameError = document.getElementById("name-error");
const expiryError = document.getElementById("Expiry-error");
const cvcError = document.getElementById("cvc-error");
const discountError = document.getElementById("discount-error");
const validDiscountCodes = ["CHIKAMSO-20-OFF", "SPECIAL-10", "SALE50"];

// Regular expressions for validation
const nameRegex = /^[A-Za-z\s]+$/;
const cardNumberRegex = /^(\d{4} ?){4}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cvcRegex = /^\d{3,4}$/;
const discountRegex = /^[A-Z0-9-]+$/;

// Function to validate an input field and update its styling and error message
function validateInput(inputElement, regex, errorElement, errorMessage) {
  const value = inputElement.value;
  const isValid = regex.test(value);

  if (isValid) {
    inputElement.classList.remove("invalidInput");
    inputElement.classList.add("validInput");
    errorElement.textContent = "";
  } else {
    inputElement.classList.remove("validInput");
    inputElement.classList.add("invalidInput");
    errorElement.textContent = errorMessage;
  }

  return isValid;
}

// Validation for Full Name input
fullNameInput.addEventListener("blur", () => {
  validateInput(fullNameInput, nameRegex, nameError, "Invalid Name");
});

// Validation for Card Number input
creditNumberInput.addEventListener("blur", () => {
    const isValid = validateInput(creditNumberInput, cardNumberRegex, "Invalid Card Number");
    if (isValid) {
      creditNumberInput.classList.remove("invalidInput");
      creditNumberInput.classList.add("validInput");
    } else {
      creditNumberInput.classList.remove("validInput");
      creditNumberInput.classList.add("invalidInput");
    }
  });

// Format Card Number input and detect card type
creditNumberInput.addEventListener("input", formatCardNumber);

function formatCardNumber() {
  let input = creditNumberInput.value.replace(/\D/g, '');
  input = input.slice(0, 16);
  const formattedNumber = input.replace(/(\d{4})(?=\d)/g, '$1 ');
  creditNumberInput.value = formattedNumber;

  detectCardType(input);
}

function validateCardNumber(value) {
  return cardNumberRegex.test(value);
}

// Inside the detectCardType function
function detectCardType(cardNumber) {
  const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const mastercardPattern = /^5[1-5][0-9]{14}$/;
  const cardNumberInput = document.getElementById("Card-Number");

  if (visaPattern.test(cardNumber)) {
    cardNumberInput.style.backgroundImage = "url('./images/visa.svg')";
  } else if (mastercardPattern.test(cardNumber)) {
    cardNumberInput.style.backgroundImage = "url('./images/mastercard.svg')";
  } else {
    cardNumberInput.style.backgroundImage = "none";
  }
}

// Validation for Expiry input
expiryInput.addEventListener("blur", () => {
    validateInput(expiryInput, expiryRegex, expiryError, "Invalid Expiry Date");
  });

// Format Expiry input and validate format and future date
expiryInput.addEventListener("input", formatAndValidateExpiry);

function formatAndValidateExpiry() {
  let input = expiryInput.value.replace(/\D/g, '');
  input = input.slice(0, 4);
  const formattedExpiry = input.replace(/(\d{2})(\d{2})/, '$1/$2');
  expiryInput.value = formattedExpiry;

  validateExpiry(formattedExpiry);
}

function validateExpiry(value) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const parts = value.split("/");
  if (parts.length !== 2) {
    return false;
  }

  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
}

// Validation for CVC input
cvcInput.addEventListener("blur", () => {
  validateInput(cvcInput, cvcRegex, cvcError, "Invalid CVC");
});

// Validation for Discount Code input
discountInput.addEventListener("blur", () => {
    const isValid = validateDiscountCode(discountInput.value);
    if (isValid) {
      discountInput.classList.remove("invalidInput");
      discountInput.classList.add("validInput");
      discountError.textContent = "";
    } else {
      discountInput.classList.remove("validInput");
      discountInput.classList.add("invalidInput");
      discountError.textContent = "Invalid Discount Code";
    }
  });
  
  function validateDiscountCode(value) {
    return validDiscountCodes.includes(value);
  }
  

// Prevent form submission if there are validation errors
formCreditData.addEventListener("submit", (event) => {
  if (!validateFullName(fullNameInput.value) || !validateCardNumber(creditNumberInput.value) || !validateExpiry(expiryInput.value) || !validateCVC(cvcInput.value) || !validateDiscountCode(discountInput.value)) {
    event.preventDefault();
    alert("Please fill out the form correctly before submitting.");
  }
});
