// * Dom Elements

const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('game-text-1')
const highScoreDisplay = document.getElementById('game-text-2')

const cells = []

// * Grid Variables

const gridWidth = 16
const cellCount = gridWidth * gridWidth

// * Classes

const playerClass = 'player'
const invaderClass = 'invader'
const playerPClass = 'playerP'
const invaderPClass = 'invaderP'
const hitInvaderClass = 'hitInvader'
const altInvaderClass = 'invaderAlt'
const barrierClass = 'barrier'

// * Game Variables

let keySpam = false
let endWave = false
let waveNumber = 1
let livesLeft = 3
let speedUpcount = 1050
let score = 0
let invaderDirection = 1
const playerStartingPosition = 247
let playerPosition = playerStartingPosition
let invaderArray = [ 3,4,5,6,7,8,9,10,11,19,
  20,21,22,23,24,25,26,27,35,36,37,38,39,
  40,41,42,43,51,52,53,54,55,56,57,58,59,
  67,68,69,70,71,72,73,74,75 ]
let invaderAltArray = [ 3,4,5,6,7,8,9,10,11,19,20,21,22,23,24,25,26,27 ]
let possibleshooterArray = []
let deadInvaderArray = []
const barrierArray = [ 226, 230, 233, 237 ]
// const barrierArrayMid = [ 215,216,231,232 ]
// const barrierArrayRight = [ 220,221,236,237 ]
const gridEndArray = [ 240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255]

// * Generate Grid

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.value = i
    grid.appendChild(cell)
    cells.push(cell)
  }
  addPlayer(playerStartingPosition)
  addBarriers(barrierArray)
}

createGrid()

// * Functions

function handleKeyUp(event) {
  if (!endWave) {
    const playerIndex = playerPosition % gridWidth
    removePlayer(playerPosition)
    if (event.key === 'ArrowLeft') {
      if (playerIndex > 0) playerPosition--
    }
    if (event.key === 'ArrowRight') { 
      if (playerIndex < gridWidth - 1) playerPosition++
    }
    if (event.key === ' ') {
      if (!keySpam) {
        playerShoot()
      }
    }
    addPlayer(playerPosition)
  }
}

function addBarriers(array) {
  for (let i = 0; i < array.length; i++) {
    cells[array[i]].classList.add(barrierClass)
  }
}

// Can't for the life of me work out how to successfully seperate these functions, so they're nested together

function playerShoot() {
  let position = playerPosition - gridWidth

  if (cells[position].classList.contains(barrierClass)) {
    return
  }

  cells[position].classList.add(playerPClass) 
  const projectileSpeed = setInterval(shootProjectile,30)
  
  function shootProjectile() {
    keySpam = true
    setTimeout(keySpamTimer,800)
    cells[position].classList.remove(playerPClass)
    if (position <= gridWidth) {
      clearInterval(projectileSpeed)  
      return
    }
    if (endWave) {
      clearInterval(projectileSpeed)
      return
    }
    position -= gridWidth
    cells[position].classList.add(playerPClass)
    playerHit()
    
  } 
  function playerHit() {
    if (cells[position].classList.contains(invaderClass) || (cells[position].classList.contains(altInvaderClass))) {
      if (cells[position].classList.contains(invaderClass)) {
        scoreUp(10)
      }
      if (cells[position].classList.contains(altInvaderClass)) {
        scoreUp(20)
      }
      killInvaders(position)
      clearInterval(projectileSpeed)
      speedUp(speedUpcount)
    }
  }
}

function keySpamTimer() {
  keySpam = false
}

function invaderShoot() {
  let invaderShooterPosition = calculatePossibleShooters()
  invaderShooterPosition = invaderShooterPosition + gridWidth
  cells[invaderShooterPosition].classList.add(invaderPClass)
  const projectileTimer = setInterval(alienProjectile, 120)

  function alienProjectile() {
    if (cells[invaderShooterPosition].classList.contains(barrierClass)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
      return
    }
    if (cells[invaderShooterPosition].classList.contains(playerClass)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
      loseLife()
      return
    }
    if (gridEndArray.includes(invaderShooterPosition)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
      return
    }

    cells[invaderShooterPosition].classList.remove(invaderPClass)
    invaderShooterPosition += gridWidth
    cells[invaderShooterPosition].classList.add(invaderPClass)
  }
}

