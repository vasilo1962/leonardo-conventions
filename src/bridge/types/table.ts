import type { BridgeCall, BridgePlay } from './play-record';
import type { Card } from '@/lib/deck';
import type { Player, Vulnerability } from './positions';

export type OpenTableSeat = {
  position: Player;
  occupant_kind: 'human' | 'robot';
  user_id: string | null;
  username: string | null;
  reserved?: boolean;
  invitation_hold_id?: string;
  reserved_username?: string | null;
};

export type OpenTableInvitation = {
  position: OpenTableSeat['position'];
  token: string;
};

export type OpenTableCall = BridgeCall;

export type OpenTablePlay = BridgePlay;

export type OpenTableClaim = {
  id: string;
  side: 'declarer' | 'defense';
  requested_tricks: number;
  requester_position: OpenTableSeat['position'];
  requester_user_id: string;
  expires_at: string;
  required_user_ids?: string[];
  accepted_user_ids?: string[];
};

export type OpenTableScoreboardDeal = {
  hands?: Record<Player, Card[]> | null;
  deal_number: number;
  status: 'passed_out' | 'review';
  contract: string | null;
  contract_modifier: 'X' | 'XX' | null;
  declarer_position: OpenTableSeat['position'] | null;
  plays: OpenTablePlay[];
  claimed_declarer_tricks: number;
  claimed_defense_tricks: number;
  vulnerability?: Vulnerability;
};

export type PartnershipTableLive = {
  spectator?: boolean;
  allow_spectators?: boolean;
  spectator_chat?: boolean;
  spectator_requests?: {request_id: string; user_id: string; username: string}[];
  lesson_mode: 'bidding_only' | 'bid_and_play';
  robot_bidding: 'normal' | 'always_pass';
  paused: boolean;
  source: 'random' | 'constrained' | 'imported';
  total_deals: number | null;
  host: boolean;
  finished: boolean;
  can_continue: boolean;
};

export type TeachingTableLive = {
  lesson_mode?: 'bidding_only' | 'bid_and_play';
  error_indicators?: boolean;
  student_undo?: boolean;
  can_undo?: boolean;
  paused: boolean;
  teacher_observes: boolean;
  spectator?: boolean;
  allow_spectators?: boolean;
  spectator_chat?: boolean;
  spectator_requests?: {request_id: string; user_id: string; username: string}[];
  controlled_positions: Player[];
  robot_bidding: 'normal' | 'always_pass' | null;
  total_deals: number;
  clock_revision?: number;
  close_reason?: 'initial' | 'waiting' | 'teacher_absence';
  can_extend?: boolean;
  closes_at: string | null;
  server_now: string;
};

export type OpenTableUndoRequest = {
 id: string;
 requester_user_id: string;
 requester_name: string;
 required_user_ids: string[];
 accepted_user_ids: string[];
};
export type OpenTableDeal = {
 can_undo?: boolean;
 undo_revision?: number;
 undo_rewind?: number;
 undo_request?: OpenTableUndoRequest | null;
  teaching?: TeachingTableLive;
  partnership?: PartnershipTableLive;
  board_number?: number;
  teaching_revision?: number;
  teaching_rewind?: number;
  deal_id: string;
  deal_number: number;
  status: 'bidding' | 'playing' | 'passed_out' | 'review';
  dealer_position: OpenTableSeat['position'];
  current_bidder_position: OpenTableSeat['position'];
  player_position: OpenTableSeat['position'];
  waiting_for_position?: boolean;
  auction: OpenTableCall[];
  hands: Record<OpenTableSeat['position'], Card[]>;
  hand: Card[];
  contract?: string | null;
  contract_modifier?: 'X' | 'XX' | null;
  declarer_position?: OpenTableSeat['position'] | null;
  dummy_position?: OpenTableSeat['position'] | null;
  current_player_position?: OpenTableSeat['position'] | null;
  plays?: OpenTablePlay[];
  vulnerability?: Vulnerability;
  tournament_total_deals?: number;
  claim_attempts?: number;
  claimed_declarer_tricks?: number;
  claimed_defense_tricks?: number;
  claim?: OpenTableClaim | null;
  scoreboard_deals?: OpenTableScoreboardDeal[];
};

export type OpenTableTiming = {
  tableId: string;
  serverNow: string;
  clientReceivedAt: number;
  turnDeadline: {
    controller_user_id: string;
    deal_id: string;
    phase: 'initial' | 'extended';
    expires_at: string;
    turn_kind: 'bidding' | 'playing';
    sequence_number: number;
    undo_rewind: number;
  } | null;
  hostWaitExpiresAt: string | null;
};
