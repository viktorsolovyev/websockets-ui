import { WebSocket } from 'ws';
import * as db from '../db/db.js';
import { Game } from '../types/Game.js';
import { Attack } from '../types/index.js';
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

export const AttackEvent = (message: { data: string }, isRandomAtack = false) => {
  const data = JSON.parse(message.data);
  const game = getGameById(data.gameId);
  if (game && game.board[game.currentTurnIndexPlayer].player.player.id === data.indexPlayer) {
    let attackResult: { attackStatus: string; attacks: Attack[]; isFinish: boolean; winPlayer?: number | undefined };
    if (isRandomAtack) {
      const randomAttack = getPositionForRandomAttack(game, data.indexPlayer);
      attackResult = setAttack(game, data.indexPlayer, randomAttack.x, randomAttack.y);
    } else {
      attackResult = setAttack(game, data.indexPlayer, data.x, data.y);
    }

    attackResult.attacks.forEach((attack) => {
      game.board.forEach((element) => {
        element.player.ws.send(
          JSON.stringify({
            type: 'attack',
            data: JSON.stringify({
              position: {
                x: attack.x,
                y: attack.y,
              },
              currentPlayer: game.board[game.currentTurnIndexPlayer].player.player.id,
              status: attack.status,
            }),
            id: 0,
          }),
        );
      });

      if (attackResult.attackStatus === 'miss') {
        game.currentTurnIndexPlayer = game.currentTurnIndexPlayer === 0 ? 1 : 0;
      }

      game.board.forEach((element) => {
        element.player.ws.send(
          JSON.stringify({
            type: 'turn',
            data: JSON.stringify({
              currentPlayer: game.board[game.currentTurnIndexPlayer].player.player.id,
            }),
            id: 0,
          }),
        );
      });
    });

    if (attackResult.isFinish) {
      game.board.forEach((element) => {
        element.player.ws.send(
          JSON.stringify({
            type: 'finish',
            data: JSON.stringify({
              winPlayer: attackResult.winPlayer,
            }),
            id: 0,
          }),
        );
      });
    }
  }
};

export const setAttack = (game: Game, playerId: number, x: number, y: number) => {
  return db.setAttackToDb(game, playerId, x, y);
};

export const getGameById = (gameId: number) => {
  return db.getGameByIdFromDb(gameId);
};

export const getPositionForRandomAttack = (game: Game, playerId: number) => {
  return db.getPositionForRandomAttackFromDb(game, playerId);
};
