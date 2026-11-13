export const MIN_POINTS = 0;
export const MAX_POINTS = 37;

export const SUITS = [
  '♠',
  '♥',
  '♦',
  '♣',
] as const;

export const RANKS = [
  { rank: 'A', points: 4 },
  { rank: 'K', points: 3 },
  { rank: 'Q', points: 2 },
  { rank: 'J', points: 1 },
  { rank: '10', points: 0 },
  { rank: '9', points: 0 },
  { rank: '8', points: 0 },
  { rank: '7', points: 0 },
  { rank: '6', points: 0 },
  { rank: '5', points: 0 },
  { rank: '4', points: 0 },
  { rank: '3', points: 0 },
  { rank: '2', points: 0 },
] as const;

export type Suit =
  (typeof SUITS)[number];

export type Card = {
  suit: Suit;
  rank: string;
  points: number;
};

export type Deal = {
  North: Card[];
  East: Card[];
  South: Card[];
  West: Card[];
};

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    RANKS.map(({ rank, points }) => ({
      suit,
      rank,
      points,
    }))
  );
}

export function shuffleDeck(
  cards: Card[]
): Card[] {
  const shuffledCards = [...cards];

  for (
    let index =
      shuffledCards.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      shuffledCards[index],
      shuffledCards[randomIndex],
    ] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
}

function getSuitOrder(
  trumpSuit: Suit | null
): Suit[] {
  if (trumpSuit === '♥') {
    return ['♥', '♠', '♦', '♣'];
  }

  if (trumpSuit === '♦') {
    return ['♦', '♠', '♥', '♣'];
  }

  if (trumpSuit === '♣') {
    return ['♣', '♥', '♠', '♦'];
  }

  return ['♠', '♥', '♣', '♦'];
}

function getRankOrder(
  rank: string
): number {
  return RANKS.findIndex(
    (item) =>
      item.rank === rank
  );
}

export function sortHand(
  hand: Card[],
  trumpSuit: Suit | null = null
): Card[] {
  const suitOrder =
    getSuitOrder(trumpSuit);

  return [...hand].sort(
    (cardA, cardB) => {
      const suitDifference =
        suitOrder.indexOf(cardA.suit) -
        suitOrder.indexOf(cardB.suit);

      if (suitDifference !== 0) {
        return suitDifference;
      }

      return (
        getRankOrder(cardA.rank) -
        getRankOrder(cardB.rank)
      );
    }
  );
}

export function createRandomHand(): Card[] {
  const hand = shuffleDeck(
    createDeck()
  ).slice(0, 13);

  return sortHand(hand);
}

export function calculatePoints(
  hand: Card[]
): number {
  return hand.reduce(
    (total, card) =>
      total + card.points,
    0
  );
}

export function createAnswerOptions(
  correctAnswer: number
): number[] {
  const possibleGroups = [
    [
      correctAnswer,
      correctAnswer + 1,
      correctAnswer + 2,
      correctAnswer + 3,
    ],
    [
      correctAnswer - 1,
      correctAnswer,
      correctAnswer + 1,
      correctAnswer + 2,
    ],
    [
      correctAnswer - 2,
      correctAnswer - 1,
      correctAnswer,
      correctAnswer + 1,
    ],
    [
      correctAnswer - 3,
      correctAnswer - 2,
      correctAnswer - 1,
      correctAnswer,
    ],
  ];

  const validGroups =
    possibleGroups.filter((group) =>
      group.every(
        (answer) =>
          answer >= MIN_POINTS &&
          answer <= MAX_POINTS
      )
    );

  const randomIndex = Math.floor(
    Math.random() *
      validGroups.length
  );

  return validGroups[randomIndex];
}

export function groupHandBySuit(
  hand: Card[]
) {
  return SUITS.map((suit) => ({
    suit,
    cards: hand
      .filter(
        (card) =>
          card.suit === suit
      )
      .sort(
        (cardA, cardB) =>
          getRankOrder(cardA.rank) -
          getRankOrder(cardB.rank)
      ),
  }));
}