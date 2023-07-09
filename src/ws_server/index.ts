import { WebSocketServer } from 'ws';
const WS_PORT = Number(process.env.WS_PORT) || 3000;

export const wss = new WebSocketServer({ port: WS_PORT });
