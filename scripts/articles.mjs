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
  { slug: 'splinter-responder', title: 'Splinter από τον απαντώντα', hands: 7, titles: {"en": "Splinter by responder", "fr": "Splinter du répondant", "de": "Splinter des Antwortenden", "it": "Splinter del rispondente", "es": "Splinter del respondedor", "pt": "Splinter do respondente", "nl": "Splinter van de antwoordende hand", "tr": "Cevapçının Splinter’ı", "sv": "Splinter av svarshanden", "da": "Splinter fra svarer", "no": "Splinter fra svarhånden", "fi": "Vastaajan Splinter", "pl": "Splinter odpowiadającego", "cs": "Splinter odpovídajícího", "hu": "A válaszoló Splintere", "is": "Splinter svarhandar", "zh": "应叫人的Splinter", "ja": "レスポンダーのSplinter", "he": "Splinter של המשיב", "hi": "उत्तरदाता का Splinter", "ru": "Сплинтер отвечающего", "id": "Splinter oleh penjawab", "ar": "Splinter للمجيب", "th": "Splinter โดยผู้ตอบ", "ko": "응답자의 Splinter"},
    exercisesText: '20 ασκήσεις: 10 απαντήσεις στο άνοιγμα και 10 συνέχειες του ανοίξαντος μετά από Splinter.' },
  { slug: 'splinter-opener', title: 'Splinter από τον ανοίξαντα', hands: 7, titles: {"th": "Splinter โดยผู้เปิด", "ar": "Splinter للمفتتح", "hi": "ओपनर का Splinter", "he": "Splinter של הפותח", "id": "Splinter oleh pembuka", "ko": "오프너의 Splinter", "ja": "オープナーのSplinter", "zh": "开叫人的Splinter", "ru": "Сплинтер открывающего", "is": "Splinter opnara", "hu": "Az induló Splintere", "cs": "Splinter zahajitele", "pl": "Splinter otwierającego", "tr": "Açıcının Splinter’ı", "fi": "Avaajan Splinter", "no": "Splinter fra åpner", "da": "Splinter fra åbner", "sv": "Splinter av öppningshanden", "nl": "Splinter van de openaar", "pt": "Splinter do abridor", "es": "Splinter del abridor", "it": "Splinter dell’apertore", "de": "Splinter des Eröffners", "fr": "Splinter de l’ouvreur", "en": "Splinter by opener"},
    exercisesText: '20 ασκήσεις: 10 επαναδηλώσεις ανοίξαντος και 10 συνέχειες μετά το Splinter του συμπαίκτη.' },
  { slug: 'jacoby-transfers', title: 'Transfer Jacoby μετά από 1ΝΤ', hands: 8, languages: ['el'],
    description: 'Δείξε το μαζέρ σου με Transfer Jacoby μετά από 1ΝΤ και διάλεξε τη συνέχεια της αγοράς.',
    exercisesText: '20 ασκήσεις: 10 απαντήσεις στο 1ΝΤ και 10 συνέχειες του απαντώντος μετά την αποδοχή του Transfer.' }
];
export const availableIn = (article, code) => !article.languages || article.languages.includes(code);
