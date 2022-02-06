/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict'

class Board {
  constructor (size) {
    this.size = size
    this.createFields()
  }

  createFields () {
    var that = this
    function fieldOpenedCallback (wasFlagged) {
      that.closedFieldsCount--
    }
    this.fields = []
    for (let i = 0; i < this.size[0]; i++) {
      const column = []
      for (let j = 0; j < this.size[1]; j++) {
        column[j] = new Field(i, j, (wasFlagged) => { fieldOpenedCallback(wasFlagged) })
      }
      this.fields[i] = column
    }
    this.closedFieldsCount = this.size[0] * this.size[1]
  }

  setFieldChangedCallback (fieldChangedCallback) {
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 0; j < this.fields[i].length; j++) {
        this.fields[i][j].setFieldChangedCallback(fieldChangedCallback)
      }
    }
  }

  setup (bombCount, seedX, seedY) {
    this.distributeBombs(bombCount, seedX, seedY)
    this.setNeighborBombCounts()
  }

  distributeBombs (bombCount, seedX, seedY) {
    const reservedIndices = []

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (this.hasCoordinate(seedX + x, seedY + y) === false) {
          continue
        }

        const index = (seedY + y) * this.size[0] + (seedX + x)
        reservedIndices.push(index)
      }
    }
    reservedIndices.sort(function (a, b) { return a - b })

    const freeFieldsCount = this.size[0] * this.size[1] - reservedIndices.length

    const bombIndices = []
    for (var i = 0; i < bombCount; i++) {
      bombIndices.push(Math.floor(Math.random() * (freeFieldsCount - i)))
    }

    for (const bombIndex of bombIndices) {
      let setBombIndex = bombIndex
      for (const reservedIndex of reservedIndices) {
        if (reservedIndex <= setBombIndex) {
          setBombIndex++
        } else {
          break
        }
      }

      reservedIndices.push(setBombIndex)
      reservedIndices.sort(function (a, b) { return a - b })

      const x = setBombIndex % this.size[0]
      const y = Math.floor(setBombIndex / (this.size[0]))
      this.fields[x][y].isBomb = true
    }
  }

  setNeighborBombCounts () {
    for (let x = 0; x < this.size[0]; x++) {
      for (let y = 0; y < this.size[1]; y++) {
        let neighborBombCount = 0

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
              continue
            }

            if (this.hasCoordinate(x + i, y + j) === false) {
              continue
            }

            if (this.fields[x + i][y + j].isBomb === true) {
              neighborBombCount++
            }
          }
        }

        this.fields[x][y].setNeighborBombCount(neighborBombCount)
      }
    }
  }

  getSize () {
    return this.size
  }

  hasCoordinate (x, y) {
    return x >= 0 &&
    y >= 0 &&
    x < this.getSize()[0] &&
    y < this.getSize()[1]
  }

  getField (x, y) {
    return this.fields[x][y]
  }

  getClosedFieldsCount () {
    return this.closedFieldsCount
  }

  openNeighbors (x, y, openCallback) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue
        }

        if (this.hasCoordinate(x + i, y + j) === false) {
          continue
        }

        if (this.fields[x + i][y + j].isOpen === false) {
          openCallback(x + i, y + j)
        }
      }
    }
  }

  getNeighborFlagCount (x, y) {
    let neighborFlagCount = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue
        }
        if (this.hasCoordinate(x + i, y + j) === false) {
          continue
        }
        if (this.fields[x + i][y + j].isFlagged === true) {
          neighborFlagCount++
        }
      }
    }
    return neighborFlagCount
  }

  resolve (lost) {
    for (const column of this.fields) {
      for (const field of column) {
        field.resolve(lost)
      }
    }
  }
}
