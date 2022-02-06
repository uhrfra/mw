/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict'

class Game {
  constructor (boardSize, numberOfBombs) {
    this.board = new Board(boardSize)
    this.flagCount = 0
    this.numberOfBombs = numberOfBombs
    this.startTime = 0
    this.endTime = 0
    this.state = 'pending'
  }

  getBoardSize () {
    return this.board.getSize()
  }

  openField (x, y) {
    if (!this.board.hasCoordinate(x, y)) {
      return
    }

    if (this.state === 'won' || this.state === 'lost') {
      return
    }

    if (this.state === 'pending') {
      this.board.setup(this.numberOfBombs, x, y)
      this.startTime = Date.now()
      this.state = 'running'
      this.gameStateChangedCallback(this.state)
    }

    if (this.board.getField(x, y).isFlagged) {
      this.flagCount--
      if (this.remainingFlagsCountChangedCallback !== undefined) {
        this.remainingFlagsCountChangedCallback(this.getRemainingFlagsCount())
      }
    }

    const neighborCount = this.board.getField(x, y).open()

    if (this.board.getField(x, y).isBomb === true) {
      this.endTime = Date.now()
      this.state = 'lost'
      this.board.resolve(true)
      this.gameStateChangedCallback(this.state)
    }

    if (this.board.getClosedFieldsCount() === this.numberOfBombs) {
      this.endTime = Date.now()
      this.state = 'won'
      this.board.resolve(false)
      if (this.remainingFlagsCountChangedCallback !== undefined) {
        this.remainingFlagsCountChangedCallback(0)
      }
      this.gameStateChangedCallback(this.state)
    }

    if (neighborCount === 0) {
      var callback = function (i, j) { this.openField(i, j) }.bind(this)
      this.board.openNeighbors(x, y, callback)
    }
  }

  revealNeighbors (x, y) {
    if (this.state !== 'running') {
      return
    }

    if (!this.board.hasCoordinate(x, y)) {
      return
    }

    if (this.board.fields[x][y].isOpen === false) {
      return
    }

    const neighborFlagCount = this.board.getNeighborFlagCount(x, y)

    if (neighborFlagCount >= this.board.fields[x][y].neighborBombCount) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (this.board.hasCoordinate(x + i, y + j) === true) {
            if (this.board.fields[x + i][y + j].isFlagged === false) {
              this.openField(x + i, y + j)
            }
          }
        }
      }
    }
  }

  toggleFlag (x, y) {
    if (this.state !== 'running') {
      return
    }

    if (!this.board.hasCoordinate(x, y)) {
      return
    }

    const increment = this.board.getField(x, y).toggleFlag()
    this.flagCount += increment
    if (increment !== 0 && this.remainingFlagsCountChangedCallback !== undefined) {
      this.remainingFlagsCountChangedCallback(this.getRemainingFlagsCount())
    }
  }

  getDuration () {
    if (this.state === 'pending') {
      return 0
    }

    if (this.state === 'running') {
      return Math.floor((Date.now() - this.startTime) / 1000)
    }

    return Math.floor((this.endTime - this.startTime) / 1000)
  }

  getRemainingFlagsCount () {
    return this.numberOfBombs - this.flagCount
  }

  setRemainingFlagsCountChangedCallback (remainingFlagsCountChangedCallback) {
    this.remainingFlagsCountChangedCallback = remainingFlagsCountChangedCallback
  }

  getState () {
    return this.state
  }

  setGameStateChangedCallback (gameStateChangedCallback) {
    this.gameStateChangedCallback = gameStateChangedCallback
  }

  setFieldChangedCallback (fieldChangedCallback) {
    this.board.setFieldChangedCallback(fieldChangedCallback)
  }
}
