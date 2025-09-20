const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
});

amountEl.addEventListener("input", (e) => {
    let myinput = e.target.value;

    // Check if input starts with "-"
    const isNegative = myinput.startsWith("-");

    // Remove everything except digits
    let value = myinput.replace(/\D/g, "");

    if (value) {
        let number = parseInt(value, 10);
        if (isNegative) number = -number; // preserve minus sign
        e.target.value = formatter.format(number);
    } else {
        e.target.value = isNegative ? "-" : "";
    }
});


function addTransaction(e) {
    e.preventDefault();

    //get form values
    const description = descriptionEl.value.trim();
    const inputamount = amountEl.value;
    let amount;
    if (inputamount.startsWith("-")) {
        let amont = parseFloat(amountEl.value.replace(/\D/g, ""));

        amount = -amont;
    }
    else {
        let amont = parseFloat(amountEl.value.replace(/\D/g, ""));

        amount = amont;
    }
    // amount = parseFloat(amountEl.value.replace(/\D/g, ""));


    transactions.push({
        id: Date.now(),
        description,
        amount,
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();

    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");
    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">✖</button>
        </span>
    `;
    return li;
}

function updateSummary() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    //update ui
    if (balance === income + expense) {
        balanceEl.classList.remove("low-balance", "high-balance");
        balanceEl.classList.add(balance < 500 ? "low-balance" : "high-balance");
        balanceEl.textContent = formatCurrency(balance);
        incomeAmountEl.textContent = formatCurrency(income);
        expenseAmountEl.textContent = formatCurrency(expense);
    }
    else {
        balanceEl.textContent = "Error";
        incomeAmountEl.textContent = "Error";
        expenseAmountEl.textContent = "Error";
    }
}

function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number);
}

function removeTransaction(id) {
    // filter out the one we wanted to delete
    transactions = transactions.filter((transaction) => transaction.id !== id);

    localStorage.setItem("transcations", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
}

//initial render
updateTransactionList();
updateSummary();