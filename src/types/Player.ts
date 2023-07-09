import { WebSocket } from 'ws';

export type Player = {
  name: string;
  password: string;
};

export type activePlayer = {
  playerIndex: number;
  ws: WebSocket;
};
