export type HelpDestination =
  | 'duels'
  | 'practice'
  | 'remember'
  | 'count'
  | 'challenge-player'
  | 'sign-in'
  | 'save-progress'
  | 'close-tournaments'
  | 'toggle-daily-leaderboard'
  | 'play-daily-tournament'
  | 'register-tournament'
  | 'cancel-tournament-registration'
  | 'view-tournament-results';

export type HelpAction = {
  destination: HelpDestination;
  label: string;
  targetId?: string | null;
};

type BaseHelpContext = {
  playerType: 'guest' | 'registered';
  guestHasStartedPlaying: boolean;
  allowedActions: HelpAction[];
};

export type DuelsHelpState = {
  view: 'dashboard' | 'new-duel';
  dashboardLoading: boolean;
  hasInvitationLink: boolean;
  activeDuelCount: number;
  completedDuelCount: number;
  sentInvitationCount: number;
};

type HomeHelpContext = BaseHelpContext & {
  screen: 'home';
  practiceAvailable: boolean;
};

type DuelsHelpContext = BaseHelpContext & DuelsHelpState & {
  screen: 'duels';
};

export type TournamentHelpItem = {
  id: string;
  name: string;
  status: 'available' | 'registered' | 'full' | 'daily-limit-reached' | 'completed';
};

type TournamentsHelpContext = BaseHelpContext & {
  screen: 'tournaments';
  view: 'list' | 'daily-leaderboard' | 'tournament-results';
  loading: boolean;
  loadError: boolean;
  unlimited: boolean;
  remaining: number | null;
  tournaments: TournamentHelpItem[];
};

type FederationTableHelpContext = BaseHelpContext & {
  screen: 'federation-table';
  dealNumber: number;
  setupStage: 'contract' | 'openingLead' | 'play';
  cardControl: 'declarer' | 'openingLeader' | 'openingLeaderPartner' | 'all' | null;
};


export type AuthHelpContext = BaseHelpContext & {
  screen: 'auth';
  authStage: 'email' | 'code' | 'unavailable';
  authBusy: boolean;
  authUpgradingGuest: boolean;
  authMessage: string | null;
  authLabels: {
    title: string;
    google: string;
    email: string;
    code: string;
    sendCode: string;
    continue: string;
    differentEmail: string;
    back: string;
  };
};

export type HelpContext =
  | PageHelpContext
  | HomeHelpContext
  | DuelsHelpContext
  | TournamentsHelpContext
  | FederationTableHelpContext
  | AuthHelpContext;

export type HelpReply = {
  answer: string;
  action: HelpAction | null;
};

export function getHomeHelpActions({
  isGuest,
  guestHasStartedPlaying,
  practiceAvailable,
}: {
  isGuest: boolean;
  guestHasStartedPlaying: boolean;
  practiceAvailable: boolean;
}): HelpAction[] {
  const actions: HelpAction[] = [
    { destination: 'duels', label: 'CHALLENGE' },
    ...(practiceAvailable
      ? [{ destination: 'practice' as const, label: 'PRACTICE' }]
      : []),
    { destination: 'remember', label: 'REMEMBER' },
    { destination: 'count', label: 'COUNT' },
  ];

  if (isGuest) {
    actions.push({
      destination: guestHasStartedPlaying ? 'save-progress' : 'sign-in',
      label: guestHasStartedPlaying ? 'SAVE PROGRESS' : 'SIGN IN',
    });
  }

  return actions;
}

export function getDuelsHelpActions(
  state: DuelsHelpState
): HelpAction[] {
  return state.view === 'dashboard'
    ? [{ destination: 'challenge-player', label: 'NEW CHALLENGE' }]
    : [];
}

export const HELP_PAGES = [
  'tables', 'bridge-table', 'results', 'statistics', 'teaching',
  'teacher-application', 'remember', 'count', 'federation-selection',
  'challenge-invitation', 'challenge-results', 'public-content', 'username',
] as const;
export type HelpPage = typeof HELP_PAGES[number];
export type PageHelpState = Record<string, string | number | boolean | null>;
export type PageHelpControl = { label: string; kind: 'control' | 'field'; disabled: boolean; selected: boolean };
export type PageHelpSnapshot = { controls: PageHelpControl[]; headings: string[]; documentText?: string };
export type PageHelpContext = BaseHelpContext & PageHelpSnapshot & {
  screen: 'page';
  page: HelpPage;
  state: PageHelpState;
};
export function getPageHelpContext(
  page: HelpPage,
  isGuest = false,
  state: PageHelpState = {},
): PageHelpContext {
  return { screen: 'page', page, state, playerType: isGuest ? 'guest' : 'registered',
    guestHasStartedPlaying: false, allowedActions: [], controls: [], headings: [] };
}
