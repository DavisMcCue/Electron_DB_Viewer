const { ipcRenderer } = require('electron');

const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const searchResultsElement  = document.getElementById('searchResults');
const dropdown = document.getElementById('dropdown');



sendButton.addEventListener('click', () => {
    const inputText = userInput.value;
    const dropdownOption = dropdown.value;
    // Send both searchTerm and selectedOption to the main process
    ipcRenderer.send('userInput', { inputText, dropdownOption });
});

// Add change event listener to the dropdown
dropdown.addEventListener('change', () => {
    // Check if an option is selected
    if (dropdown.value) {
        // Enable the search button
        sendButton.disabled = false;
    } else {
        // Disable the search button
        sendButton.disabled = true;
    }
});

// Assuming your dropdown has an id of 'dropdown'
document.getElementById('dropdown').addEventListener('change', () => {
    const selectedOption = document.getElementById('dropdown').value;
    ipcRenderer.send('selectedOption', selectedOption);
    
});

// Listen for 'searchResults' event from the main process
ipcRenderer.on('searchResults', (event, { columns, rows }) => {
    //const columnsDiv = document.getElementById('columns');
    const rowsDiv = document.getElementById('rows');

    // Clear previous results
    //columnsDiv.innerHTML = '';
    rowsDiv.innerHTML = '';
    const dropdownOptionRenderer = dropdown.value;
    // Display columns
    const columnsHTML = '<h2>Columns:</h2>' + columns.map(column => `<div>${column}</div>`).join('');
    //columnsDiv.innerHTML = columnsHTML;

    // Display rows (if any)
    if (rows.length > 0) {
        const rowsHTML = '<div id="table-Title">' + dropdownOptionRenderer + '</div>' + rows.map(row => {
            return '<div>' + Object.entries(row).map(([key, value]) => `<span>${key}: ${value}</span>`).join('<br>') + '</div>';
        }).join('');
        rowsDiv.innerHTML = rowsHTML;
    } else {
        rowsDiv.innerHTML = '<p>No rows found.</p>';
    }
});
ipcRenderer.on('searchError', (event, errorMessage) => {
    // Display the error message
    searchResultsElement.textContent = `Error: ${errorMessage}`;
});