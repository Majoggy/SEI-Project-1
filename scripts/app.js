// * Dom Elements

const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('game-text-1')
const highScoreDisplay = document.getElementById('game-text-2')
const bannerText = document.getElementById('banner-text')
const bannerSubText = document.getElementById('banner-sub-text')
const livesCounter = document.getElementById('lives-counter')
const waveCounter = document.getElementById('wave-counter')
const livesWavesBar = document.querySelector('.lives-remaining-bar')
const statusBar = document.querySelector('.status-bar-wrapper')


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


let isGameOver = false
let isTitleScreen = true
let keySpam = false
let endWave = false
let waveNumber = 1
let livesLeft = 3
let speedUpcount = 1050
let score = 0
let invaderDirection = 1
const playerStartingPosition = 247
let playerPosition = playerStartingPosition
let screenTopCount = 0


// * Arrays

const cells = []
let invaderArray = []
let invaderAltArray = []
let possibleshooterArray = []
let deadInvaderArray = []
const barrierArray = [ 226, 230, 233, 237 ]
const gridEndArray = [ 240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255]
const screenTopArray = [ 3,4,5,6,7,8,9,10,11,19,
  20,21,22,23,24,25,26,27,35,36,37,38,39,
  40,41,42,43,51,52,53,54,55,56,57,58,59 ]


// * Timers

let invaderShootTimer = setInterval(invaderShoot,1500)

let invaderSpeed = setInterval(movingInvaders, speedUpcount)

function speedUp(num) {
  speedUpcount -= 15
  clearInterval(invaderSpeed)
  invaderSpeed = setInterval(() => {
    movingInvaders()
  }, num)
}


// * Generate Grid & Barriers

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.value = i
    grid.appendChild(cell)
    cells.push(cell)
  }
}

function addBarriers(array) {
  for (let i = 0; i < array.length; i++) {
    cells[array[i]].classList.add(barrierClass)
  }
}

function setAlienArrays() {
  invaderArray = [ 3,4,5,6,7,8,9,10,11,19,
    20,21,22,23,24,25,26,27,35,36,37,38,39,
    40,41,42,43,51,52,53,54,55,56,57,58,59,
    67,68,69,70,71,72,73,74,75 ]
  invaderAltArray = [ 3,4,5,6,7,8,9,10,11,19,20,21,22,23,24,25,26,27 ]
}


// * Start Game

function titleScreen() {
  createGrid()
  clearBars()
  clearInterval(invaderSpeed)
  clearInterval(invaderShootTimer)
}

function startGame() {
  displayBars()
  addPlayer(playerStartingPosition)
  addBarriers(barrierArray)
  setAlienArrays()
  addInvaders()
  invaderSpeed = setInterval(movingInvaders,speedUpcount)
  invaderShootTimer = setInterval(invaderShoot,1500)
}

titleScreen()


// * Controls & player movement

