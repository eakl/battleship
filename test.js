'use strict'

const test = require('tape')
const Api = require('./api')

test('Ship coordinates are retrieved successfully during initialisation', (t) => {

  t.ok(Api.getShipCoords([{ x: 2, y: 2 }], 4).length === 4, 'A 4-block ship has 4 coordinates')
  t.ok(typeof Api.getShipCoords([{ x: 2, y: 2 }], 3)[2] === 'object', 'A coordinate is an object')
  t.ok(Api.getShipCoords([{ x: 2, y: 2 }], 2)[1].x, 'The \'x\' coordinate exists')

  t.end()
})

test('Coordinate validator is working', (t) => {
  const db = {
    battlefield: [
      [0,0,0,0,1],
      [0,0,0,1,0],
      [0,0,0,0,0],
      [0,0,0,1,1],
      [0,1,0,0,0]
    ]
  }

  t.false(Api.isCoordsValid(db.battlefield, [4, 3, 2, 1], 2, 5), 'Prevent coordinates out of boundaries')
  t.false(Api.isCoordsValid(db.battlefield, [4, 3, 2, 1], 3, 1), 'Diagonal adjacent placement is forbidden')
  t.ok(Api.isCoordsValid(db.battlefield, [4, 3, 2, 1], 1, 3), 'Adjacent placement is accepted')
  t.false(Api.isCoordsValid(db.battlefield, [3], 4, 3), 'Adjacent placement is forbidden for small boats')

  t.end()
})

test('Given a coordinate, a ship is built on the battlefield', (t) => {
  const board = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]

  const updatedBoard = [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0]
  ]

  const board2 = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]

  const updatedBoard2 = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,1,1,1]
  ]

  const board3 = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]

  const updatedBoard3 = [
    [0,0,0],
    [0,1,0],
    [0,0,0]
  ]

  t.deepEqual(Api.updateBattlefield(board, [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }]), updatedBoard, 'The battlefield is updated according to the coordinates (4-block ship)')
  t.deepEqual(Api.updateBattlefield(board2, [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }]), updatedBoard2, 'The battlefield is updated according to the coordinates (3-block ship)')
  t.deepEqual(Api.updateBattlefield(board3, [{ x: 1, y: 1 }]), updatedBoard3, 'The battlefield is updated according to the coordinates (1-block ship)')

  t.end()
})

test('The fleet is updated successfully', (t) => {
  t.deepEqual(Api.updateFleet([4, 3, 2]), [4, 3, 1], 'The fleet is updated accordingly [4, 3, 2] -> [4, 3, 1]')
  t.deepEqual(Api.updateFleet([4, 1]), [4], 'The fleet is updated accordingly [4, 1] -> [4]')
  t.deepEqual(Api.updateFleet([1]), [], 'The fleet is updated accordingly [1] -> []')

  t.end()
})

test('Missed shot is working', (t) => {
  const dbBefore = {
    battlefield: [
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ],
    position: [
      [{x: 2,y: 1},{x: 2,y: 2},{x: 2,y: 3},{x: 2,y: 4}]
    ],
    counter: 0,
    finished: false
  }

  const dbAfter = {
    battlefield: [
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,3],
      [0,0,1,0,0]
    ],
    position: [
      [{x: 2,y: 1},{x: 2,y: 2},{x: 2,y: 3},{x: 2,y: 4}]
    ],
    counter: 1,
    finished: false
  }

  const missedShot = Api.attack(dbBefore, { x: 4, y: 3})

  t.deepEqual(missedShot.db, dbAfter, 'The battlefield is updated after a miss')
  t.equal(missedShot.msg, 'Miss', 'Message: \'Miss\'')

  t.end()
})

test('Ship coordinates and battlefield are replaced successfully after a hit', (t) => {
  const dbBefore = {
    battlefield: [
      [0,0,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,0,0,1,1]
    ],
    position: [
      [{x: 1,y: 1},{x: 1,y: 2},{x: 1,y: 3}],
      [{x: 3,y: 4},{x: 4,y: 4}]
    ],
    counter: 0,
    finished: false
  }

  const dbAfter = {
    battlefield: [
      [0,0,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,0,0,3,1]
    ],
    position: [
      [{x: 1,y: 1},{x: 1,y: 2},{x: 1,y: 3}],
      [3,{x: 4,y: 4}]
    ],
    counter: 1,
    finished: false
  }

  const hitShot = Api.attack(dbBefore, { x: 3, y: 4})

  t.deepEqual(hitShot.db, dbAfter, 'The battlefield and its coordinates are replaced successfully after a hit')
  t.equal(hitShot.msg, 'Hit', 'Message: \'Hit\'')

  t.end()
})

test('Ship coordinates are deleted successfully after a sink', (t) => {
  const dbBefore = {
    battlefield: [
      [0,0,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,0,0,3,1]
    ],
    position: [
      [{x: 1,y: 1},{x: 1,y: 2},{x: 1,y: 3}],
      [3,{x: 4,y: 4}]
    ],
    counter: 0,
    finished: false
  }

  const dbAfter = {
    battlefield: [
      [0,0,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,1,0,0,0],
      [0,0,0,3,3]
    ],
    position: [
      [{x: 1,y: 1},{x: 1,y: 2},{x: 1,y: 3}]
    ],
    counter: 1,
    finished: false
  }

  const sinkShot = Api.attack(dbBefore, { x: 4, y: 4})

  t.deepEqual(sinkShot.db, dbAfter, 'The coordinates are deleted an the battleship is updated after a sink')
  t.equal(sinkShot.msg, 'You just sank the destroyer', 'Message: \'You just sank the destroyer\'')

  t.end()
})

test('Win shot is working when all the ship have been sank ', (t) => {
  const dbBefore = {
    battlefield: [
      [0,0,0,0,0],
      [0,3,0,0,0],
      [0,3,0,0,0],
      [0,1,0,0,0],
      [0,0,0,3,3]
    ],
    position: [
      [{x: 1,y: 3}]
    ],
    counter: 10,
    finished: false
  }

  const dbAfter = {
    battlefield: [
      [0,0,0,0,0],
      [0,3,0,0,0],
      [0,3,0,0,0],
      [0,3,0,0,0],
      [0,0,0,3,3]
    ],
    position: [],
    counter: 11,
    finished: true
  }

  const winShot = Api.attack(dbBefore, { x: 1, y: 3})

  t.deepEqual(winShot.db, dbAfter, 'The coordinates are deleted an the battleship is updated after a win')
  t.equal(winShot.msg, 'Win! You completed the game in 11 moves', 'Message: Win! You completed the game in 11 moves')

  t.end()
})

test('You cannot make a shot when all the ships have been sunk', (t) => {
  const dbBefore = {
    battlefield: [
      [0,0,0],
      [0,3,0],
      [0,3,0]
    ],
    position: [],
    counter: 10,
    finished: true
  }

  const noMoreShot = Api.attack(dbBefore, { x: 1, y: 0})

  t.ok(noMoreShot.db.finished, 'No more coordinates in the database. The game is finished')
  t.equal(noMoreShot.msg, 'Dude it\'s finished!')

  t.end()
})
