import type { InfoLanguage } from '@/lib/info-popup-translations';

type Copy = { title: string; message: string; accept: string; reject: string; settings: string; withdraw: string; privacy: string; details: string };
const copies: Record<InfoLanguage, Copy> = {
  "en": {
    "title": "Advertising measurement",
    "message": "We use optional cookies and Google Ads to measure how well our ads work. Rejecting does not affect playing.",
    "accept": "Accept",
    "reject": "Reject",
    "settings": "Advertising preferences",
    "withdraw": "Withdraw advertising consent",
    "privacy": "Privacy policy",
    "details": "Your choice is saved for 180 days. You can withdraw it here at any time; future measurement stops and existing totals remain. Google receives technical data and ad click identifiers, but we send no email or username."
  },
  "el": {
    "title": "Μέτρηση διαφημίσεων",
    "message": "Χρησιμοποιούμε προαιρετικά cookies και Google Ads για να μετράμε την αποτελεσματικότητα των διαφημίσεών μας. Η απόρριψη δεν επηρεάζει το παιχνίδι.",
    "accept": "Αποδοχή",
    "reject": "Απόρριψη",
    "settings": "Επιλογές μέτρησης διαφημίσεων",
    "withdraw": "Ανάκληση συγκατάθεσης μέτρησης",
    "privacy": "Πολιτική Απορρήτου",
    "details": "Η επιλογή αποθηκεύεται για 180 ημέρες. Μπορείς να την ανακαλέσεις εδώ οποτεδήποτε· σταματά η μελλοντική μέτρηση και διατηρούνται τα ήδη καταγεγραμμένα σύνολα. Η Google λαμβάνει τεχνικά δεδομένα και αναγνωριστικά διαφημιστικών κλικ, αλλά δεν στέλνουμε email ή username."
  },
  "fr": {
    "title": "Mesure publicitaire",
    "message": "Nous utilisons des cookies facultatifs et Google Ads pour mesurer l’efficacité de nos publicités. Refuser ne change pas le jeu.",
    "accept": "Accepter",
    "reject": "Refuser",
    "settings": "Préférences publicitaires",
    "withdraw": "Retirer le consentement publicitaire",
    "privacy": "Confidentialité",
    "details": "Votre choix est conservé 180 jours. Vous pouvez le retirer ici à tout moment ; les mesures futures cessent et les totaux existants restent. Google reçoit des données techniques et des identifiants de clics publicitaires, mais nous n’envoyons ni e-mail ni nom d’utilisateur."
  },
  "nl": {
    "title": "Advertentiemeting",
    "message": "We gebruiken optionele cookies en Google Ads om de effectiviteit van onze advertenties te meten. Weigeren heeft geen invloed op spelen.",
    "accept": "Accepteren",
    "reject": "Weigeren",
    "settings": "Advertentievoorkeuren",
    "withdraw": "Advertentietoestemming intrekken",
    "privacy": "Privacybeleid",
    "details": "Uw keuze wordt 180 dagen bewaard. U kunt deze hier altijd intrekken; toekomstige metingen stoppen en bestaande totalen blijven behouden. Google ontvangt technische gegevens en advertentieklik-ID’s, maar wij sturen geen e-mailadres of gebruikersnaam."
  },
  "zh": {
    "title": "广告效果衡量",
    "message": "我们使用可选Cookie和Google Ads衡量广告效果。拒绝不影响游戏。",
    "accept": "接受",
    "reject": "拒绝",
    "settings": "广告衡量偏好",
    "withdraw": "撤回广告衡量同意",
    "privacy": "隐私政策",
    "details": "您的选择保存180天，可随时在此撤回。撤回后停止未来的衡量，已记录的总数保留。Google接收技术数据和广告点击标识符，但我们不发送电子邮箱或用户名。"
  },
  "it": {
    "title": "Misurazione pubblicitaria",
    "message": "Usiamo cookie facoltativi e Google Ads per misurare l’efficacia dei nostri annunci. Il rifiuto non influisce sul gioco.",
    "accept": "Accetta",
    "reject": "Rifiuta",
    "settings": "Preferenze pubblicitarie",
    "withdraw": "Revoca il consenso pubblicitario",
    "privacy": "Privacy",
    "details": "La scelta viene salvata per 180 giorni. Puoi revocarla qui in qualsiasi momento: le misurazioni future cessano e i totali esistenti restano. Google riceve dati tecnici e identificatori dei clic pubblicitari, ma non inviamo e-mail o nomi utente."
  },
  "de": {
    "title": "Werbemessung",
    "message": "Wir verwenden optionale Cookies und Google Ads, um die Wirksamkeit unserer Werbung zu messen. Eine Ablehnung beeinträchtigt das Spielen nicht.",
    "accept": "Zustimmen",
    "reject": "Ablehnen",
    "settings": "Werbeeinstellungen",
    "withdraw": "Werbeeinwilligung widerrufen",
    "privacy": "Datenschutz",
    "details": "Deine Wahl wird 180 Tage gespeichert. Du kannst sie hier jederzeit widerrufen; künftige Messungen enden, bisherige Gesamtzahlen bleiben erhalten. Google erhält technische Daten und Kennungen für Werbeklicks, wir senden jedoch keine E-Mail-Adresse oder Benutzernamen."
  },
  "sv": {
    "title": "Annonsmätning",
    "message": "Vi använder valfria kakor och Google Ads för att mäta hur väl våra annonser fungerar. Ett nej påverkar inte spelet.",
    "accept": "Godkänn",
    "reject": "Avvisa",
    "settings": "Annonsinställningar",
    "withdraw": "Återkalla annonssamtycke",
    "privacy": "Integritetspolicy",
    "details": "Ditt val sparas i 180 dagar. Du kan återkalla det här när som helst; framtida mätningar upphör och befintliga totalsiffror behålls. Google får tekniska uppgifter och annonsklickidentifierare, men vi skickar inte e-postadress eller användarnamn."
  },
  "da": {
    "title": "Annoncemåling",
    "message": "Vi bruger valgfrie cookies og Google Ads til at måle effekten af vores annoncer. Afvisning påvirker ikke spillet.",
    "accept": "Acceptér",
    "reject": "Afvis",
    "settings": "Annonceindstillinger",
    "withdraw": "Træk annoncesamtykke tilbage",
    "privacy": "Privatlivspolitik",
    "details": "Dit valg gemmes i 180 dage. Du kan altid trække det tilbage her; fremtidige målinger stopper, og eksisterende totaler bevares. Google modtager tekniske data og annonceklik-id’er, men vi sender ikke e-mailadresse eller brugernavn."
  },
  "no": {
    "title": "Annonsemåling",
    "message": "Vi bruker valgfrie informasjonskapsler og Google Ads for å måle effekten av annonsene våre. Avslag påvirker ikke spillingen.",
    "accept": "Godta",
    "reject": "Avslå",
    "settings": "Annonseinnstillinger",
    "withdraw": "Trekk tilbake annonsesamtykke",
    "privacy": "Personvern",
    "details": "Valget lagres i 180 dager. Du kan trekke det tilbake her når som helst; fremtidige målinger stopper, og eksisterende totaltall beholdes. Google mottar tekniske data og identifikatorer for annonseklikk, men vi sender ikke e-postadresse eller brukernavn."
  },
  "pl": {
    "title": "Pomiar reklam",
    "message": "Używamy opcjonalnych plików cookie i Google Ads, aby mierzyć skuteczność naszych reklam. Odmowa nie wpływa na grę.",
    "accept": "Akceptuję",
    "reject": "Odrzucam",
    "settings": "Ustawienia reklam",
    "withdraw": "Wycofaj zgodę na pomiar reklam",
    "privacy": "Polityka prywatności",
    "details": "Twój wybór zapisujemy na 180 dni. Możesz go tutaj w każdej chwili wycofać; przyszłe pomiary ustają, a dotychczasowe sumy pozostają. Google otrzymuje dane techniczne i identyfikatory kliknięć reklam, ale nie wysyłamy adresu e-mail ani nazwy użytkownika."
  },
  "ja": {
    "title": "広告効果の測定",
    "message": "任意のCookieとGoogle Adsを使って広告の効果を測定します。拒否してもプレイに影響しません。",
    "accept": "同意する",
    "reject": "拒否する",
    "settings": "広告測定の設定",
    "withdraw": "広告測定への同意を撤回",
    "privacy": "プライバシーポリシー",
    "details": "選択は180日間保存され、ここでいつでも撤回できます。以後の測定は停止し、記録済みの合計は保持されます。Googleは技術データと広告クリック識別子を受け取りますが、メールアドレスやユーザー名は送信しません。"
  },
  "he": {
    "title": "מדידת פרסום",
    "message": "אנו משתמשים בעוגיות אופציונליות וב־Google Ads כדי למדוד את יעילות הפרסומות שלנו. סירוב לא פוגע במשחק.",
    "accept": "אישור",
    "reject": "סירוב",
    "settings": "העדפות מדידת פרסום",
    "withdraw": "ביטול ההסכמה למדידת פרסום",
    "privacy": "מדיניות פרטיות",
    "details": "הבחירה נשמרת ל־180 יום. אפשר לבטל אותה כאן בכל עת; המדידה העתידית נפסקת והסכומים שכבר נרשמו נשמרים. Google מקבל נתונים טכניים ומזהי לחיצה על מודעות, אך איננו שולחים דוא״ל או שם משתמש."
  },
  "es": {
    "title": "Medición publicitaria",
    "message": "Usamos cookies opcionales y Google Ads para medir la eficacia de nuestros anuncios. Rechazar no afecta al juego.",
    "accept": "Aceptar",
    "reject": "Rechazar",
    "settings": "Preferencias publicitarias",
    "withdraw": "Retirar consentimiento publicitario",
    "privacy": "Privacidad",
    "details": "Tu elección se guarda durante 180 días. Puedes retirarla aquí en cualquier momento; las futuras mediciones cesan y los totales existentes se conservan. Google recibe datos técnicos e identificadores de clics publicitarios, pero no enviamos correo electrónico ni nombre de usuario."
  },
  "pt": {
    "title": "Medição de publicidade",
    "message": "Usamos cookies opcionais e Google Ads para medir a eficácia dos nossos anúncios. Recusar não afeta o jogo.",
    "accept": "Aceitar",
    "reject": "Recusar",
    "settings": "Preferências de publicidade",
    "withdraw": "Retirar consentimento publicitário",
    "privacy": "Privacidade",
    "details": "A escolha fica guardada durante 180 dias. Pode retirá-la aqui a qualquer momento; a medição futura cessa e os totais existentes mantêm-se. A Google recebe dados técnicos e identificadores de cliques publicitários, mas não enviamos e-mail nem nome de utilizador."
  },
  "hi": {
    "title": "विज्ञापन मापन",
    "message": "हम अपने विज्ञापनों की प्रभावशीलता मापने के लिए वैकल्पिक कुकीज़ और Google Ads का उपयोग करते हैं। मना करने से खेल प्रभावित नहीं होता।",
    "accept": "स्वीकारें",
    "reject": "अस्वीकारें",
    "settings": "विज्ञापन प्राथमिकताएँ",
    "withdraw": "विज्ञापन मापन की सहमति वापस लो",
    "privacy": "गोपनीयता नीति",
    "details": "आपका विकल्प 180 दिन सुरक्षित रहता है। यहाँ कभी भी सहमति वापस लें; आगे का मापन रुक जाता है और पहले के कुल आँकड़े बने रहते हैं। Google को तकनीकी डेटा और विज्ञापन क्लिक पहचानकर्ता मिलते हैं, लेकिन हम ईमेल या उपयोगकर्ता नाम नहीं भेजते।"
  },
  "tr": {
    "title": "Reklam ölçümü",
    "message": "Reklamlarımızın etkinliğini ölçmek için isteğe bağlı çerezler ve Google Ads kullanıyoruz. Reddetmek oyunu etkilemez.",
    "accept": "Kabul et",
    "reject": "Reddet",
    "settings": "Reklam tercihleri",
    "withdraw": "Reklam ölçümü onayını geri çek",
    "privacy": "Gizlilik politikası",
    "details": "Seçiminiz 180 gün saklanır. İzninizi burada her zaman geri çekebilirsiniz; gelecekteki ölçümler durur, mevcut toplamlar korunur. Google teknik verileri ve reklam tıklama tanımlayıcılarını alır, ancak e-posta veya kullanıcı adı göndermeyiz."
  },
  "ru": {
    "title": "Измерение рекламы",
    "message": "Мы используем необязательные файлы cookie и Google Ads для измерения эффективности рекламы. Отказ не влияет на игру.",
    "accept": "Принять",
    "reject": "Отклонить",
    "settings": "Настройки рекламы",
    "withdraw": "Отозвать согласие на измерение рекламы",
    "privacy": "Конфиденциальность",
    "details": "Выбор хранится 180 дней. Вы можете отозвать согласие здесь в любое время: дальнейшие измерения прекращаются, ранее записанные итоги сохраняются. Google получает технические данные и идентификаторы рекламных кликов, но мы не отправляем электронную почту или имя пользователя."
  },
  "fi": {
    "title": "Mainonnan mittaus",
    "message": "Käytämme valinnaisia evästeitä ja Google Adsia mainostemme tehokkuuden mittaamiseen. Kieltäytyminen ei vaikuta pelaamiseen.",
    "accept": "Hyväksy",
    "reject": "Hylkää",
    "settings": "Mainosasetukset",
    "withdraw": "Peru mainonnan mittauksen suostumus",
    "privacy": "Tietosuojaseloste",
    "details": "Valintasi säilytetään 180 päivää. Voit perua sen tässä milloin tahansa; tulevat mittaukset loppuvat ja aiemmat kokonaismäärät säilyvät. Google saa teknisiä tietoja ja mainosklikkausten tunnisteita, mutta emme lähetä sähköpostia tai käyttäjänimeä."
  },
  "cs": {
    "title": "Měření reklamy",
    "message": "Používáme volitelné soubory cookie a Google Ads k měření účinnosti našich reklam. Odmítnutí neovlivní hru.",
    "accept": "Přijmout",
    "reject": "Odmítnout",
    "settings": "Nastavení reklamy",
    "withdraw": "Odvolej souhlas s měřením reklamy",
    "privacy": "Ochrana soukromí",
    "details": "Volba se ukládá na 180 dní. Zde ji můžete kdykoli odvolat; budoucí měření skončí a dosavadní součty zůstanou. Google dostává technické údaje a identifikátory kliknutí na reklamy, ale neposíláme e-mail ani uživatelské jméno."
  },
  "is": {
    "title": "Mæling auglýsinga",
    "message": "Við notum valfrjálsar vafrakökur og Google Ads til að mæla árangur auglýsinga okkar. Höfnun hefur ekki áhrif á spilun.",
    "accept": "Samþykkja",
    "reject": "Hafna",
    "settings": "Auglýsingastillingar",
    "withdraw": "Afturkalla samþykki fyrir auglýsingamælingu",
    "privacy": "Persónuvernd",
    "details": "Valið er vistað í 180 daga. Þú getur afturkallað það hér hvenær sem er; framtíðarmælingar stöðvast en fyrri heildartölur haldast. Google fær tæknigögn og auðkenni auglýsingasmella, en við sendum hvorki netfang né notandanafn."
  },
  "hu": {
    "title": "Hirdetésmérés",
    "message": "Opcionális sütikkel és a Google Ads segítségével mérjük hirdetéseink hatékonyságát. Az elutasítás nem érinti a játékot.",
    "accept": "Elfogadás",
    "reject": "Elutasítás",
    "settings": "Hirdetési beállítások",
    "withdraw": "Hirdetésmérési hozzájárulás visszavonása",
    "privacy": "Adatvédelem",
    "details": "A választást 180 napig tároljuk. Itt bármikor visszavonhatod; a jövőbeli mérés leáll, a korábbi összesítések megmaradnak. A Google technikai adatokat és hirdetéskattintási azonosítókat kap, de e-mail-címet vagy felhasználónevet nem küldünk."
  },
  "id": {
    "title": "Pengukuran iklan",
    "message": "Kami menggunakan cookie opsional dan Google Ads untuk mengukur efektivitas iklan kami. Penolakan tidak memengaruhi permainan.",
    "accept": "Terima",
    "reject": "Tolak",
    "settings": "Preferensi iklan",
    "withdraw": "Tarik persetujuan pengukuran iklan",
    "privacy": "Kebijakan privasi",
    "details": "Pilihan disimpan selama 180 hari. Anda dapat mencabutnya di sini kapan saja; pengukuran berikutnya berhenti dan total sebelumnya tetap ada. Google menerima data teknis dan pengenal klik iklan, tetapi kami tidak mengirim email atau nama pengguna."
  },
  "ar": {
    "title": "قياس الإعلانات",
    "message": "نستخدم ملفات تعريف ارتباط اختيارية وGoogle Ads لقياس فعالية إعلاناتنا. الرفض لا يؤثر على اللعب.",
    "accept": "قبول",
    "reject": "رفض",
    "settings": "تفضيلات قياس الإعلانات",
    "withdraw": "سحب الموافقة على قياس الإعلانات",
    "privacy": "سياسة الخصوصية",
    "details": "يُحفظ اختيارك لمدة 180 يومًا. يمكنك سحبه هنا في أي وقت؛ يتوقف القياس المستقبلي وتبقى المجاميع المسجلة. تتلقى Google بيانات تقنية ومعرّفات نقرات الإعلانات، لكننا لا نرسل البريد الإلكتروني أو اسم المستخدم."
  },
  "th": {
    "title": "การวัดผลโฆษณา",
    "message": "เราใช้คุกกี้เสริมและ Google Ads เพื่อวัดประสิทธิภาพโฆษณาของเรา การปฏิเสธไม่กระทบการเล่น",
    "accept": "ยอมรับ",
    "reject": "ปฏิเสธ",
    "settings": "การตั้งค่าการวัดโฆษณา",
    "withdraw": "ถอนความยินยอมในการวัดผลโฆษณา",
    "privacy": "นโยบายความเป็นส่วนตัว",
    "details": "ตัวเลือกจะถูกบันทึกไว้ 180 วัน คุณถอนความยินยอมที่นี่ได้ทุกเมื่อ การวัดในอนาคตจะหยุดลงและยอดรวมเดิมยังคงอยู่ Google ได้รับข้อมูลทางเทคนิคและตัวระบุการคลิกโฆษณา แต่เราไม่ส่งอีเมลหรือชื่อผู้ใช้"
  },
  "ko": {
    "title": "광고 효과 측정",
    "message": "선택적 쿠키와 Google Ads를 사용하여 광고 효과를 측정합니다. 거부해도 게임에 영향이 없습니다.",
    "accept": "동의",
    "reject": "거부",
    "settings": "광고 측정 설정",
    "withdraw": "광고 측정 동의 철회",
    "privacy": "개인정보 처리방침",
    "details": "선택은 180일 동안 저장됩니다. 여기에서 언제든 철회할 수 있으며, 이후 측정은 중단되고 기존 합계는 유지됩니다. Google은 기술 데이터와 광고 클릭 식별자를 받지만 이메일이나 사용자 이름은 전송하지 않습니다."
  }
};
export const getMeasurementCopy = (language: InfoLanguage) => copies[language];
