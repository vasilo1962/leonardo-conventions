import { getPracticeMenuCopy } from '@/lib/practice-menu-copy';
import { getTeachingTableCopy } from '@/features/tables/teaching-table-copy';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { personalDataPageLabel } from './personal-data-page-label';

export type CompletedMenuAction = 'entered' | 'registered' | 'registrationCanceled';
const pages = ["home","tournaments","tables","duels","play","remember","count","federation-deals","auth","/how-leonardo-defends","/conventions","/how-it-works","/privacy-policy","/terms-of-use"] as const;
type Copy = { arrival: string; pages: readonly string[]; entered: string; registered: string; registrationCanceled: string };
const copies: Record<InfoLanguage, Copy> = {
  el: {"arrival":"Βρίσκεσαι στη σελίδα «{page}».","pages":["Αρχικό μενού","Τουρνουά","Τραπέζια","Προκλήσεις","Εξάσκηση","Μνήμη","Μέτρημα","Διανομές της Ελληνικής Ομοσπονδίας Μπριτζ","Σύνδεση και εγγραφή","Πώς αμύνεται ο Λεονάρντο","Συμβάσεις","Παρουσίαση του Leonardo Bridge","Πολιτική απορρήτου","Όροι χρήσης"],"entered":"Μπήκες στο {name}.","registered":"Έκανες εγγραφή στο {name}.","registrationCanceled":"Ακύρωσες την εγγραφή σου στο {name}."},
  en: {"arrival":"You are on the {page} page.","pages":["Main menu","Tournaments","Tables","Challenges","Practice","Memory practice","Counting practice","Hellenic Bridge Federation deals","Sign in and registration","How Leonardo defends","Conventions","About Leonardo Bridge","Privacy policy","Terms of use"],"entered":"You entered {name}.","registered":"You registered for {name}.","registrationCanceled":"You canceled your registration for {name}."},
  fr: {"arrival":"Tu es sur la page {page}.","pages":["Menu principal","Tournois","Tables","Défis","Entraînement","Mémoire","Comptage","Donnes de la Fédération grecque de bridge","Connexion et inscription","Comment Leonardo défend","Conventions","Présentation de Leonardo Bridge","Confidentialité","Conditions d’utilisation"],"entered":"Tu es dans {name}.","registered":"Ton inscription à {name} est confirmée.","registrationCanceled":"Tu as annulé ton inscription à {name}."},
  nl: {"arrival":"Je bent op de pagina {page}.","pages":["Hoofdmenu","Toernooien","Tafels","Uitdagingen","Oefenen","Geheugen oefenen","Tellen oefenen","Spellen van de Griekse Bridgebond","Inloggen en registreren","Hoe Leonardo tegenspeelt","Conventies","Over Leonardo Bridge","Privacybeleid","Gebruiksvoorwaarden"],"entered":"Je bent binnen bij {name}.","registered":"Je hebt je aangemeld voor {name}.","registrationCanceled":"Je hebt je afgemeld voor {name}."},
  zh: {"arrival":"你已进入{page}页面。","pages":["主菜单","比赛","牌桌","挑战","练习","记忆练习","计数练习","希腊桥牌联合会牌局","登录和注册","Leonardo的防守方式","约定叫","关于Leonardo Bridge","隐私政策","使用条款"],"entered":"你已进入{name}。","registered":"你已报名参加{name}。","registrationCanceled":"你已取消{name}的报名。"},
  it: {"arrival":"Sei nella pagina {page}.","pages":["Menu principale","Tornei","Tavoli","Sfide","Allenamento","Esercizi di memoria","Esercizi di conteggio","Mani della Federazione greca di bridge","Accesso e registrazione","Come difende Leonardo","Convenzioni","Informazioni su Leonardo Bridge","Informativa sulla privacy","Condizioni d’uso"],"entered":"Sei entrato in {name}.","registered":"La tua iscrizione a {name} è confermata.","registrationCanceled":"Hai annullato la tua iscrizione a {name}."},
  de: {"arrival":"Du bist auf der Seite {page}.","pages":["Hauptmenü","Turniere","Tische","Herausforderungen","Training","Gedächtnistraining","Zähltraining","Boards des griechischen Bridgeverbands","Anmeldung und Registrierung","Wie Leonardo verteidigt","Konventionen","Über Leonardo Bridge","Datenschutz","Nutzungsbedingungen"],"entered":"Du bist jetzt in {name}.","registered":"Du hast dich für {name} angemeldet.","registrationCanceled":"Du hast deine Anmeldung für {name} zurückgezogen."},
  sv: {"arrival":"Du är på sidan {page}.","pages":["Huvudmeny","Turneringar","Bord","Utmaningar","Träning","Minnesträning","Räkneträning","Givar från grekiska bridgeförbundet","Inloggning och registrering","Så försvarar Leonardo","Konventioner","Om Leonardo Bridge","Integritetspolicy","Användarvillkor"],"entered":"Du har gått in i {name}.","registered":"Du har anmält dig till {name}.","registrationCanceled":"Du har avanmält dig från {name}."},
  da: {"arrival":"Du er på siden {page}.","pages":["Hovedmenu","Turneringer","Borde","Udfordringer","Træning","Hukommelsestræning","Tælletræning","Spil fra det græske bridgeforbund","Login og registrering","Sådan spiller Leonardo modspil","Konventioner","Om Leonardo Bridge","Privatlivspolitik","Brugsvilkår"],"entered":"Du er gået ind i {name}.","registered":"Du har tilmeldt dig {name}.","registrationCanceled":"Du har afmeldt dig {name}."},
  no: {"arrival":"Du er på siden {page}.","pages":["Hovedmeny","Turneringer","Bord","Utfordringer","Trening","Hukommelsestrening","Telletrening","Spill fra det greske bridgeforbundet","Innlogging og registrering","Slik spiller Leonardo motspill","Konvensjoner","Om Leonardo Bridge","Personvern","Bruksvilkår"],"entered":"Du har gått inn i {name}.","registered":"Du har meldt deg på {name}.","registrationCanceled":"Du har meldt deg av {name}."},
  pl: {"arrival":"Jesteś na stronie {page}.","pages":["Menu główne","Turnieje","Stoły","Wyzwania","Trening","Trening pamięci","Trening liczenia","Rozdania Greckiej Federacji Brydżowej","Logowanie i rejestracja","Jak broni Leonardo","Konwencje","O Leonardo Bridge","Polityka prywatności","Warunki użytkowania"],"entered":"Jesteś teraz w {name}.","registered":"Twój zapis do {name} został potwierdzony.","registrationCanceled":"Twój zapis do {name} został anulowany."},
  ja: {"arrival":"{page}のページです。","pages":["メインメニュー","トーナメント","テーブル","チャレンジ","練習","記憶の練習","カウントの練習","ギリシャブリッジ連盟のディール","ログインと登録","Leonardoのディフェンス","コンベンション","Leonardo Bridgeについて","プライバシーポリシー","利用規約"],"entered":"{name}に入りました。","registered":"{name}への登録が完了しました。","registrationCanceled":"{name}への登録を取り消しました。"},
  he: {"arrival":"אתה בעמוד {page}.","pages":["התפריט הראשי","טורנירים","שולחנות","אתגרים","אימון","אימון זיכרון","אימון ספירה","חלוקות של התאחדות הברידג׳ היוונית","כניסה והרשמה","איך Leonardo מגן","קונבנציות","על Leonardo Bridge","מדיניות פרטיות","תנאי שימוש"],"entered":"נכנסת ל{name}.","registered":"נרשמת ל{name}.","registrationCanceled":"ביטלת את ההרשמה שלך ל{name}."},
  es: {"arrival":"Estás en la página {page}.","pages":["Menú principal","Torneos","Mesas","Desafíos","Práctica","Ejercicios de memoria","Ejercicios de conteo","Manos de la Federación Griega de Bridge","Acceso y registro","Cómo defiende Leonardo","Convenciones","Acerca de Leonardo Bridge","Política de privacidad","Condiciones de uso"],"entered":"Has entrado en {name}.","registered":"Te has inscrito en {name}.","registrationCanceled":"Has cancelado tu inscripción en {name}."},
  pt: {"arrival":"Estás na página {page}.","pages":["Menu principal","Torneios","Mesas","Desafios","Treino","Exercícios de memória","Exercícios de contagem","Mãos da Federação Grega de Bridge","Início de sessão e registo","Como o Leonardo defende","Convenções","Sobre o Leonardo Bridge","Política de privacidade","Termos de utilização"],"entered":"Entraste em {name}.","registered":"Inscreveste-te em {name}.","registrationCanceled":"Cancelaste a tua inscrição em {name}."},
  hi: {"arrival":"तुम {page} पेज पर हो।","pages":["मुख्य मेनू","टूर्नामेंट","टेबल","चुनौतियाँ","अभ्यास","याददाश्त का अभ्यास","गिनती का अभ्यास","ग्रीक ब्रिज महासंघ की डील","लॉगिन और पंजीकरण","Leonardo कैसे बचाव करता है","कन्वेंशन","Leonardo Bridge के बारे में","गोपनीयता नीति","उपयोग की शर्तें"],"entered":"तुम {name} में आ गए हो।","registered":"तुमने {name} के लिए पंजीकरण कर लिया है।","registrationCanceled":"तुमने {name} के लिए अपना पंजीकरण रद्द कर दिया है।"},
  tr: {"arrival":"{page} sayfasındasın.","pages":["Ana menü","Turnuvalar","Masalar","Meydan okumalar","Alıştırma","Hafıza alıştırması","Sayma alıştırması","Yunanistan Briç Federasyonu dağıtımları","Giriş ve kayıt","Leonardo nasıl savunma yapar","Konvansiyonlar","Leonardo Bridge hakkında","Gizlilik politikası","Kullanım koşulları"],"entered":"{name} turnuvasına girdin.","registered":"{name} turnuvasına kaydoldun.","registrationCanceled":"{name} turnuvasındaki kaydını iptal ettin."},
  ru: {"arrival":"Ты на странице «{page}».","pages":["Главное меню","Турниры","Столы","Вызовы","Тренировка","Тренировка памяти","Тренировка счёта","Сдачи Греческой федерации бриджа","Вход и регистрация","Как защищается Leonardo","Конвенции","О Leonardo Bridge","Политика конфиденциальности","Условия использования"],"entered":"Вход в {name} выполнен.","registered":"Твоя регистрация на {name} подтверждена.","registrationCanceled":"Твоя регистрация на {name} отменена."},
  fi: {"arrival":"Olet sivulla {page}.","pages":["Päävalikko","Turnaukset","Pöydät","Haasteet","Harjoittelu","Muistiharjoittelu","Laskuharjoittelu","Kreikan bridgeliiton jaot","Kirjautuminen ja rekisteröityminen","Miten Leonardo puolustaa","Konventiot","Tietoa Leonardo Bridgestä","Tietosuojakäytäntö","Käyttöehdot"],"entered":"Olet siirtynyt turnaukseen {name}.","registered":"Olet ilmoittautunut turnaukseen {name}.","registrationCanceled":"Olet perunut ilmoittautumisesi turnaukseen {name}."},
  cs: {"arrival":"Jsi na stránce {page}.","pages":["Hlavní nabídka","Turnaje","Stoly","Výzvy","Trénink","Trénink paměti","Trénink počítání","Rozdání Řecké bridžové federace","Přihlášení a registrace","Jak Leonardo brání","Konvence","O Leonardo Bridge","Ochrana soukromí","Podmínky použití"],"entered":"Vstup do {name} se podařil.","registered":"Tvoje registrace do {name} je potvrzena.","registrationCanceled":"Tvoje registrace do {name} je zrušena."},
  is: {"arrival":"Þú ert á síðunni {page}.","pages":["Aðalvalmynd","Mót","Borð","Áskoranir","Æfing","Minnisæfing","Talningaræfing","Spil gríska bridgesambandsins","Innskráning og skráning","Hvernig Leonardo ver","Sagnvenjur","Um Leonardo Bridge","Persónuverndarstefna","Notkunarskilmálar"],"entered":"Þú ert nú í {name}.","registered":"Þú hefur skráð þig í {name}.","registrationCanceled":"Þú hefur afskráð þig úr {name}."},
  hu: {"arrival":"Ezen az oldalon vagy: {page}.","pages":["Főmenü","Versenyek","Asztalok","Kihívások","Gyakorlás","Memóriagyakorlat","Számolási gyakorlat","A Görög Bridzsszövetség leosztásai","Bejelentkezés és regisztráció","Így védekezik Leonardo","Konvenciók","A Leonardo Bridge bemutatása","Adatvédelmi szabályzat","Felhasználási feltételek"],"entered":"Beléptél ide: {name}.","registered":"Jelentkeztél erre: {name}.","registrationCanceled":"Lemondtad a jelentkezésedet erre: {name}."},
  id: {"arrival":"Kamu berada di halaman {page}.","pages":["Menu utama","Turnamen","Meja","Tantangan","Latihan","Latihan ingatan","Latihan menghitung","Pembagian Federasi Bridge Yunani","Masuk dan pendaftaran","Cara Leonardo bertahan","Konvensi","Tentang Leonardo Bridge","Kebijakan privasi","Ketentuan penggunaan"],"entered":"Kamu telah masuk ke {name}.","registered":"Kamu telah mendaftar untuk {name}.","registrationCanceled":"Kamu telah membatalkan pendaftaran untuk {name}."},
  ar: {"arrival":"أنت في صفحة {page}.","pages":["القائمة الرئيسية","البطولات","الطاولات","التحديات","التدريب","تدريب الذاكرة","تدريب العد","توزيعات الاتحاد اليوناني للبريدج","تسجيل الدخول والتسجيل","كيف يدافع Leonardo","الاتفاقيات","عن Leonardo Bridge","سياسة الخصوصية","شروط الاستخدام"],"entered":"دخلت إلى {name}.","registered":"سجّلت في {name}.","registrationCanceled":"ألغيت تسجيلك في {name}."},
  th: {"arrival":"คุณอยู่ที่หน้า{page}","pages":["เมนูหลัก","ทัวร์นาเมนต์","โต๊ะ","การท้าทาย","ฝึกเล่น","ฝึกความจำ","ฝึกนับ","ดีลจากสหพันธ์บริดจ์กรีซ","เข้าสู่ระบบและลงทะเบียน","วิธีป้องกันของ Leonardo","ข้อตกลงการประมูล","เกี่ยวกับ Leonardo Bridge","นโยบายความเป็นส่วนตัว","ข้อกำหนดการใช้งาน"],"entered":"คุณเข้าสู่{name}แล้ว","registered":"คุณลงทะเบียน{name}แล้ว","registrationCanceled":"คุณยกเลิกการลงทะเบียน{name}แล้ว"},
  ko: {"arrival":"{page} 페이지입니다.","pages":["메인 메뉴","토너먼트","테이블","챌린지","연습","기억력 연습","카운트 연습","그리스 브리지 연맹 딜","로그인 및 가입","Leonardo의 수비 방법","컨벤션","Leonardo Bridge 소개","개인정보 처리방침","이용약관"],"entered":"{name}에 입장했습니다.","registered":"{name}에 등록했습니다.","registrationCanceled":"{name} 등록을 취소했습니다."},
};
const greekPages: Record<string, string> = {
  home: 'Βρίσκεσαι στο αρχικό μενού.',
  tournaments: 'Βρίσκεσαι στη σελίδα των τουρνουά.',
  tables: 'Βρίσκεσαι στη σελίδα των τραπεζιών.',
  duels: 'Βρίσκεσαι στη σελίδα των προκλήσεων.',
  results: personalDataPageLabel('results', 'el'),
  statistics: personalDataPageLabel('statistics', 'el'),
  play: 'Βρίσκεσαι στη σελίδα της εξάσκησης.',
  remember: 'Βρίσκεσαι στη σελίδα της εξάσκησης μνήμης.',
  count: 'Βρίσκεσαι στη σελίδα της εξάσκησης στο μέτρημα.',
  'federation-deals': 'Βρίσκεσαι στη σελίδα των διανομών της Ελληνικής Ομοσπονδίας Μπριτζ.',
  auth: 'Βρίσκεσαι στη σελίδα της σύνδεσης και εγγραφής.',
  '/how-leonardo-defends': 'Βρίσκεσαι στη σελίδα «Πώς αμύνεται ο Λεονάρντο».',
  '/conventions': 'Βρίσκεσαι στη σελίδα των συμβάσεων.',
  '/how-it-works': 'Βρίσκεσαι στη σελίδα παρουσίασης του Leonardo Bridge.',
  '/privacy-policy': 'Βρίσκεσαι στη σελίδα της πολιτικής απορρήτου.',
  '/terms-of-use': 'Βρίσκεσαι στη σελίδα των όρων χρήσης.',
};

