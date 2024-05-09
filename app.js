const electron = require("electron");
const ejs = require('ejs');
const { app, BrowserWindow, ipcMain } = electron;
const oracledb = require('oracledb');
const prompt = require('prompt-sync')();
const fs = require('fs/promises');
// Import the executeQuery function from database.js
const database = require('./database');
const { capitalize } = require("lodash");

//Initialize the app
let Initapp = electron.app;

async function searchInDatabase(searchTerm, selectedOption) {
    try {
        const pool = await database.poolPromise;
        const connection = await pool.getConnection();
        let caseNoColumn = "";
  
        if (selectedOption === "(Must Match Dropdown)") {
            caseNameColumn = "(Must Match Column in DB)";
        } else if (selectedOption === "(Must Match Dropdown)" || selectedOption === "(Must Match Dropdown)" || selectedOption === "(Must Match Dropdown)") {
            caseNameColumn = "(Must Match Column in DB)";
        }
  
        const query = `
            SELECT ${selectedOption}.* 
            FROM DBName.${selectedOption} 
            WHERE ${caseNameColumn} = :searchTerm
        `;

        
  
        const result = await connection.execute(query, [searchTerm.trim()]);
  
        // Extract column names from the result metadata
        const columnNames = result.metaData.map(column => column.name);
  
        // Filter columns with data
        const columnsWithData = await Promise.all(columnNames.map(async column => {
            const dataQuery = `
                SELECT COUNT(*) 
                FROM DBName.${selectedOption}
                WHERE ${caseNameColumn} = :searchTerm AND ${column} IS NOT NULL
            `;
            const dataResult = await connection.execute(dataQuery, [searchTerm.trim()]);
            const count = dataResult.rows[0][0];
            return count > 0 ? column : null;
        }));
  
        // Remove null values from the array
        const filteredColumns = columnsWithData.filter(column => column !== null);
  
        // Log filtered columns
        console.log("Filtered Columns:", filteredColumns);
  
        // Log rows with their respective columns
        const rows = result.rows.map(row => {
            const rowData = {};
            row.forEach((value, index) => {
                if (value !== null) {
                    rowData[columnNames[index]] = value;
                }
            });
            return rowData;
        });
  
        return { columns: filteredColumns, rows };
        
    } catch (error) {
        console.error('Error searching in database:', error);
        throw error;
    }
  }

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  
  //Load the html file
  mainWindow.loadFile('./index1.html');

  ipcMain.on('userInput', async (event, { inputText, dropdownOption }) => {
    console.log('Received user input:', inputText, dropdownOption);
    const capitalizeText = inputText.toUpperCase();
    try {
        const { columns, rows } = await searchInDatabase(capitalizeText, dropdownOption);
        mainWindow.webContents.send('searchResults', { columns, rows }); // Send the search results back to the renderer process
    } catch (error) {
        console.error('Error searching in database:', error);
        mainWindow.webContents.send('searchError', error.message); // Send an error message back to the renderer process
    }
  });
});