function loseLife () {
  livesLeft -= 1
  console.log(livesLeft)
  console.log('LOST A LIFE DAWG')
}

function calculatePossibleShooters () {
  possibleshooterArray = []
  for (let i = 0; i < invaderArray.length; i ++) {
    if (!deadInvaderArray.includes(i)) {
      possibleshooterArray.push(i)
    }
  }
  const randomShooterGenerator = possibleshooterArray[Math.floor(Math.random() * possibleshooterArray.length)]
  return parseInt(cells[invaderArray[randomShooterGenerator]].value)
}

function scoreUp(num) {
  score += num
  console.log(score)
  if (score > 0) {
    scoreDisplay.innerHTML = `SCORE <1> 00${score}`
  }
  if (score >= 100) {
    scoreDisplay.innerHTML = `SCORE <1> 0${score}`
  }
  if (score >= 1000) {
    scoreDisplay.innerHTML = `SCORE <1> ${score}`
  }
}

function killInvaders(position) {
  cells[position].classList.remove(invaderClass)
  cells[position].classList.remove(altInvaderClass)
  cells[position].classList.add(hitInvaderClass)
  setTimeout(deleteExplosions, 400)
  const deadAlien = invaderArray.indexOf(position)
  deadInvaderArray.push(deadAlien)
  cells[position].classList.remove(playerPClass)
}

function deleteExplosions() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(hitInvaderClass)
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
    if (!deadInvaderArray.includes(i)) {
      if (invaderAltArray[i] === invaderArray[i]) { 
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
  } if (gridLeft && invaderDirection === - 1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth - 1)
    invaderAltArray = invaderAltArray.map(invader => invader + gridWidth - 1)
    invaderDirection = 1
  } 
  
  invaderArray = invaderArray.map(invader => invader + invaderDirection)
  invaderAltArray = invaderAltArray.map(invader => invader + invaderDirection)
  
  addInvaders()
  hasWon()
}

function hasWon () {
  if (invaderArray.length === deadInvaderArray.length) {
    endWave = true
    waveNumber += 1
    livesLeft += 1
    deadInvaderArray = []
    removeInvaders()
    invaderArray =  []
    invaderAltArray = []
    if (waveNumber === 2) {
      speedUpcount = 950
    }
    if (waveNumber === 3) {
      speedUpcount = 900
    }
    if (waveNumber === 4) {
      speedUpcount = 850
    }
    if (waveNumber >= 5) {
      speedUpcount = 750
    }
    clearInterval(invaderSpeed)
    clearInterval(invaderShootTimer)
    clearScreen()
    setTimeout(resetWave,2000)
  }
}

function clearScreen() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(altInvaderClass)
    cells[i].classList.remove(invaderClass)
    cells[i].classList.remove(playerClass)
    cells[i].classList.remove(barrierClass)
  }
  scoreDisplay.innerHTML = ''
  highScoreDisplay.innerHTML = ''
}

function resetWave() {
  scoreUp(0)
  highScoreDisplay.innerHTML = 'HI-SCORE'
  endWave = false
  addPlayer(playerPosition)
  addBarriers(barrierArray)
  invaderArray = [ 3,4,5,6,7,8,9,10,11,19,
    20,21,22,23,24,25,26,27,35,36,37,38,39,
    40,41,42,43,51,52,53,54,55,56,57,58,59,
    67,68,69,70,71,72,73,74,75 ]
  invaderAltArray = [ 3,4,5,6,7,8,9,10,11,19,20,21,22,23,24,25,26,27 ]
  addInvaders()
  
  invaderSpeed = setInterval(() => {
    movingInvaders()
  }, speedUpcount)

  invaderShootTimer = setInterval(invaderShoot,1500)
  console.log('WAVE ' + waveNumber +'. Speed is now ' + speedUpcount)
  scoreUp(0)
} 

let invaderShootTimer = setInterval(invaderShoot,1500)

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