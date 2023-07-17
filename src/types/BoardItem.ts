import { Cell } from './Cell.js';
import { activePlayer } from './Player.js';
import { Ship } from './Ship.js';

export type BoardItem = {
  player: activePlayer;
  ships: Ship[];
  ownField: Cell[];
  enemyField: Cell[];
};
