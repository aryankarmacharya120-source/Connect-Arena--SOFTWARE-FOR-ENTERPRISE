import test from 'node:test';
import assert from 'node:assert/strict';
import { createBoard, dropDisc, findWin, isDraw } from '../src/game/connectFour.js';
import { RoomManager } from '../src/game/roomManager.js';

test('discs stack from the bottom', () => {
  const b = createBoard();
  assert.equal(dropDisc(b, 3, 'red').row, 5);
  assert.equal(dropDisc(b, 3, 'yellow').row, 4);
});

test('rejects invalid and full columns', () => {
  const b = createBoard();
  assert.ok(dropDisc(b, 9, 'red').error);
  for (let i = 0; i < 6; i++) dropDisc(b, 0, 'red');
  assert.ok(dropDisc(b, 0, 'red').error);
});

test('detects horizontal, vertical and diagonal wins', () => {
  let b = createBoard();
  for (let c = 0; c < 4; c++) dropDisc(b, c, 'red');
  assert.equal(findWin(b, 5, 3)?.length, 4);

  b = createBoard();
  for (let i = 0; i < 4; i++) dropDisc(b, 2, 'yellow');
  assert.equal(findWin(b, 2, 2)?.length, 4);

  b = createBoard();
  b[5][0] = 'red'; b[4][1] = 'red'; b[3][2] = 'red'; b[2][3] = 'red';
  assert.ok(findWin(b, 2, 3));
});

test('no false win with three in a row', () => {
  const b = createBoard();
  for (let c = 0; c < 3; c++) dropDisc(b, c, 'red');
  assert.equal(findWin(b, 5, 2), null);
});

test('draw when top row is full', () => {
  const b = createBoard();
  b[0].fill('red');
  assert.ok(isDraw(b));
});

test('room flow: create, join, turns, win', () => {
  const m = new RoomManager();
  const a = { id: 'a', username: 'alice', avatarSeed: 'alice' };
  const bb = { id: 'b', username: 'bob', avatarSeed: 'bob' };
  const { room } = m.create(a, 'test');
  assert.equal(room.status, 'waiting');
  assert.ok(m.move('a', 0).error); // game not started
  m.join(bb, room.id);
  assert.equal(room.status, 'playing');
  assert.ok(m.move('b', 0).error); // red (alice) goes first

  let last;
  for (let i = 0; i < 3; i++) {
    m.move('a', i);
    m.move('b', i);
  }
  last = m.move('a', 3);
  assert.ok(last.error === undefined);
  // alice has 0,1,2 (bottom row) + 3 -> but bob played row above, alice bottom row wins
  assert.equal(last.finished?.result, 'win');
});

test('leaving mid-game is a forfeit', () => {
  const m = new RoomManager();
  const { room } = m.create({ id: 'a', username: 'a', avatarSeed: 'a' });
  m.join({ id: 'b', username: 'b', avatarSeed: 'b' }, room.id);
  const res = m.leave('a');
  assert.equal(res.finished.result, 'forfeit');
  assert.equal(res.finished.winnerId, 'b');
});
