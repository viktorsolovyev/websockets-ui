import { WebSocket } from 'ws';
import { Game } from '../types/Game.js';
import { Player, activePlayer } from '../types/Player.js';
import { Room } from '../types/Room.js';
import { Ship } from '../types/Ship.js';

export const players: Player[] = [];
export let activePlayers: activePlayer[] = [];
export const rooms: Room[] = [];
export const games: Game[] = [];

// Player
export const addPlayerToDb = (player: Player): Player => {
  const newPlayer = { id: players.length, name: player.name, password: player.password };
  players.push(newPlayer);
  return newPlayer;
};

export const getAllActivePlayersFromDb = (): activePlayer[] => {
  return activePlayers;
};

export const getActivePlayersByIdsFromDb = (ids: number[]): activePlayer[] => {
  return activePlayers.filter(
    (element) => element.player && element.player.id !== undefined && ids.includes(element.player.id),
  );
};

export const getActivePlayerByWsFromDb = (ws: WebSocket): activePlayer | undefined => {
  return activePlayers.find((element) => element.ws === ws);
};

export const addActivePlayerToDb = (player: Player, ws: WebSocket): void => {
  activePlayers.push({ player, ws });
};

export const removeActivePlayerFromDb = (ws: WebSocket): void => {
  activePlayers = activePlayers.filter((element) => element.ws !== ws);
};

// Room
export const addRoomToDb = (): Room => {
  const newRoom = {
    roomId: rooms.length,
    roomUsers: [],
  };
  rooms.push(newRoom);
  return newRoom;
};

export const getRoomsWithOnePlayerInsideFromDb = (): Room[] => {
  return rooms.filter((element) => element.roomUsers.length === 1);
};

export const addPlayerToRoomToDb = (player: Player, indexRoom: number): Room | undefined => {
  const room = rooms.find((element) => element.roomId === indexRoom);
  if (room)
    room.roomUsers.push({
      name: player.name,
      index: player.id,
    });
  return room;
};

// Game
export const addGameToDb = (): Game => {
  const newGame = {
    id: games.length,
    board: [],
  };
  games.push(newGame);
  return newGame;
};

export const addShipsToBoardToDb = (gameId: number, playerId: number, ships: Ship[]): Game | undefined => {
  const game = games.find((element) => element.id === gameId);
  const player = game?.board.find((element) => element.player.player.id === playerId);
  if (player) player.ships = ships;
  return game;
};
