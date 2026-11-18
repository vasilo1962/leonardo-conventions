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
  { slug: 'jacoby-2nt', title: 'Jacoby 2NT', hands: 9, languages: ['el'], exercises: false,
    description: 'Ισχυρό φιτ στο μαζέρ, forcing μανς, με περιγραφή του χεριού και διερεύνηση σλεμ.' }
];
export const availableIn = (article, code) => !article.languages || article.languages.includes(code);
