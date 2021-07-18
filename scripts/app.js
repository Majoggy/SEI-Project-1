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
// const invaderPClass = 'invaderP'
const hitInvaderClass = 'hitInvader'
const altInvaderClass = 'invaderAlt'

// * Game Variables

let speedUpcount = 950
let score = 0
let invaderDirection = 1
const playerStartingPosition = 217
let playerPosition = playerStartingPosition
let invaderArray = [3,4,5,6,7,8,9,10,11,18,
  19,20,21,22,23,24,25,26,33,34,35,36,37,
  38,39,40,41,48,49,50,51,52,53,54,55,56,
  63,64,65,66,67,68,69,70,71]
let invaderAltArray = [ 3,4,5,6,7,8,9,10,11,18,19,20,21,22,23,24,25,26 ]
let deadInvaderArray = []
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
  let position = playerPosition - gridWidth
  cells[position].classList.add(playerPClass) 
  const projectileSpeed = setInterval(shootProjectile,200)
  
  function shootProjectile() {
    cells[position].classList.remove(playerPClass)
    if (position <= 14) {
      clearInterval(projectileSpeed)
      return
    }
    position -= gridWidth
    cells[position].classList.add(playerPClass)
    playerhit(position)
  }  
  function playerhit(position) {
    if (cells[position].classList.contains(invaderClass) || (cells[position].classList.contains(altInvaderClass)))
    {
      killInvaders(position)
      scoreUp(1)
      clearInterval(projectileSpeed)
      speedUp(speedUpcount)
    }
  }
}

function scoreUp(num) {
  score += num
  console.log(score)
}

function killInvaders(position) {
  cells[position].classList.remove(invaderClass)
  cells[position].classList.remove(altInvaderClass)
  cells[position].classList.add(hitInvaderClass)
  const deadAlien = invaderArray.indexOf(position)
  deadInvaderArray.push(deadAlien)
  cells[position].classList.remove(playerPClass)
}


function addPlayer(position) {
  cells[position].classList.add(playerClass)
}

function removePlayer(position) {
  cells[position].classList.remove(playerClass)
}

function addInvaders() {
  for (let i = 0; i < invaderArray.length; i ++) {
  
    if (!deadInvaderArray.includes(i)) {
      if (invaderAltArray[i] == invaderArray[i]) {
        cells[invaderArray[i]].classList.add(altInvaderClass)
      }
      cells[invaderArray[i]].classList.add(invaderClass)
    }
  }
}

function removeInvaders() {
  for (let i = 0; i < invaderArray.length; i ++) {
    if (invaderAltArray[i] == invaderArray[i]) {
      cells[invaderArray[i]].classList.remove(altInvaderClass)
    }
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
    invaderAltArray = invaderAltArray.map(invader => invader + gridWidth + 1)
    invaderDirection = -1
  }

  if (gridLeft && invaderDirection === -1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth -1)
    invaderAltArray = invaderAltArray.map(invader => invader + gridWidth -1)
    invaderDirection = 1
  }

  invaderArray = invaderArray.map(invader => invader + invaderDirection)
  invaderAltArray = invaderAltArray.map(invader => invader + invaderDirection)

  addInvaders()

  if (invaderArray.length === deadInvaderArray.length) {
    console.log('YOU WIN')
    clearInterval(invaderSpeed)
  }
}

let invaderSpeed = setInterval(() => {
  movingInvaders()
}, speedUpcount)

function speedUp(num) {
  speedUpcount -= 15
  clearInterval(invaderSpeed)
  invaderSpeed = setInterval(() => {
    movingInvaders()
  }, num)
}

// * Event Listeners

window.addEventListener('keyup', handleKeyUp)