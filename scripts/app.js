// * Dom Elements
const grid = document.querySelector('.grid')
const cells = []

// * Grid Variables
const gridWidth = 15
const cellCount = gridWidth * gridWidth

// * Game Variables
const playerClass = 'player'
const playerStartingPosition = 217
let playerPosition = playerStartingPosition

// * Generate Grid
function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.textContent = i
    grid.appendChild(cell)
    cells.push(cell)
  }
  addPlayer(playerStartingPosition)
}

createGrid()

// * Functions
function handleKeyUp(event) {
  const x = playerPosition % gridWidth
  removePlayer(playerPosition)
  if (event.key === 'ArrowLeft') {
    if (x > 0) playerPosition--
  }
  if (event.key === 'ArrowRight') { 
    if (x < gridWidth - 1) playerPosition++
  }
  if (event.key === ' ') {
    playerShoot()
  }
  addPlayer(playerPosition)
}
// Temp firing function
function playerShoot() {
  console.log("FIRE!")
}

function addPlayer(position) {
  cells[position].classList.add(playerClass)
}

function removePlayer(position) {
  cells[position].classList.remove(playerClass)
}

// * Event Listeners

window.addEventListener('keyup', handleKeyUp)