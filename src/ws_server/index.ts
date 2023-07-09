import { WebSocketServer } from 'ws';
import { gameEventEmitter } from '../services/gameEventEmitter.js';
const WS_PORT = Number(process.env.WS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', function connection(ws) {
  console.log(wss.clients);
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const message = JSON.parse(data.toString());
    gameEventEmitter.emit(message.type, ws, message);
  });
});
