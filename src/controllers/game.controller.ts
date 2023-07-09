import { WebSocket } from 'ws';
import * as db from '../db/db.js';
import { Player } from '../types/Player.js';

export const addPlayer = (player: Player) => {
  return db.addPlayerToDb(player);
};

export const getActivePlayers = () => {
  return db.getActivePlayersFromDb();
};

export const getActivePlayerByWs = (ws: WebSocket) => {
  return db.getActivePlayerByWsFromDb(ws);
};

export const addActivePlayer = (player: Player, ws: WebSocket) => {
  return db.addActivePlayerToDb(player, ws);
};

export const removeActivePlayer = (ws: WebSocket) => {
  return db.removeActivePlayerFromDb(ws);
};

export const addRoom = () => {
  return db.addRoomToDb();
};

export const getRoomsWithOnePlayerInside = () => {
  return db.getRoomsWithOnePlayerInsideFromDb();
};
