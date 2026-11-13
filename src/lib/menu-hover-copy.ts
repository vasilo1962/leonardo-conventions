// The main menu uses common English copy, including its browser hover help.
export const MENU_HOVER_TEXT: Readonly<Record<string, string>> = {
  TOURNAMENTS: 'Play bridge tournaments and compare your results with other players.',
  TABLES: 'Join an open bridge table or create your own and invite other players.',
  CHALLENGE: 'Challenge another player to play the same deals and compare results.',
  RESULTS: 'View tournament and challenge results and player leaderboards.',
  STATISTICS: 'Track your played deals, progress and Leonardo Points.',
  PRACTICE: 'Practise at your own pace with Just Declare, Bid & Play, Count and Remember.',
  'PARTNERSHIP PRACTICE': 'Practise bidding and play with your partner at a shared table.',
  'TEACHING PLACE': 'Create teaching deals and tables, invite students and guide the lesson.',
  federation: 'Replay official Hellenic Bridge Federation tournament deals.',
  'ADD A DEAL': 'Adding your own deal for play and replay is coming soon.',
  '/how-leonardo-defends': 'Read how Leonardo defends and understand the robots’ defensive methods.',
  '/conventions': 'Explore bridge bidding conventions and their explanations.',
  '/how-it-works': 'Learn how Leonardo Bridge works and discover its ways to play.',
  '/privacy-policy': 'Read how Leonardo Bridge handles and protects your personal data.',
  '/terms-of-use': 'Read the terms for using Leonardo Bridge.',
};

export function getMenuHoverText(key: string): string | undefined {
  return MENU_HOVER_TEXT[key];
}

// React Native Web filters the title prop; set it on the rendered DOM node.
// Native hosts have no setAttribute, so their existing accessibility stays intact.
export function applyMenuHoverText(node: unknown, key: string): void {
  const message = getMenuHoverText(key);
  if (message && node && typeof node === 'object'
    && 'setAttribute' in node && typeof node.setAttribute === 'function') {
    node.setAttribute('title', message);
  }
}
