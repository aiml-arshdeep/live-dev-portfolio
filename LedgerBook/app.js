/**
 * LedgerBook Pro - Core Application Script
 * Demonstrates: DOM Mutation, Event Hooks, and Persistent Client Storage Layers
 */

// 1. Core Data State Management
// Attempts to load existing transaction records from LocalStorage; defaults to empty array if uninitialized
let transactionDatabase = JSON.parse(localStorage.getItem('ledger_records')) || [];

// DOM Selection Nodes
const ledgerForm = document.getElementById('ledger-form');
const journalBody = document.getElementById('journal-body');
const displayAssets = document.getElementById('display-assets');
const displayLiabilities = document.getElementById('display-liabilities');
const displayEquity = document.getElementById('display-equity');

// 2. Engine Recalculation Engine
// Processes the full array of ledger rows to compute financial totals using accounting equations
function recalculateSystemBalances() {
    let runningAssets = 0;
    let runningLiabilities = 0;

    // Iterating over the array to compute values based on financial classifications
    transactionDatabase.forEach(transaction => {
        if (transaction.category === 'ASSET') {
            runningAssets += transaction.amount;
        } else if (transaction.category === 'LIABILITY') {
            runningLiabilities += transaction.amount;
        }
    });

    // Computing Accounting Equation: Owner Equity = Assets - Liabilities
    let runningEquity = runningAssets - runningLiabilities;

    // Render localized financial data directly into the DOM interface
    displayAssets.innerText = `₹${runningAssets.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    displayLiabilities.innerText = `₹${runningLiabilities.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    displayEquity.innerText = `₹${runningEquity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// 3. UI Dynamic DOM Insertion Layer
// Generates table components dynamically and binds event routing logic directly onto nodes
function renderJournalTable() {
    // Clear out the table body first to prevent rendering duplicates
    journalBody.innerHTML = '';

    transactionDatabase.forEach((transaction) => {
        const row = document.createElement('tr');

        // Setup custom structural HTML strings for target dynamic generation rows
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td><span class="${transaction.category === 'ASSET' ? 'badge-asset' : 'badge-liability'}">${transaction.category}</span></td>
            <td>₹${transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td><button class="btn-delete" data-id="${transaction.id}">Reverse</button></td>
        `;

        journalBody.appendChild(row);
    });

    // Bind event hooks directly onto the newly generated delete buttons
    bindDeleteActions();
}

// 4. Data State Persistence & Event Hook Controllers
function saveAndSyncState() {
    // Serialize state architecture array into string values for LocalStorage database storage
    localStorage.setItem('ledger_records', JSON.stringify(transactionDatabase));
    
    // Refresh calculations and UI tables
    recalculateSystemBalances();
    renderJournalTable();
}

// Intercept voucher submit button interactions
ledgerForm.addEventListener('submit', function (event) {
    event.preventDefault(); // HALT default webpage reloading sequence

    const descriptionInput = document.getElementById('tx-description').value.trim();
    const categoryInput = document.getElementById('tx-category').value;
    const amountInput = parseFloat(document.getElementById('tx-amount').value);

    // Instantiate unique data models using time markers to create isolated item IDs
    const newTransactionModel = {
        id: Date.now(), // Acts as a unique transaction serial number
        description: descriptionInput,
        category: categoryInput,
        amount: amountInput
    };

    // Append standard item tracking object array lists
    transactionDatabase.push(newTransactionModel);
    
    // Save, refresh, and clear interface inputs
    saveAndSyncState();
    ledgerForm.reset();
});

// Remove items selectively from ledger array
function bindDeleteActions() {
    const actionButtons = document.querySelectorAll('.btn-delete');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = parseInt(this.getAttribute('data-id'));
            
            // Re-assign the local database by filtering out the matching record
            transactionDatabase = transactionDatabase.filter(item => item.id !== targetId);
            
            saveAndSyncState();
        });
    });
}

// 5. Initial System Lifecycle Activation
// This execution loop bootstraps state data during initial page views
recalculateSystemBalances();
renderJournalTable();
