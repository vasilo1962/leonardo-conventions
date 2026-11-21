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
  { slug: 'drury', title: 'Reverse Drury', hands: 6,
    exercisesText: '20 ασκήσεις Reverse Drury: 10 απαντήσεις στο άνοιγμα και 10 επαναδηλώσεις ανοίξαντος.' },
  { slug: 'two-way-drury', title: 'Two-way Drury', hands: 6,
    exercisesText: '20 ασκήσεις Two-way Drury: 10 απαντήσεις στο άνοιγμα και 10 επαναδηλώσεις ανοίξαντος.' },
  { slug: 'splinter-responder', title: 'Splinter από τον απαντώντα', hands: 7, languages: ['el'],
    exercisesText: '20 ασκήσεις: 10 απαντήσεις στο άνοιγμα και 10 συνέχειες του ανοίξαντος μετά από Splinter.' }
];
export const availableIn = (article, code) => !article.languages || article.languages.includes(code);
