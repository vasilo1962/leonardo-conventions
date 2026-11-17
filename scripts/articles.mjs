// A lesson is linked only in languages whose translation is ready.
export const articles = [
  { slug: 'multi-landy', title: 'Multi Landy', hands: 8 },
  { slug: 'michaels-cue-bid', title: 'Michaels Cue Bid', hands: 5 },
  { slug: 'unusual-2nt', title: 'Unusual 2NT', hands: 5 },
  { slug: 'dont', title: 'DONT', hands: 7 },
  { slug: 'inverted-minors', title: 'Inverted Minors', hands: 7,
    exercisesText: 'Δοκίμασε την αρχική απάντηση και τη συνέχεια του ανοίξαντος με το δικό σου χέρι και το bidding box.' }
];
export const availableIn = (article, code) => !article.languages || article.languages.includes(code);
