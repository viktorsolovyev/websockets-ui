import { Ship } from './Ship.js';

export type Cell = {
  x: number;
  y: number;
  ship?: Ship;
  attacked: boolean;
  status?: 'miss' | 'killed' | 'shot';
};
