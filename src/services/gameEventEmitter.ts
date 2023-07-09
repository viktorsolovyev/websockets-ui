import { EventEmitter } from 'node:events';
import { Player } from '../types/Player.js';
import * as Players from '../controllers/player.controller.js';

class GameEventEmitter extends EventEmitter {}
export const gameEventEmitter = new GameEventEmitter();

gameEventEmitter.on('reg', (ws, message) => {
  const player: Player = JSON.parse(message.data);
  const playerIndex = Players.addPlayer(player);
  Players.addPlayerToActive(playerIndex, ws);

  ws.send(
    JSON.stringify({
      type: 'reg',
      data: JSON.stringify({
        name: player.name,
        index: playerIndex,
        error: false,
        errorText: '',
      }),
      id: 0,
    }),
  );
});
