import { WebSocket } from 'ws';
import { Cell } from '../types/Cell.js';
import { Player, activePlayer, Room, Ship, Game, Attack } from '../types/index.js';
import { arrayRandElement } from '../utils/utils.js';

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
    currentTurnIndexPlayer: arrayRandElement([0, 1]),
  };
  games.push(newGame);
  return newGame;
};

export const getGameByIdFromDb = (gameId: number): Game | undefined => {
  return games.find((element) => element.id === gameId);
};

export const addShipsToBoardToDb = (gameId: number, playerId: number, ships: Ship[]): Game | undefined => {
  const game = games.find((element) => element.id === gameId);
  const boardItem = game?.board.find((element) => element.player.player.id === playerId);
  if (boardItem) {
    ships.forEach((item) => {
      item.health = item.length; // getHealthShipByType(item.type);
    });
    boardItem.ships = ships;
    boardItem.ownField = createGameField(boardItem.ships);
    boardItem.enemyField = createGameField();
  }
  return game;
};

export const setAttackToDb = (
  game: Game,
  playerId: number,
  x: number,
  y: number,
): { attackStatus: string; attacks: Attack[]; isFinish: boolean; winPlayer?: number } => {
  let attackStatus = '';
  const attacks = [] as Attack[];
  let isFinish = false;

  const ownBoardItem = game?.board.find((element) => element.player.player.id === playerId);
  const enemyBoardItem = game?.board.find((element) => element.player.player.id !== playerId);
  if (ownBoardItem && enemyBoardItem) {
    const enemyCell = getCellFromField(enemyBoardItem.ownField, x, y);
    const ownCell = getCellFromField(ownBoardItem.enemyField, x, y);
    if (enemyCell && ownCell) {
      attackStatus = enemyCell && enemyCell.ship ? 'shot' : 'miss';
      ownCell.attacked = true;
      ownCell.status = enemyCell.ship ? 'shot' : 'miss';
      enemyCell.attacked = true;
      enemyCell.status = enemyCell.ship ? 'shot' : 'miss';

      if (enemyCell.ship) {
        enemyCell.ship.health -= 1;
        if (enemyCell.ship.health === 0) {
          const liveShips = enemyBoardItem.ownField.filter((cell) => {
            return cell.ship && cell.ship.health > 0;
          });
          if (!liveShips.length) {
            isFinish = true;
          }
          attackStatus = 'killed';
          const startX = enemyCell.ship.position.x - 1 < 0 ? 0 : enemyCell.ship.position.x - 1;
          let endX = -1;
          const startY = enemyCell.ship.position.y - 1 < 0 ? 0 : enemyCell.ship.position.y - 1;
          let endY = -1;
          if (enemyCell.ship.direction) {
            endX = enemyCell.ship.position.x + 1 > 9 ? 9 : enemyCell.ship.position.x + 1;
            endY =
              enemyCell.ship.position.y + enemyCell.ship.length > 9
                ? 9
                : enemyCell.ship.position.y + enemyCell.ship.length;
          } else {
            endX =
              enemyCell.ship.position.x + enemyCell.ship.length > 9
                ? 9
                : enemyCell.ship.position.x + enemyCell.ship.length;
            endY = enemyCell.ship.position.y + 1 > 9 ? 9 : enemyCell.ship.position.y + 1;
          }

          for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
              const currentEnemyCell = getCellFromField(enemyBoardItem.ownField, i, j);
              const currentOwnCell = getCellFromField(ownBoardItem.enemyField, i, j);
              if (currentOwnCell && currentEnemyCell && currentEnemyCell.ship === undefined) {
                currentOwnCell.attacked = true;
                currentOwnCell.status = 'miss';
                currentEnemyCell.attacked = true;
                currentEnemyCell.status = 'miss';
                attacks.push({ status: 'miss', x: i, y: j });
              }
            }
          }
        }
      }

      attacks.push({ status: attackStatus, x, y });
    }
  }
  return { attackStatus: attackStatus, attacks: attacks, isFinish: isFinish, winPlayer: (isFinish ? playerId: undefined)};
};

const createGameField = (ships?: Ship[]): Cell[] => {
  const gameField = [];

  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x <= 9; x++) {
      let ship = undefined;

      if (ships) {
        ship = getShipByCoords(ships, x, y);
      }
      const cell = {
        x: x,
        y: y,
        ship: ship,
        attacked: false,
      };

      gameField.push(cell);
    }
  }
  return gameField;
};

const getShipByCoords = (ships: Ship[], x: number, y: number): Ship | undefined => {
  const ship = ships.find((item) => {
    return item.direction
      ? item.position.x === x && y >= item.position.y && y <= item.position.y + item.length - 1
      : item.position.y === y && x >= item.position.x && x <= item.position.x + item.length - 1;
  });
  return ship;
};

const getCellFromField = (field: Cell[], x: number, y: number): Cell | undefined => {
  const cell = field.find((item) => {
    return item.x === x && item.y === y;
  });
  return cell;
};

export const getPositionForRandomAttackFromDb = (game: Game, playerId: number): { x: number; y: number } => {
  const result = { x: 0, y: 0 };
  const ownBoardItem = game?.board.find((element) => element.player.player.id === playerId);
  if (ownBoardItem) {
    const freeCells = ownBoardItem.enemyField.filter((cell) => !cell.attacked);
    const randomCell = arrayRandElement(freeCells);
    result.x = randomCell.x;
    result.y = randomCell.y;
  }
  return { x: result.x, y: result.y };
};
