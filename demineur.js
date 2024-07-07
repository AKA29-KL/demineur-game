// Function to create a game grid
const createGrid = (gridSize) => {
    const grid = [];

    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push({ value: 0, revealed: false }); // Initialize each cell with value and revealed status
        }
        grid.push(row);
    }

    return grid;
};

// Function ajouter mines de facons aléatoire
const addMines = (grid, maxMines) => {
    const gridSize = grid.length;

    for (let i = 0; i < maxMines; i++) {
        let col, row;
        do {
            col = Math.floor(Math.random() * gridSize);
            row = Math.floor(Math.random() * gridSize);
        } while (grid[col][row].value === "B"); // Ensure no duplicate mines

        grid[col][row].value = "B";
    }
};

// Function to calculate adjacent mines for each cell
const calculateAdjacentMines = (grid) => {
    const gridSize = grid.length;

    // Iterate through each cell in the grid
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize; row++) {
            if (grid[col][row].value !== "B") { // Skip if it's already a bomb
                let nbBombs = 0;

                // Check all 8 surrounding cells for bombs
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i !== 0 || j !== 0) { // Exclude the current cell itself
                            const neighborCol = col + i;
                            const neighborRow = row + j;
                            if (neighborCol >= 0 && neighborCol < gridSize &&
                                neighborRow >= 0 && neighborRow < gridSize &&
                                grid[neighborCol][neighborRow].value === "B") {
                                nbBombs++;
                            }
                        }
                    }
                }

                // Assign the number of adjacent bombs to the cell
                grid[col][row].value = nbBombs;
            }
        }
    }
};

// Function to handle clicking on a cell
const handleCellClick = (event) => {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Check if cell is already revealed or flagged
    if (grid[row][col].revealed) {
        return; // Do nothing if already revealed
    }

    // Check if cell contains a bomb
    if (grid[row][col].value === "B") {
        // Handle bomb logic (game over, reveal all bombs, etc.)
        window.alert('Game over! You clicked on a bomb.');
        cell.classList.add('bomb');
        cell.textContent = '💣'; // Display bomb emoji or text
        revealAllBombs(); // Example function to reveal all bombs
        // Additional game over logic can be added here
    } else {
        // If cell has no adjacent bombs, recursively reveal adjacent cells
        revealCell(row, col);
    }
};

// Function to recursively reveal adjacent cells if they have no adjacent bombs
const revealCell = (row, col) => {
    // Mark cell as revealed
    grid[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add('clicked');
    cell.textContent = grid[row][col].value !== 0 ? grid[row][col].value : '';

    // If current cell has no adjacent bombs, reveal adjacent cells recursively
    if (grid[row][col].value === 0) {
        const gridSize = grid.length;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborRow = row + i;
                const neighborCol = col + j;
                if (neighborRow >= 0 && neighborRow < gridSize &&
                    neighborCol >= 0 && neighborCol < gridSize &&
                    !grid[neighborRow][neighborCol].revealed) {
                    revealCell(neighborRow, neighborCol);
                }
            }
        }
    }
};

// Function to reveal all bomb cells 
const revealAllBombs = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (grid[row][col].value === "B") {
            cell.textContent = '💣';
        }
    });
};

// Function to create HTML grid based on the game grid
const createHTMLGrid = (grid) => {
    const gridContainer = document.querySelector('.grid'); // Assuming '.grid' is your grid container element

    // Clear existing content inside the grid container
    gridContainer.innerHTML = '';

    // Iterate over each row and cell in the grid
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const divEl = document.createElement('div');
            divEl.classList.add('cell');
            divEl.dataset.row = rowIndex; // Store row index as data attribute
            divEl.dataset.col = colIndex; // Store column index as data attribute

            // Add event listener for clicking on a cell
            divEl.addEventListener('click', handleCellClick);

            // Append the cell to the grid container
            gridContainer.appendChild(divEl);
        });
    });
};

// Example usage:
const gridSize = 10; // Adjust grid size as needed
const maxMines = 10; // Number of mines to add

// Create the grid
const grid = createGrid(gridSize);

// Add mines to the grid
addMines(grid, maxMines);

// Calculate adjacent mines for each cell
calculateAdjacentMines(grid);

// Log the grid with mines and adjacent mine counts (optional)
console.table(grid);

// Call the createHTMLGrid function after creating and populating the grid
createHTMLGrid(grid);
