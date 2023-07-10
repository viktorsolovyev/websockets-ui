import { activePlayer } from './Player.js';
import { Ship } from './Ship.js';

export type Game = {
  id: number;
  board: { player: activePlayer; ships: Ship[] }[];
};
