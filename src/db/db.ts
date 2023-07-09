import { WebSocket } from 'ws';
import { Player, activePlayer } from '../types/Player.js';
import { Room } from '../types/Room.js';

export const players: Player[] = [];
export let activePlayers: activePlayer[] = [];
export const rooms: Room[] = [];

// Player
export const addPlayerToDb = (player: Player): Player => {
  const newPlayer = { id: players.length, name: player.name, password: player.password };
  players.push(newPlayer);
  return newPlayer;
};

export const getActivePlayersFromDb = (): activePlayer[] => {
  return activePlayers;
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

export const addPlayerToRoomToDb = (player: Player, indexRoom: number): void => {
  const room = rooms.find((element) => element.roomId === indexRoom);
  if (room)
    room.roomUsers.push({
      name: player.name,
      index: player.id,
    });
};
