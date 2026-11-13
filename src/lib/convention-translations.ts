import type { InfoLanguage } from '@/lib/info-popup-translations';

export const CONVENTION_LANGUAGE_NAMES: Record<InfoLanguage, string> = {
  "en": "ENGLISH",
  "fr": "FRANÇAIS",
  "nl": "NEDERLANDS",
  "zh": "中文",
  "it": "ITALIANO",
  "de": "DEUTSCH",
  "sv": "SVENSKA",
  "da": "DANSK",
  "no": "NORSK",
  "pl": "POLSKI",
  "ja": "日本語",
  "he": "עברית",
  "es": "ESPAÑOL",
  "pt": "PORTUGUÊS",
  "hi": "हिन्दी",
  "tr": "TÜRKÇE",
  "ru": "РУССКИЙ",
  "el": "ΕΛΛΗΝΙΚΑ",
  "fi": "SUOMI",
  "cs": "ČEŠTINA",
  "is": "ÍSLENSKA",
  "hu": "MAGYAR",
  "id": "BAHASA INDONESIA",
  "ar": "العربية",
  "th": "ไทย",
  "ko": "한국어"
};
const ui: Record<InfoLanguage, { conventions: string; intro: string; selectLanguage: string }> = {
  "en": {
    "conventions": "Conventions",
    "intro": "The conventions and bidding agreements used by the creator of Leonardo Bridge with her partner.",
    "selectLanguage": "Choose language"
  },
  "fr": {
    "conventions": "Conventions",
    "intro": "Les conventions et accords d’enchères utilisés par la créatrice de Leonardo Bridge avec sa partenaire.",
    "selectLanguage": "Choisir la langue"
  },
  "nl": {
    "conventions": "Conventies",
    "intro": "De conventies en biedafspraken die de maakster van Leonardo Bridge met haar partner gebruikt.",
    "selectLanguage": "Taal kiezen"
  },
  "zh": {
    "conventions": "约定叫",
    "intro": "Leonardo Bridge 女创作者与她的女搭档使用的约定叫和叫牌协议。",
    "selectLanguage": "选择语言"
  },
  "it": {
    "conventions": "Convenzioni",
    "intro": "Le convenzioni e gli accordi dichiarativi usati dalla creatrice di Leonardo Bridge con la sua compagna.",
    "selectLanguage": "Scegli la lingua"
  },
  "de": {
    "conventions": "Konventionen",
    "intro": "Die Konventionen und Bietvereinbarungen, die die Schöpferin von Leonardo Bridge mit ihrer Partnerin verwendet.",
    "selectLanguage": "Sprache wählen"
  },
  "sv": {
    "conventions": "Konventioner",
    "intro": "Konventionerna och budöverenskommelserna som skaparen av Leonardo Bridge använder med sin kvinnliga partner.",
    "selectLanguage": "Välj språk"
  },
  "da": {
    "conventions": "Konventioner",
    "intro": "Konventionerne og meldeaftalerne, som skaberen af Leonardo Bridge bruger med sin kvindelige makker.",
    "selectLanguage": "Vælg sprog"
  },
  "no": {
    "conventions": "Konvensjoner",
    "intro": "Konvensjonene og meldeavtalene som skaperen av Leonardo Bridge bruker med sin kvinnelige makker.",
    "selectLanguage": "Velg språk"
  },
  "pl": {
    "conventions": "Konwencje",
    "intro": "Konwencje i ustalenia licytacyjne stosowane przez twórczynię Leonardo Bridge z jej partnerką.",
    "selectLanguage": "Wybierz język"
  },
  "ja": {
    "conventions": "コンベンション",
    "intro": "Leonardo Bridgeの女性制作者が女性パートナーと使用するコンベンションとビッドの取り決め。",
    "selectLanguage": "言語を選択"
  },
  "he": {
    "conventions": "קונבנציות",
    "intro": "הקונבנציות והסכמי ההכרזה שבהם משתמשת יוצרת Leonardo Bridge עם שותפתה.",
    "selectLanguage": "בחירת שפה"
  },
  "es": {
    "conventions": "Convenciones",
    "intro": "Las convenciones y acuerdos de subasta que utiliza la creadora de Leonardo Bridge con su compañera.",
    "selectLanguage": "Elegir idioma"
  },
  "pt": {
    "conventions": "Convenções",
    "intro": "As convenções e os acordos de leilão usados pela criadora do Leonardo Bridge com a sua parceira.",
    "selectLanguage": "Escolher idioma"
  },
  "hi": {
    "conventions": "कन्वेंशन",
    "intro": "Leonardo Bridge की महिला रचनाकार और उनकी महिला पार्टनर द्वारा इस्तेमाल किए जाने वाले कन्वेंशन और बिडिंग समझौते।",
    "selectLanguage": "भाषा चुनें"
  },
  "tr": {
    "conventions": "Konvansiyonlar",
    "intro": "Leonardo Bridge’in kadın yaratıcısının kadın ortağıyla kullandığı konvansiyonlar ve artırma anlaşmaları.",
    "selectLanguage": "Dil seçin"
  },
  "ru": {
    "conventions": "Конвенции",
    "intro": "Конвенции и договорённости о торговле, которые создательница Leonardo Bridge использует со своей партнёршей.",
    "selectLanguage": "Выбрать язык"
  },
  "el": {
    "conventions": "Συμβάσεις",
    "intro": "Οι συμβάσεις και οι συμφωνίες αγοράς που χρησιμοποιεί η δημιουργός του Leonardo Bridge με την παρτενέρ της.",
    "selectLanguage": "Επιλογή γλώσσας"
  },
  "fi": {
    "conventions": "Konventiot",
    "intro": "Konventiot ja tarjousjärjestelyt, joita Leonardo Bridgen luoja käyttää naispuolisen parinsa kanssa.",
    "selectLanguage": "Valitse kieli"
  },
  "cs": {
    "conventions": "Konvence",
    "intro": "Konvence a dražební dohody, které používá tvůrkyně Leonardo Bridge se svou partnerkou.",
    "selectLanguage": "Vybrat jazyk"
  },
  "is": {
    "conventions": "Sagnvenjur",
    "intro": "Sagnvenjurnar og samkomulagið um sagnir sem höfundur Leonardo Bridge notar með kvenkyns makker sínum.",
    "selectLanguage": "Veldu tungumál"
  },
  "hu": {
    "conventions": "Konvenciók",
    "intro": "A Leonardo Bridge alkotója és női partnere által használt konvenciók és licitmegállapodások.",
    "selectLanguage": "Nyelv választása"
  },
  "id": {
    "conventions": "Konvensi",
    "intro": "Konvensi dan kesepakatan penawaran yang digunakan oleh pencipta perempuan Leonardo Bridge bersama partner perempuannya.",
    "selectLanguage": "Pilih bahasa"
  },
  "ar": {
    "conventions": "الاصطلاحات",
    "intro": "الاصطلاحات واتفاقات المزايدة التي تستخدمها مُنشئة Leonardo Bridge مع شريكتها.",
    "selectLanguage": "اختيار اللغة"
  },
  "th": {
    "conventions": "คอนเวนชัน",
    "intro": "คอนเวนชันและข้อตกลงในการประมูลที่ผู้สร้างหญิงของ Leonardo Bridge ใช้กับคู่เล่นหญิงของเธอ",
    "selectLanguage": "เลือกภาษา"
  },
  "ko": {
    "conventions": "컨벤션",
    "intro": "Leonardo Bridge의 여성 제작자가 여성 파트너와 사용하는 컨벤션과 비딩 약속.",
    "selectLanguage": "언어 선택"
  }
};
const vocabulary: Record<InfoLanguage, Record<'natural' | 'weak' | 'balanced' | 'unbalanced' | 'stopper' | 'noStopper' | 'singleton' | 'and' | 'or' | 'cards' | 'otherMajor' | 'otherTwo' | 'forcedBid' | 'superAcceptance' | 'transferSuit', string>> = {
  "en": {
    "natural": "natural",
    "weak": "weak",
    "balanced": "balanced hand",
    "unbalanced": "unbalanced hand",
    "stopper": "stopper",
    "noStopper": "no stopper",
    "singleton": "singleton",
    "and": "and",
    "or": "or",
    "cards": "{n} cards in {s}",
    "otherMajor": "the other major",
    "otherTwo": "the other two suits",
    "forcedBid": "forced bid",
    "superAcceptance": "Super Acceptance",
    "transferSuit": "the transfer suit"
  },
  "fr": {
    "natural": "naturel",
    "weak": "faible",
    "balanced": "main régulière",
    "unbalanced": "main irrégulière",
    "stopper": "arrêt",
    "noStopper": "pas d’arrêt",
    "singleton": "singleton",
    "and": "et",
    "or": "ou",
    "cards": "{n} cartes à {s}",
    "otherMajor": "l’autre majeure",
    "otherTwo": "les deux autres couleurs",
    "forcedBid": "enchère obligatoire",
    "superAcceptance": "Super-acceptation",
    "transferSuit": "la couleur du transfert"
  },
  "nl": {
    "natural": "natuurlijk",
    "weak": "zwak",
    "balanced": "gebalanceerde hand",
    "unbalanced": "ongebalanceerde hand",
    "stopper": "stopper",
    "noStopper": "geen stopper",
    "singleton": "singleton",
    "and": "en",
    "or": "of",
    "cards": "{n} kaarten in {s}",
    "otherMajor": "de andere hoge kleur",
    "otherTwo": "de andere twee kleuren",
    "forcedBid": "verplicht bod",
    "superAcceptance": "Superacceptatie",
    "transferSuit": "de transferkleur"
  },
  "zh": {
    "natural": "自然叫",
    "weak": "弱牌",
    "balanced": "均型牌",
    "unbalanced": "非均型牌",
    "stopper": "止张",
    "noStopper": "没有止张",
    "singleton": "单张",
    "and": "和",
    "or": "或",
    "cards": "{s}有{n}张",
    "otherMajor": "另一高花",
    "otherTwo": "另外两门花色",
    "forcedBid": "强制叫牌",
    "superAcceptance": "超接受",
    "transferSuit": "转移花色"
  },
  "it": {
    "natural": "naturale",
    "weak": "debole",
    "balanced": "mano bilanciata",
    "unbalanced": "mano sbilanciata",
    "stopper": "fermo",
    "noStopper": "nessun fermo",
    "singleton": "singolo",
    "and": "e",
    "or": "o",
    "cards": "{n} carte a {s}",
    "otherMajor": "l’altro maggiore",
    "otherTwo": "gli altri due colori",
    "forcedBid": "dichiarazione obbligata",
    "superAcceptance": "Superaccettazione",
    "transferSuit": "il colore del transfer"
  },
  "de": {
    "natural": "natürlich",
    "weak": "schwach",
    "balanced": "ausgeglichene Hand",
    "unbalanced": "unausgeglichene Hand",
    "stopper": "Stopper",
    "noStopper": "kein Stopper",
    "singleton": "Singleton",
    "and": "und",
    "or": "oder",
    "cards": "{n} Karten in {s}",
    "otherMajor": "die andere Oberfarbe",
    "otherTwo": "die anderen beiden Farben",
    "forcedBid": "Pflichtgebot",
    "superAcceptance": "Superakzeptanz",
    "transferSuit": "die Transferfarbe"
  },
  "sv": {
    "natural": "naturligt",
    "weak": "svagt",
    "balanced": "balanserad hand",
    "unbalanced": "obalanserad hand",
    "stopper": "håll",
    "noStopper": "inget håll",
    "singleton": "singelton",
    "and": "och",
    "or": "eller",
    "cards": "{n} kort i {s}",
    "otherMajor": "den andra högfärgen",
    "otherTwo": "de två andra färgerna",
    "forcedBid": "obligatoriskt bud",
    "superAcceptance": "Superaccept",
    "transferSuit": "överföringsfärgen"
  },
  "da": {
    "natural": "naturlig",
    "weak": "svag",
    "balanced": "balanceret hånd",
    "unbalanced": "ubalanceret hånd",
    "stopper": "hold",
    "noStopper": "intet hold",
    "singleton": "singleton",
    "and": "og",
    "or": "eller",
    "cards": "{n} kort i {s}",
    "otherMajor": "den anden major",
    "otherTwo": "de to andre farver",
    "forcedBid": "tvungen melding",
    "superAcceptance": "Superaccept",
    "transferSuit": "transferfarven"
  },
  "no": {
    "natural": "naturlig",
    "weak": "svak",
    "balanced": "balansert hånd",
    "unbalanced": "ubalansert hånd",
    "stopper": "hold",
    "noStopper": "intet hold",
    "singleton": "singleton",
    "and": "og",
    "or": "eller",
    "cards": "{n} kort i {s}",
    "otherMajor": "den andre majoren",
    "otherTwo": "de to andre fargene",
    "forcedBid": "tvunget bud",
    "superAcceptance": "Superaksept",
    "transferSuit": "overføringsfargen"
  },
  "pl": {
    "natural": "naturalne",
    "weak": "słabe",
    "balanced": "ręka zrównoważona",
    "unbalanced": "ręka niezrównoważona",
    "stopper": "zatrzymanie",
    "noStopper": "bez zatrzymania",
    "singleton": "singleton",
    "and": "i",
    "or": "lub",
    "cards": "{n} kart w {s}",
    "otherMajor": "drugi starszy kolor",
    "otherTwo": "dwa pozostałe kolory",
    "forcedBid": "obowiązkowa odzywka",
    "superAcceptance": "Superakcept",
    "transferSuit": "kolor transferu"
  },
  "ja": {
    "natural": "ナチュラル",
    "weak": "弱い",
    "balanced": "バランスハンド",
    "unbalanced": "アンバランスハンド",
    "stopper": "ストッパー",
    "noStopper": "ストッパーなし",
    "singleton": "シングルトン",
    "and": "と",
    "or": "または",
    "cards": "{s}が{n}枚",
    "otherMajor": "もう一方のメジャー",
    "otherTwo": "残りの2スート",
    "forcedBid": "必須のビッド",
    "superAcceptance": "スーパーアクセプト",
    "transferSuit": "トランスファーのスート"
  },
  "he": {
    "natural": "טבעי",
    "weak": "חלש",
    "balanced": "יד מאוזנת",
    "unbalanced": "יד לא מאוזנת",
    "stopper": "עוצר",
    "noStopper": "אין עוצר",
    "singleton": "סינגלטון",
    "and": "ו",
    "or": "או",
    "cards": "{n} קלפים ב־{s}",
    "otherMajor": "המייג׳ור השני",
    "otherTwo": "שתי הסדרות האחרות",
    "forcedBid": "הכרזה מחויבת",
    "superAcceptance": "קבלת־יתר",
    "transferSuit": "סדרת ההעברה"
  },
  "es": {
    "natural": "natural",
    "weak": "débil",
    "balanced": "mano equilibrada",
    "unbalanced": "mano desequilibrada",
    "stopper": "parada",
    "noStopper": "sin parada",
    "singleton": "singleton",
    "and": "y",
    "or": "o",
    "cards": "{n} cartas en {s}",
    "otherMajor": "el otro mayor",
    "otherTwo": "los otros dos palos",
    "forcedBid": "subasta obligatoria",
    "superAcceptance": "Superaceptación",
    "transferSuit": "el palo del transfer"
  },
  "pt": {
    "natural": "natural",
    "weak": "fraco",
    "balanced": "mão equilibrada",
    "unbalanced": "mão desequilibrada",
    "stopper": "parada",
    "noStopper": "sem parada",
    "singleton": "singleton",
    "and": "e",
    "or": "ou",
    "cards": "{n} cartas em {s}",
    "otherMajor": "o outro maior",
    "otherTwo": "os outros dois naipes",
    "forcedBid": "lance obrigatório",
    "superAcceptance": "Superaceitação",
    "transferSuit": "o naipe do transfer"
  },
  "hi": {
    "natural": "नैचुरल",
    "weak": "कमज़ोर",
    "balanced": "संतुलित हाथ",
    "unbalanced": "असंतुलित हाथ",
    "stopper": "स्टॉपर",
    "noStopper": "स्टॉपर नहीं",
    "singleton": "सिंगलटन",
    "and": "और",
    "or": "या",
    "cards": "{s} में {n} पत्ते",
    "otherMajor": "दूसरा मेजर",
    "otherTwo": "दूसरे दो सूट",
    "forcedBid": "अनिवार्य बिड",
    "superAcceptance": "सुपर-स्वीकृति",
    "transferSuit": "ट्रांसफ़र का सूट"
  },
  "tr": {
    "natural": "natürel",
    "weak": "zayıf",
    "balanced": "dengeli el",
    "unbalanced": "dengesiz el",
    "stopper": "keser",
    "noStopper": "keser yok",
    "singleton": "tekli",
    "and": "ve",
    "or": "veya",
    "cards": "{s} renginde {n} kart",
    "otherMajor": "diğer majör",
    "otherTwo": "diğer iki renk",
    "forcedBid": "zorunlu konuşma",
    "superAcceptance": "Süper Kabul",
    "transferSuit": "transferin rengi"
  },
  "ru": {
    "natural": "натурально",
    "weak": "слабо",
    "balanced": "регулярная рука",
    "unbalanced": "нерегулярная рука",
    "stopper": "задержка",
    "noStopper": "нет задержки",
    "singleton": "синглет",
    "and": "и",
    "or": "или",
    "cards": "{n} карты в {s}",
    "otherMajor": "другой мажор",
    "otherTwo": "две другие масти",
    "forcedBid": "обязательная заявка",
    "superAcceptance": "Суперпринятие",
    "transferSuit": "масть трансфера"
  },
  "el": {
    "natural": "φυσική αγορά",
    "weak": "αδύνατο χέρι",
    "balanced": "ομαλή κατανομή",
    "unbalanced": "ανώμαλη κατανομή",
    "stopper": "κράτημα",
    "noStopper": "χωρίς κράτημα",
    "singleton": "μονόφυλλο",
    "and": "και",
    "or": "ή",
    "cards": "{n} φύλλα στο {s}",
    "otherMajor": "το άλλο μαζέρ",
    "otherTwo": "τα άλλα δύο χρώματα",
    "forcedBid": "υποχρεωτική αγορά",
    "superAcceptance": "υπεραποδοχή",
    "transferSuit": "το χρώμα του transfer"
  },
  "fi": {
    "natural": "luonnollinen",
    "weak": "heikko",
    "balanced": "tasainen käsi",
    "unbalanced": "epätasainen käsi",
    "stopper": "pito",
    "noStopper": "ei pitoa",
    "singleton": "singelton",
    "and": "ja",
    "or": "tai",
    "cards": "{n} korttia värissä {s}",
    "otherMajor": "toinen yläväri",
    "otherTwo": "kaksi muuta väriä",
    "forcedBid": "pakollinen tarjous",
    "superAcceptance": "Superhyväksyntä",
    "transferSuit": "siirtotarjouksen väri"
  },
  "cs": {
    "natural": "přirozené",
    "weak": "slabé",
    "balanced": "pravidelný list",
    "unbalanced": "nepravidelný list",
    "stopper": "zádrž",
    "noStopper": "bez zádrže",
    "singleton": "singleton",
    "and": "a",
    "or": "nebo",
    "cards": "{n} karet v {s}",
    "otherMajor": "druhá drahá barva",
    "otherTwo": "další dvě barvy",
    "forcedBid": "povinná nabídka",
    "superAcceptance": "Superpřijetí",
    "transferSuit": "barva transferu"
  },
  "is": {
    "natural": "eðlilegt",
    "weak": "veikt",
    "balanced": "jöfn hönd",
    "unbalanced": "ójöfn hönd",
    "stopper": "fyrirstaða",
    "noStopper": "engin fyrirstaða",
    "singleton": "einspil",
    "and": "og",
    "or": "eða",
    "cards": "{n} spil í {s}",
    "otherMajor": "hinn háliturinn",
    "otherTwo": "hinir tveir litirnir",
    "forcedBid": "skyldusögn",
    "superAcceptance": "Ofursamþykki",
    "transferSuit": "yfirfærsluliturinn"
  },
  "hu": {
    "natural": "természetes",
    "weak": "gyenge",
    "balanced": "egyenletes kéz",
    "unbalanced": "egyenetlen kéz",
    "stopper": "fogás",
    "noStopper": "nincs fogás",
    "singleton": "szingli",
    "and": "és",
    "or": "vagy",
    "cards": "{n} lap {s}-ben",
    "otherMajor": "a másik nemes szín",
    "otherTwo": "a másik két szín",
    "forcedBid": "kötelező licit",
    "superAcceptance": "Szuperelfogadás",
    "transferSuit": "a transzfer színe"
  },
  "id": {
    "natural": "natural",
    "weak": "lemah",
    "balanced": "tangan seimbang",
    "unbalanced": "tangan tidak seimbang",
    "stopper": "penahan",
    "noStopper": "tanpa penahan",
    "singleton": "singleton",
    "and": "dan",
    "or": "atau",
    "cards": "{n} kartu pada {s}",
    "otherMajor": "mayor lainnya",
    "otherTwo": "dua warna lainnya",
    "forcedBid": "penawaran wajib",
    "superAcceptance": "Penerimaan Super",
    "transferSuit": "warna transfer"
  },
  "ar": {
    "natural": "طبيعي",
    "weak": "ضعيف",
    "balanced": "يد متوازنة",
    "unbalanced": "يد غير متوازنة",
    "stopper": "إيقاف",
    "noStopper": "لا يوجد إيقاف",
    "singleton": "ورقة منفردة",
    "and": "و",
    "or": "أو",
    "cards": "{n} ورقات في {s}",
    "otherMajor": "اللون الكبير الآخر",
    "otherTwo": "اللونان الآخران",
    "forcedBid": "إعلان إجباري",
    "superAcceptance": "قبول فائق",
    "transferSuit": "لون التحويل"
  },
  "th": {
    "natural": "เป็นธรรมชาติ",
    "weak": "อ่อน",
    "balanced": "มือสมดุล",
    "unbalanced": "มือไม่สมดุล",
    "stopper": "ตัวหยุด",
    "noStopper": "ไม่มีตัวหยุด",
    "singleton": "ซิงเกิลตัน",
    "and": "และ",
    "or": "หรือ",
    "cards": "{s} จำนวน {n} ใบ",
    "otherMajor": "เมเจอร์อีกดอก",
    "otherTwo": "อีกสองดอก",
    "forcedBid": "บิดบังคับ",
    "superAcceptance": "การตอบรับพิเศษ",
    "transferSuit": "ดอกของทรานส์เฟอร์"
  },
  "ko": {
    "natural": "내추럴",
    "weak": "약한",
    "balanced": "균형 핸드",
    "unbalanced": "불균형 핸드",
    "stopper": "스토퍼",
    "noStopper": "스토퍼 없음",
    "singleton": "싱글턴",
    "and": "그리고",
    "or": "또는",
    "cards": "{s} {n}장",
    "otherMajor": "다른 메이저",
    "otherTwo": "나머지 두 수트",
    "forcedBid": "필수 비드",
    "superAcceptance": "슈퍼 수락",
    "transferSuit": "트랜스퍼 수트"
  }
};
export const CONVENTIONS_INTRO_EL = ui.el.intro;
export function getConventionUiCopy(language: InfoLanguage) { return ui[language]; }
/** Game vocabulary is independent of educational article publication. */
export function getBenConventionVocabulary(language: InfoLanguage) { return vocabulary[language]; }

import type { ConventionArticle } from '@/lib/bridge-conventions';
import registry from '@/generated/conventions.json';
export function getLocalizedConvention(article: ConventionArticle, language: InfoLanguage): ConventionArticle {
  const id = article.conventionId;
  const translated = (registry.articles as ConventionArticle[]).find(item => item.conventionId === id && item.language === language);
  if (!translated) throw new Error('Unpublished translation: ' + id + '/' + language);
  return translated;
}
