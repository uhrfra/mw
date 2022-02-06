/* eslint-disable no-unused-vars */
'use strict'

class Field {
  constructor (x, y, fieldOpenedCallback) {
    this.x = x
    this.y = y
    this.isBomb = false
    this.isOpen = false
    this.isFlagged = false
    this.neighborBombCount = 0
    this.fieldOpenedCallback = fieldOpenedCallback
  }

  toState () {
    var state = []
    state.isOpen = this.isOpen
    state.isBomb = this.isBomb
    state.isFlagged = this.isFlagged
    state.neighborBombCount = this.neighborBombCount
    state.isResolved = this.isResolved
    return state
  }

  open () {
    if (this.isOpen === true) {
      return this.neighborBombCount
    }

    this.isOpen = true
    this.fieldOpenedCallback(this.isFlagged)
    this.isFlagged = false
    this.fieldChangedCallback(this.x, this.y, this.toState())

    return this.neighborBombCount
  }

  toggleFlag () {
    if (this.isOpen) {
      return 0
    }

    this.isFlagged = !this.isFlagged

    let increment = 1
    if (!this.isFlagged) {
      increment = -1
    }

    this.fieldChangedCallback(this.x, this.y, this.toState())

    return increment
  }

  resolve (lost) {
    if (lost === false) {
      if (this.isBomb && !this.isFlagged) {
        this.isFlagged = true
        this.fieldChangedCallback(this.x, this.y, this.toState())
      }
    } else {
      if (this.isBomb) {
        this.isResolved = true
        this.fieldChangedCallback(this.x, this.y, this.toState())
      } else if (!this.isBomb && this.isFlagged) {
        this.isResolved = true
        this.fieldChangedCallback(this.x, this.y, this.toState())
      }
    }
  }

  setFieldChangedCallback (fieldChangedCallback) {
    this.fieldChangedCallback = fieldChangedCallback
  }

  setNeighborBombCount (count) {
    this.neighborBombCount = count
  }
}
