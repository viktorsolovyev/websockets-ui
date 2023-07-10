import { WebSocket } from 'ws';
import * as db from '../db/db.js';
import { Player } from '../types/Player.js';
import { Ship } from '../types/Ship.js';

export const addPlayer = (player: Player) => {
  return db.addPlayerToDb(player);
};

export const getAllActivePlayers = () => {
  return db.getAllActivePlayersFromDb();
};

export const getActivePlayerByWs = (ws: WebSocket) => {
  return db.getActivePlayerByWsFromDb(ws);
};

export const getActivePlayersByIds = (ids: number[]) => {
  return db.getActivePlayersByIdsFromDb(ids);
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

export const addPlayerToRoom = (player: Player, indexRoom: number) => {
  return db.addPlayerToRoomToDb(player, indexRoom);
};

export const addGame = () => {
  return db.addGameToDb();
};

export const addShipsToBoard = (gameId: number, playerId: number, ships: Ship[]) => {
  return db.addShipsToBoardToDb(gameId, playerId, ships);
};
