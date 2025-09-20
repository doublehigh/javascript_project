const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");
const date = document.getElementById("date");

window.addEventListener("load", fetchCurrencies);

converterForm.addEventListener("submit", convertCurrency);

async function fetchCurrencies() {
  // https://api.exchangerate-api.com/v4/latest/USD
  const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
  const data = await response.json();

  // console.log(data);
  const currencyOptions = Object.keys(data.rates);

  currencyOptions.forEach((currency) => {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    toCurrency.appendChild(option2);

    const newDate = new Date(data.date);
    date.innerText = newDate.toLocaleDateString("en-US", {
      weekday: "long",   // "Friday"
      year: "numeric",   // "2025"
      month: "long",     // "September"
      day: "numeric"     // "19"
    });
  });
}

async function convertCurrency(e) {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  if (amount < 0) {
    alert("Please ener a valid amount");
    return;
  }

  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`);
  const data = await response.json();

  const rate = data.rates[toCurrencyValue];
  const convertedAmount = (amount * rate).toFixed(2);

  const currencyFromFormat = fromCurrency.value.slice(0, -1);
  const currencyToFormat = toCurrency.value.slice(0, -1);
  const fullCurrencyFromFormat = "en-" + currencyFromFormat;
  const fullCurrencyToFormat = "en-" + currencyToFormat;

  const newAmount = fromformatRate(amount, fromCurrencyValue, fullCurrencyFromFormat);
  const newConvertedAmount = toformatRate(convertedAmount, toCurrencyValue, fullCurrencyToFormat);

  resultDiv.textContent = `${newAmount} ${fromCurrencyValue} = ${newConvertedAmount} ${toCurrencyValue}`;
}

function fromformatRate(rate, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
}

function toformatRate(rate, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
}
