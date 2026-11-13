export type Player =
  | 'West'
  | 'North'
  | 'East'
  | 'South';

export type Vulnerability =
  | 'None'
  | 'North–South'
  | 'East–West'
  | 'Both';

export type Position = Player;

export type OpenTablePosition = Player;
