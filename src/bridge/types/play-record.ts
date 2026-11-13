import type { Card } from '@/lib/deck';
import type { Player } from './positions';

export type BridgeCall = {
  position: Player;
  call: string;
  sequence: number;
  explanation?: string;
  explanation_requested_at?: string;
  explanation_expires_at?: string;
};

export type BridgePlay = {
  position: Player;
  card: Card;
  sequence: number;
};

export type AcceptedBridgeClaim = {
  afterPlay: number;
  position: Player;
  side: 'declarer' | 'defense';
  requestedTricks: number;
  declarerTricks: number;
  defenseTricks: number;
};

export type DealPlayRecord = {
  version: 1;
  mode: 'just_declare' | 'bid_and_play';
  declarer: Player | null;
  openingLeader: Player | null;
  auction: BridgeCall[];
  plays: BridgePlay[];
  completion: 'played' | 'claim' | 'passed_out' | 'unknown';
  complete: boolean;
  claim?: AcceptedBridgeClaim;
};
