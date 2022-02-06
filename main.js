/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

// Disable context menu
document.oncontextmenu = function () {
  return false
}

// Parse args
const params = new URLSearchParams(document.location.search)
let sizex = params.get('sizex')
let sizey = params.get('sizey')
let bombcount = params.get('bombs')
let level = ''

if (sizex === null || sizey === null || bombcount === null) {
  level = params.get('level')
  if (level === 'easy') {
    sizex = 8
    sizey = 8
    bombcount = 10
  } else if (level === 'hard') {
    sizex = 30
    sizey = 16
    bombcount = 99
  } else {
    sizex = 16
    sizey = 16
    bombcount = 40
  }
}

function fieldChangedCallback (x, y, state) {
  updateField(x, y, state)
}

var game = new Game([sizex, sizey], bombcount)
game.setFieldChangedCallback(fieldChangedCallback)

// Set callback to update flags count
game.setRemainingFlagsCountChangedCallback(updateRemainingFlagsCount)
updateRemainingFlagsCount(game.getRemainingFlagsCount())

// Set game state change callback
game.setGameStateChangedCallback(() => {
  updateSmiley()
  if (game.getState() === 'won') {
    checkAndAddToHighscore(game.getDuration())
  }
})

updateSmiley(game.getState())

// Setup timer
setInterval(() => { updateDuration(game.getDuration()) }, 500)

// Event handlers for mouse events
function fieldClicked (eventdata, x, y) {
  if (eventdata.button === 0) {
    game.revealNeighbors(x, y)
    game.openField(x, y)
  } else {
    game.toggleFlag(x, y)
  }
}

function fieldDoubleClicked (eventdata, x, y) {
  game.revealNeighbors(x, y)
}

function checkAndAddToHighscore (duration) {
  const time = Date.now()
  if (checkHighscore(level, duration) === true) {
    const name = prompt('Congratulations, you are in the highscore!\nPlease enter your name:')
    if (name == null || name === '') {
      return
    }
    insertHighscore(level, name, time, duration)
  }
}

setupView(game)
