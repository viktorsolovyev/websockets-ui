import { WebSocket } from 'ws';
import { Player, activePlayer } from '../types/Player.js';

export const players: Player[] = [];
export const activePlayers: activePlayer[] = [];

// export const removeUserFromDbById = (id: string): void => {
//   users = users.filter((element) => element.id !== id);
// };

export const addPlayerToDb = (player: Player): number => {
  players.push(player);
  return players.length - 1;
};

export const addActivePlayerToDb = (playerIndex: number, ws: WebSocket): void => {
  activePlayers.push({ playerIndex, ws });
};

// export const changeUserByIdInDb = (user: Player, changedUser: Player): Player => {
//   const idx = users.findIndex((element) => element.id === user.id);
//   users[idx].username = changedUser.username;
//   users[idx].age = changedUser.age;
//   users[idx].hobbies = changedUser.hobbies;
//   return users[idx];
// };
