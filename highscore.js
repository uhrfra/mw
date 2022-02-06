'use strict'

const maxHighscoreEntries = 5

function checkHighscore (level, duration) {
  if (level !== 'easy' && level !== 'advanced' && level !== 'hard') {
    return false
  }
  const keyname = 'highscore-' + level

  if (!localStorage.getItem(keyname)) {
    return true
  }

  const entries = localStorage.getItem(keyname)
  if (entries.length < maxHighscoreEntries) {
    return true
  }

  return entries[maxHighscoreEntries - 1].duration > duration
}

function insertHighscore(level, name, time, duration) {
  var entry = []
  entry.name = name
  entry.time = time
  entry.duration = duration

  const keyname = 'highscore-' + level

  var entries = []
  if (localStorage.getItem(keyname)) {
    entries = localStorage.getItem(keyname)
  }

  entries.push(entry)

  entries.sort(function (a, b) { return a.duration < b.duration })

  if (entries.length > 5) {
    entries.length = 5
  }

  var str = JSON.stringify(entries)
  localStorage.setItem(keyname, str)
}
