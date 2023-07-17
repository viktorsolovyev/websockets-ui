import { BoardItem } from './BoardItem.js';

export type Game = {
  id: number;
  board: BoardItem[];
  currentTurnIndexPlayer: number;
};
