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
  const room = JSON.parse(message.data);
  const currentActivePlayer = Game.getActivePlayerByWs(ws);
  if (currentActivePlayer?.player) Game.addPlayerToRoom(currentActivePlayer?.player, room.indexRoom);

  gameEventEmitter.emit('update_room');
//   gameEventEmitter.emit('create_game');
});

gameEventEmitter.on('update_room', () => {
    const activePlayers = Game.getActivePlayers();
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
  
gameEventEmitter.on('close_connection', (ws) => {
  Game.removeActivePlayer(ws);
});
