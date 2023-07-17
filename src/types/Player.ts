import { WebSocket } from 'ws';

export type Player = {
  id?: number;
  name: string;
  password: string;
};

export type activePlayer = {
  player: Player;
  ws: WebSocket;
};