function handleKeyUp(event) {
  if (!endWave && !isTitleScreen) {
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
  if (event.key === 'Enter') {
    if (isTitleScreen) {
      isTitleScreen = false
      startGame()
    }
  }
}

function addPlayer(position) {
  cells[position].classList.add(playerClass)
}

function removePlayer(position) {
  cells[position].classList.remove(playerClass)
}


// * Player shooting

function keySpamTimer() {
  keySpam = false
}

function playerShoot() {
  let position = playerPosition - gridWidth
  keySpam = true
  setTimeout(keySpamTimer,830)
  if (cells[position].classList.contains(barrierClass)) {
    return
  }
  cells[position].classList.add(playerPClass) 
  const projectileSpeed = setInterval(shootProjectile,25)
  
  function shootProjectile() {
    cells[position].classList.remove(playerPClass)
    if (position <= gridWidth || endWave) {
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


// * Invader shooting

function invaderShoot() {
  let invaderShooterPosition = calculatePossibleShooters()
  invaderShooterPosition = invaderShooterPosition + gridWidth
  cells[invaderShooterPosition].classList.add(invaderPClass)
  const projectileTimer = setInterval(alienProjectile, 120)

  function alienProjectile() {
    if (cells[invaderShooterPosition].classList.contains(barrierClass)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
    } else if (cells[invaderShooterPosition].classList.contains(playerClass)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
      loseLife()
    } else if (gridEndArray.includes(invaderShooterPosition)) {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      clearInterval(projectileTimer)
    } else {
      cells[invaderShooterPosition].classList.remove(invaderPClass)
      invaderShooterPosition += gridWidth
      cells[invaderShooterPosition].classList.add(invaderPClass)
    }
  }
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

function killInvaders(position) {
  const deadAlien = invaderArray.indexOf(position)
  deadInvaderArray.push(deadAlien)
  cells[position].classList.remove(invaderClass, altInvaderClass, playerPClass)
  cells[position].classList.add(hitInvaderClass)
  setTimeout(deleteExplosions, 400)
}

function deleteExplosions() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(hitInvaderClass)
  }
}


// * Invader Movement

function addInvaders() {
  // Code for dealing with array falling off screen
  for (let i = 0; i < invaderArray.length; i ++) {
    if (invaderArray[i] >= cells.length) {
      invaderArray[i] = screenTopArray[screenTopCount]
      screenTopCount += 1
    }
    // Code for not drawing dead invaders
    if (!deadInvaderArray.includes(i)) {
      if (invaderAltArray[i] === invaderArray[i]) { 
        cells[invaderArray[i]].classList.add(altInvaderClass)
      }
      cells[invaderArray[i]].classList.add(invaderClass)
    }
    // Code that checks for player/invader collision
    if (cells[invaderArray[i]].classList.contains(playerClass) && cells[invaderArray[i]].classList.contains(invaderClass)) {
      gameOver()
      return
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

function movingInvaders() {
  const gridLeft = invaderArray[0] % gridWidth === 0
  const gridRight = invaderArray[invaderArray.length - 1] % gridWidth === gridWidth - 1

  removeInvaders()
  
  if (gridRight && invaderDirection === 1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth + 1)
    invaderAltArray = invaderAltArray.map(invader => invader + gridWidth + 1)
    invaderDirection = -1
  } else if (gridLeft && invaderDirection === - 1) {
    invaderArray = invaderArray.map(invader => invader + gridWidth - 1)
    invaderAltArray = invaderAltArray.map(invader => invader + gridWidth - 1)
    invaderDirection = 1
  } 
  invaderArray = invaderArray.map(invader => invader + invaderDirection)
  invaderAltArray = invaderAltArray.map(invader => invader + invaderDirection)
  
  addInvaders()

  if (deadInvaderArray.length === 45) {
    hasWon()
  }
}


// * Score & lives

function loseLife () {
  if (livesLeft === 0) {
    gameOver()
  } else {
    livesLeft -= 1
    livesCounter.innerHTML = `${livesLeft} x ` 
  }
}

function oneUp() { 
  livesLeft += 1
  livesCounter.innerHTML = `${livesLeft} x `
}

function scoreUp(num) {
  score += num
  if (score > 0) {
    scoreDisplay.innerHTML = `SCORE <1> 00${score}`
  } else if (score >= 100) {
    scoreDisplay.innerHTML = `SCORE <1> 0${score}`
  } else (score >= 1000)
  scoreDisplay.innerHTML = `SCORE <1> ${score}`
}


// * Winning, losing & resetting

function hasWon () {
  clearInterval(invaderShootTimer)
  endWave = true
  deadInvaderArray = []
  removeInvaders()
  clearInterval(invaderSpeed)
  clearScreen()
  if (!isGameOver) setTimeout(resetWave,2500)
}

function waveUp() {
  waveNumber += 1
  if (waveNumber === 2) {
    speedUpcount = 950
  } else if (waveNumber === 3) {
    speedUpcount = 900
  } else if (waveNumber === 4) {
    speedUpcount = 850
  } else speedUpcount = 750
}

function clearScreen() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove(altInvaderClass, invaderClass, playerClass, barrierClass)
  }
  clearBars()
  if (isGameOver) {
    gameOverText()
  } else {
    waveUp()
    nextWaveText()
    oneUp()
  }
}

function nextWaveText () {
  bannerText.innerHTML = `WAVE 0${waveNumber}`
  bannerSubText.style.marginLeft = '370px'
  bannerSubText.innerHTML = 'GET READY'
  waveCounter.innerHTML = `WAVE 0${waveNumber}`
}

function gameOverText () {
  bannerText.innerHTML = 'GAME OVER'
  bannerSubText.style.marginLeft = '330px'
  bannerSubText.innerHTML = `YOU SCORED ${score}`
}

function clearBars () {
  bannerText.style.display = 'block'
  bannerSubText.style.display = 'block'
  livesWavesBar.style.display = 'none'
  statusBar.style.display = 'none'
}

function displayBars () {
  bannerText.style.display = 'none'
  bannerSubText.style.display = 'none'
  livesWavesBar.style.display = 'flex'
  statusBar.style.display = 'flex'
  
}

function resetWave() {
  displayBars()
  endWave = false
  addPlayer(playerPosition)
  addBarriers(barrierArray)
  setAlienArrays()
  addInvaders()
  scoreUp(0)
  invaderSpeed = setInterval(movingInvaders,speedUpcount)
  invaderShootTimer = setInterval(invaderShoot,1500)
} 

function gameOver() {
  isGameOver = true
  hasWon()
}


// * Event Listeners

window.addEventListener('keyup', handleKeyUp)