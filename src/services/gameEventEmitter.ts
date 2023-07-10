import { EventEmitter } from 'node:events';
import { Player } from '../types/Player.js';
import * as Game from '../controllers/game.controller.js';

class GameEventEmitter extends EventEmitter {}
export const gameEventEmitter = new GameEventEmitter();

gameEventEmitter.on('reg', (ws, message) => {
  const player: Player = JSON.parse(message.data);
  const newPlayer = Game.addPlayer(player);
  Game.addActivePlayer(newPlayer, ws);
  ws.send(
    JSON.stringify({
      type: 'reg',
      data: JSON.stringify({
        name: player.name,
        index: newPlayer.id,
        error: false,
        errorText: '',
      }),
      id: 0,
    }),
  );
  gameEventEmitter.emit('update_room');
});

gameEventEmitter.on('create_room', (ws) => {
  const currentActivePlayer = Game.getActivePlayerByWs(ws);
  const newRoom = Game.addRoom();
  newRoom.roomUsers.push({
    name: currentActivePlayer?.player.name,
    index: currentActivePlayer?.player.id,
  });
  gameEventEmitter.emit('update_room');
});

gameEventEmitter.on('add_user_to_room', (ws, message) => {
  const data = JSON.parse(message.data);
  let room;
  const currentActivePlayer = Game.getActivePlayerByWs(ws);
  if (currentActivePlayer?.player) {
    room = Game.addPlayerToRoom(currentActivePlayer?.player, data.indexRoom);
  }
  gameEventEmitter.emit('update_room');
  if (room) {
    gameEventEmitter.emit('create_game', room?.roomUsers);
  }
});

gameEventEmitter.on('update_room', () => {
  const activePlayers = Game.getAllActivePlayers();
  const halfRooms = Game.getRoomsWithOnePlayerInside();
  activePlayers.forEach((activePlayer) => {
    activePlayer.ws.send(
      JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(halfRooms),
        id: 0,
      }),
    );
  });
});

gameEventEmitter.on('create_game', (roomUsers) => {
  const ids = roomUsers.map((element: { name?: string | undefined; index?: number | undefined }) => element.index);
  const activePlayers = Game.getActivePlayersByIds(ids);
  const newGame = Game.addGame();
  activePlayers.forEach((activePlayer) => {
    newGame.board.push({ player: activePlayer, ships: [] });
    activePlayer.ws.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
          idGame: newGame.id,
          idPlayer: activePlayer.player.id,
        }),
        id: 0,
      }),
    );
  });
});

gameEventEmitter.on('add_ships', (ws, message) => {
  const data = JSON.parse(message.data);
  const game = Game.addShipsToBoard(data.gameId, data.indexPlayer, data.ships);
  if (game?.board[0].ships.length && game?.board[1].ships.length) {
    game.board.forEach((element) => {
      element.player.ws.send(
        JSON.stringify({
          type: 'start_game',
          data: JSON.stringify({
            ships: element.ships,
            currentPlayerIndex: element.player.player.id,
          }),
          id: 0,
        }),
      );
      element.player.ws.send(
        JSON.stringify({
          type: 'turn',
          data: JSON.stringify({
            currentPlayer: element.player.player.id,
          }),
          id: 0,
        }),
      );
    });
  }
});

gameEventEmitter.on('close_connection', (ws) => {
  Game.removeActivePlayer(ws);
});
