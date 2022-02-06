/* eslint-disable no-unused-vars */
'strict mode'

// eslint-disable-next-line no-extend-native
Number.prototype.pad = function (size) {
  var s = String(this)
  while (s.length < (size || 2)) { s = '0' + s }
  return s
}

function makeField (columnIndex, rowIndex) {
  var id = 'field-' + columnIndex.pad(2) + '-' + rowIndex.pad(2)
  var htmltext = '<td><div id="' + id + '" class="field" ' +
  'onmousedown="fieldClicked(event, ' + columnIndex.toString() + ', ' + rowIndex.toString() + ')"' +
  'ondblclick="fieldDoubleClicked(event, ' + columnIndex.toString() + ', ' + rowIndex.toString() + ')"' +
  '></div></td>'
  return htmltext
}

function makeRow (rowIndex, columnCount) {
  var htmltext = '<tr>'
  for (let i = 0; i < columnCount; i++) {
    htmltext += makeField(i, rowIndex)
  }
  htmltext += '</tr>'
  return htmltext
}

function setupView (game) {
  var size = game.getBoardSize()

  var htmltext = ''
  for (let i = 0; i < size[1]; i++) {
    htmltext += makeRow(i, size[0])
  }

  document.getElementById('board-panel').innerHTML = htmltext
}

function updateField (x, y, state) {
  var id = 'field-' + x.pad(2) + '-' + y.pad(2)
  const item = document.getElementById(id)

  if (state.isBomb && state.isResolved) {
    item.classList.remove('field')
    item.classList.add('field-bomb-resolved')
    return
  }

  if (state.isFlagged === true) {
    item.classList.remove('field')
    item.classList.remove('field-flagged')

    if (state.isResolved === true && state.isBomb === false) {
      item.classList.add('field-flag-resolved')
      item.innerHTML = '<b>/</b>'
      return
    }

    item.classList.add('field-flagged')
  } else {
    item.classList.remove('field-flagged')
    item.classList.add('field')
  }

  if (state.isOpen) {
    item.classList.remove('field')
    if (state.isBomb === true) {
      item.classList.add('field-opened-bomb')
    } else {
      item.classList.add('field-opened')
      if (state.neighborBombCount > 0) {
        item.innerHTML = state.neighborBombCount
        switch (state.neighborBombCount) {
          case 1:
            item.classList.add('one')
            break
          case 2:
            item.classList.add('two')
            break
          case 3:
            item.classList.add('three')
            break
          case 4:
            item.classList.add('four')
            break
          case 5:
            item.classList.add('five')
            break
          case 6:
            item.classList.add('six')
            break
          case 7:
            item.classList.add('seven')
            break
          case 8:
            item.classList.add('eight')
            break
        }
      }
    }
  }
}

function updateRemainingFlagsCount (count) {
  const item = document.getElementById('flag-count-display')
  item.innerHTML = count
}

function updateDuration (seconds) {
  const item = document.getElementById('duration-display')
  item.innerHTML = seconds
}

function updateSmiley (state) {
  const item = document.getElementById('smiley-display')

  if (state === 'lost') {
    item.innerHTML = "<img src='presentation/icons/smiley-lost.png' alt = ':-('>"
  } else if (state === 'won') {
    item.innerHTML = "<img src='presentation/icons/smiley-won.png' alt = ':-)'>"
  } else {
    item.innerHTML = "<img src='presentation/icons/smiley-normal.png' alt = ':-)'>"
  }
}
