// A lesson is linked only in languages whose translation is ready.
export const articles = [
  { slug: 'multi-landy', title: 'Multi Landy', hands: 8 },
  { slug: 'michaels-cue-bid', title: 'Michaels Cue Bid', hands: 5 },
  { slug: 'unusual-2nt', title: 'Unusual 2NT', hands: 5 },
  { slug: 'dont', title: 'DONT', hands: 7 },
  { slug: 'inverted-minors', title: 'Inverted Minors', hands: 7,
    exercisesText: 'Δοκίμασε την αρχική απάντηση και τη συνέχεια του ανοίξαντος με το δικό σου χέρι και το bidding box.' },
  { slug: 'bergen-raises', title: 'Bergen Raises', hands: 8,
    exercisesText: 'Δοκίμασε την αρχική απάντηση Bergen και τη συνέχεια του ανοίξαντος με το δικό σου χέρι και το bidding box.' },
  { slug: 'jacoby-2nt', title: 'Jacoby 2NT', hands: 9,
    exercisesText: 'Δοκίμασε την αρχική απάντηση Jacoby 2NT και την επαναδήλωση του ανοίξαντος με το δικό σου χέρι και το bidding box.' },
  { slug: 'drury', title: 'Drury — φιτ μετά από άνοιγμα 3ης ή 4ης θέσης', hands: 8,
    languages: ['el'], exerciseSets: [
      { href: 'practice/', title: 'Απλό Reverse Drury', text: '10 απαντήσεις στο άνοιγμα και 10 επαναδηλώσεις ανοίξαντος. Τα 2♣ δείχνουν προτασιακό χέρι με τουλάχιστον 3φυλλη υποστήριξη.' },
      { href: 'two-way/practice/', title: 'Two-way Drury', text: '10 απαντήσεις στο άνοιγμα και 10 επαναδηλώσεις ανοίξαντος. Τα 2♣ δείχνουν ακριβώς 3φυλλη και τα 2♦ τουλάχιστον 4φυλλη υποστήριξη, με προτασιακό χέρι.' }
    ],
    description: 'Reverse Drury και Two-way Drury: προτασιακό φιτ από πασαρισμένο παίκτη, επαναδηλώσεις και παραδείγματα.' }
];
export const availableIn = (article, code) => !article.languages || article.languages.includes(code);
