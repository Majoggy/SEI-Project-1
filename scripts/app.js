// * Dom Elements

const grid = document.querySelector('.grid')
const cells = []

// * Grid Variables

const gridWidth = 15
const cellCount = gridWidth * gridWidth

// * Classes

const playerClass = 'player'
const invaderClass = 'invader'
const playerPClass = 'playerP'
const invaderPClass = 'invaderP'

// * Game Variables


let invaderDirection = 1
const playerStartingPosition = 217
let playerPosition = playerStartingPosition
let invaderArray = [3,4,5,6,7,8,9,10,11,18,
  19,20,21,22,23,24,25,26,33,34,35,36,37,
  38,39,40,41,48,49,50,51,52,53,54,55,56,
  63,64,65,66,67,68,69,70,71]
const playerIndex = playerPosition % gridWidth

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

function playerShoot() {
  console.log("FIRE!")
  let pPath = playerPosition - gridWidth
  cells[pPath].classList.add(playerPClass) 
  const projectileSpeed = setInterval(shootProjectile,200)
  
  function shootProjectile() {
    cells[pPath].classList.remove(playerPClass)
    if (pPath <= 14) {
      clearInterval(projectileSpeed)
      console.log(pPath)
      return
    }
    pPath -= gridWidth
    cells[pPath].classList.add(playerPClass)
// Initial hit detection
    if (cells[pPath].classList.contains(invaderClass))
    {
      console.log('A HIT!')
    }

  }  
}



function addPlayer(position) {
  cells[position].classList.add(playerClass)
}

function removePlayer(position) {
  cells[position].classList.remove(playerClass)
}

function addInvaders() {
  for (let i = 0; i < invaderArray.length; i ++) {
    cells[invaderArray[i]].classList.add(invaderClass)
  }
}

function removeInvaders() {
  for (let i = 0; i < invaderArray.length; i ++) {
    cells[invaderArray[i]].classList.remove(invaderClass)
  }
}

addInvaders()

function movingInvaders() {
  
  const gridLeft = invaderArray[0] % gridWidth === 0
  const gridRight = invaderArray[invaderArray.length - 1] % gridWidth === gridWidth - 1
  removeInvaders()

  if (gridRight && invaderDirection === 1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth + 1)
    invaderDirection = -1
  }

  if (gridLeft && invaderDirection === -1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth -1)
    invaderDirection = 1
  }

  invaderArray = invaderArray.map(invader => invader + invaderDirection)

  addInvaders()
}

const invaderSpeed = setInterval(() => {
  movingInvaders()
}, 500)

// * Event Listeners

window.addEventListener('keyup', handleKeyUp)