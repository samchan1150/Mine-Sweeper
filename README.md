# Minesweeper Game

The Minesweeper game you've provided is a classic puzzle game implemented using JavaScript, HTML, and CSS. The objective of the game is to clear a grid of hidden mines without detonating any of them, using clues about the number of mines in adjacent squares.

## How to Play the Game

### Starting the Game

- When you load the game, it initializes with the **"Easy"** level by default.
- You can select the difficulty level by clicking on the **"Easy"**, **"Medium"**, or **"Hard"** buttons at the top. Each level adjusts the grid size and the number of mines:
  - **Easy**: 9x9 grid with 10 mines.
  - **Medium**: 16x16 grid with 40 mines.
  - **Hard**: 28x28 grid with 99 mines.
- Click the **"Restart"** button at any time to reset the game with the current difficulty level.

### Gameplay Mechanics

#### Left-Click (Reveal a Square)

- Click on any square to reveal what's underneath.
- If the square contains a number, it indicates how many mines are in the adjacent squares.
- If the square is empty (zero adjacent mines), it will recursively reveal all adjacent empty squares and their bordering numbered squares.
- If you click on a mine, the game ends, all mines are revealed, and a **"Game Over!"** message is displayed.

#### Right-Click (Flag a Square)

- Right-click on a square to place or remove a flag. This helps you mark squares where you suspect a mine is located.
- The **"Remaining Mine"** counter updates based on the number of flags you've placed.

### Winning the Game

- The game is won when all non-mine squares are revealed without clicking on any mines.
- If you've correctly flagged all mines and revealed all safe squares, a congratulatory alert appears, and the game resets.

### Game Interface

- **The Grid**: This is where the game takes place. Each cell represents a square in the Minesweeper grid.
- **Difficulty Buttons**: Located at the top, these buttons allow you to change the game's difficulty level.
- **Restart Button**: Resets the game without changing the current difficulty level.
- **Remaining Mine Counter**: Displays the number of mines left to be flagged.
- **Game Over Message**: When the game ends, a **"Game Over!"** message appears on the screen.

## Features and Specifics from the Implementation

### Random Mine Placement

- Mines are placed randomly on the grid when the game initializes.
- The `randomNum` function generates random positions for the mines.

### Number Calculation

- Each non-mine square calculates the number of adjacent mines.
- The `updateNum` function updates the value of each square based on nearby mines.

### Recursive Reveal Functionality

- When an empty square (with zero adjacent mines) is clicked, the game reveals all connected empty squares.
- This is handled by the `getAllZero` recursive function within the `play` method.

### Flagging Mechanism

- Right-clicking toggles a flag on a square.
- The game tracks the number of remaining mines based on the flags placed.
- Flagging a square doesn't reveal its contents but marks it visually.

### Game Over Conditions

- Clicking on a mine ends the game.
- The `gameOver` function displays all mines and prevents further interaction.
- If all mines are correctly flagged and all other squares are revealed, the game recognizes a win.

### Event Handling

- The game uses event listeners to manage left-click and right-click actions on each square.
- Prevents the default context menu from appearing on right-click with `oncontextmenu = function() { return false; }`.

Enjoy playing the game, and use logic and deduction to avoid the mines!
