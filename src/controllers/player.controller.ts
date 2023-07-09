import { WebSocket } from 'ws';
import * as db from '../db/db.js';
import { Player } from '../types/Player.js';

export const addPlayer = (player: Player) => {
  return db.addPlayerToDb(player);
};

export const addPlayerToActive = (playerIndex: number, ws: WebSocket) => {
  return db.addActivePlayerToDb(playerIndex, ws);
};
