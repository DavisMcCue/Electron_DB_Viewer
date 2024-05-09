# Electron OracleDB Search Application

## Description
This Electron application allows users to search for data in an Oracle database. It provides a graphical user interface where users can input search terms and select options from a dropdown menu, and the application queries the Oracle database accordingly.

## Installation
1. Clone the repository.
2. Install dependencies by running `npm install`.
3. Ensure you have Oracle Instant Client installed on your system.
4. Set up the Oracle database connection details in `database.js`.
5.  const query = `
            SELECT ${selectedOption}.* 
            FROM DBName.${selectedOption} 
            WHERE ${caseNameColumn} = :searchTerm
        `;

    const dataQuery = `
                SELECT COUNT(*) 
                FROM DBName.${selectedOption}
                WHERE ${caseNameColumn} = :searchTerm AND ${column} IS NOT NULL
            `;
    
**Note** Anywhere there is (DBName) requires your database name in front to allow the program to be specific when pulling info.

7. if (selectedOption === "(Must Match Dropdown)") {
            caseNameColumn = "(Must Match Column in DB)";
        } else if (selectedOption === "(Must Match Dropdown)" || selectedOption === "(Must Match Dropdown)" || selectedOption === "(Must Match Dropdown)") {
            caseNameColumn = "(Must Match Column in DB)";
        }
**Note** these must match the drop down names you list in your dropdown in the index1.html line 19-22.
8. Run the application using `npm start`.

## Usage
1. Launch the application by running `npm start`.
2. Enter the search term in the input field.
3. Select the desired option from the dropdown menu.
4. Click on the search button to retrieve data from the Oracle database.
5. View the search results displayed in the application window.

## Dependencies
- Electron: Used to create the desktop application.
- EJS: Templating engine for HTML files.
- OracleDB: Driver for connecting to Oracle databases.
- Prompt-sync: Synchronous prompt for user input.
- fs/promises: File system module for promises-based file operations.
- Lodash: Utility library for capitalizing strings and other operations.

## Contributing
Contributions are welcome! If you find any bugs or want to suggest new features, please open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