export function menuPageArrivalText(page: string, language: InfoLanguage): string | null {
  if (page === 'solo-practice' || page === 'partnership-practice') {
    const practice = getPracticeMenuCopy(language);
    return copies[language].arrival.replace('{page}', page === 'solo-practice' ? practice.solo : practice.partnership);
  }
  if (page === 'teaching-table') return copies[language].arrival.replace('{page}', getTeachingTableCopy(language).title);
  if (page === 'results' || page === 'statistics') return personalDataPageLabel(page, language);
  const index = pages.findIndex(key => key === page);
  if (index < 0) return null;
  if (language === 'el') return greekPages[page];
  return copies[language].arrival.replace('{page}', copies[language].pages[index]);
}

export function completedMenuActionText(action: CompletedMenuAction, name: string, language: InfoLanguage): string {
  return copies[language][action].replace('{name}', name);
}

export function menuPageTitle(page: string, language: InfoLanguage): string | null {
  if (page === 'solo-practice') return getPracticeMenuCopy(language).solo;
  if (page === 'partnership-practice') return getPracticeMenuCopy(language).partnership;
  if (page === 'teaching-table') return getTeachingTableCopy(language).title;
  const index = pages.findIndex(key => key === page);
  return index < 0 ? null : copies[language].pages[index];
}
