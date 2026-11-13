import type { InfoLanguage } from '@/lib/info-popup-translations';

type CustomizeCopy = { title: string; sounds: string; screenReader: string; loading: string; loadFailed: string; saveFailed: string; retry: string };
const COPY: Record<InfoLanguage, CustomizeCopy> = {
  "en": {
    "title": "Customize",
    "sounds": "Sounds",
    "screenReader": "I use a screen reader",
    "loading": "Loading…",
    "loadFailed": "Your preferences could not be loaded.",
    "saveFailed": "Your change could not be saved.",
    "retry": "Try again"
  },
  "el": {
    "title": "Προσαρμογή",
    "sounds": "Ήχοι",
    "screenReader": "Χρησιμοποιώ αναγνώστη οθόνης",
    "loading": "Φόρτωση…",
    "loadFailed": "Δεν ήταν δυνατή η φόρτωση των προτιμήσεών σου.",
    "saveFailed": "Δεν ήταν δυνατή η αποθήκευση της αλλαγής σου.",
    "retry": "Δοκίμασε ξανά"
  },
  "fr": {
    "title": "Personnalisation",
    "sounds": "Sons",
    "screenReader": "J’utilise un lecteur d’écran",
    "loading": "Chargement…",
    "loadFailed": "Impossible de charger vos préférences.",
    "saveFailed": "Impossible d’enregistrer votre modification.",
    "retry": "Réessayer"
  },
  "nl": {
    "title": "Aanpassen",
    "sounds": "Geluiden",
    "screenReader": "Ik gebruik een schermlezer",
    "loading": "Laden…",
    "loadFailed": "Je voorkeuren konden niet worden geladen.",
    "saveFailed": "Je wijziging kon niet worden opgeslagen.",
    "retry": "Opnieuw proberen"
  },
  "zh": {
    "title": "自定义",
    "sounds": "声音",
    "screenReader": "我使用屏幕阅读器",
    "loading": "正在加载…",
    "loadFailed": "无法加载你的偏好设置。",
    "saveFailed": "无法保存你的更改。",
    "retry": "重试"
  },
  "it": {
    "title": "Personalizza",
    "sounds": "Suoni",
    "screenReader": "Uso un lettore di schermo",
    "loading": "Caricamento…",
    "loadFailed": "Impossibile caricare le tue preferenze.",
    "saveFailed": "Impossibile salvare la modifica.",
    "retry": "Riprova"
  },
  "de": {
    "title": "Anpassen",
    "sounds": "Töne",
    "screenReader": "Ich verwende einen Screenreader",
    "loading": "Wird geladen…",
    "loadFailed": "Deine Einstellungen konnten nicht geladen werden.",
    "saveFailed": "Deine Änderung konnte nicht gespeichert werden.",
    "retry": "Erneut versuchen"
  },
  "sv": {
    "title": "Anpassa",
    "sounds": "Ljud",
    "screenReader": "Jag använder en skärmläsare",
    "loading": "Läser in…",
    "loadFailed": "Dina inställningar kunde inte läsas in.",
    "saveFailed": "Din ändring kunde inte sparas.",
    "retry": "Försök igen"
  },
  "da": {
    "title": "Tilpas",
    "sounds": "Lyde",
    "screenReader": "Jeg bruger en skærmlæser",
    "loading": "Indlæser…",
    "loadFailed": "Dine indstillinger kunne ikke indlæses.",
    "saveFailed": "Din ændring kunne ikke gemmes.",
    "retry": "Prøv igen"
  },
  "no": {
    "title": "Tilpass",
    "sounds": "Lyder",
    "screenReader": "Jeg bruker en skjermleser",
    "loading": "Laster…",
    "loadFailed": "Innstillingene dine kunne ikke lastes inn.",
    "saveFailed": "Endringen din kunne ikke lagres.",
    "retry": "Prøv igjen"
  },
  "pl": {
    "title": "Dostosuj",
    "sounds": "Dźwięki",
    "screenReader": "Korzystam z czytnika ekranu",
    "loading": "Wczytywanie…",
    "loadFailed": "Nie udało się wczytać Twoich preferencji.",
    "saveFailed": "Nie udało się zapisać zmiany.",
    "retry": "Spróbuj ponownie"
  },
  "ja": {
    "title": "カスタマイズ",
    "sounds": "サウンド",
    "screenReader": "スクリーンリーダーを使用しています",
    "loading": "読み込み中…",
    "loadFailed": "設定を読み込めませんでした。",
    "saveFailed": "変更を保存できませんでした。",
    "retry": "再試行"
  },
  "he": {
    "title": "התאמה אישית",
    "sounds": "צלילים",
    "screenReader": "אני משתמש בקורא מסך",
    "loading": "בטעינה…",
    "loadFailed": "לא ניתן לטעון את ההעדפות שלך.",
    "saveFailed": "לא ניתן לשמור את השינוי שלך.",
    "retry": "ניסיון נוסף"
  },
  "es": {
    "title": "Personalizar",
    "sounds": "Sonidos",
    "screenReader": "Uso un lector de pantalla",
    "loading": "Cargando…",
    "loadFailed": "No se han podido cargar tus preferencias.",
    "saveFailed": "No se ha podido guardar el cambio.",
    "retry": "Reintentar"
  },
  "pt": {
    "title": "Personalizar",
    "sounds": "Sons",
    "screenReader": "Uso um leitor de ecrã",
    "loading": "A carregar…",
    "loadFailed": "Não foi possível carregar as tuas preferências.",
    "saveFailed": "Não foi possível guardar a alteração.",
    "retry": "Tentar novamente"
  },
  "hi": {
    "title": "अनुकूलित करें",
    "sounds": "ध्वनियाँ",
    "screenReader": "मैं स्क्रीन रीडर का उपयोग करता हूँ",
    "loading": "लोड हो रहा है…",
    "loadFailed": "आपकी प्राथमिकताएँ लोड नहीं हो सकीं।",
    "saveFailed": "आपका बदलाव सहेजा नहीं जा सका।",
    "retry": "फिर कोशिश करें"
  },
  "tr": {
    "title": "Özelleştir",
    "sounds": "Sesler",
    "screenReader": "Ekran okuyucu kullanıyorum",
    "loading": "Yükleniyor…",
    "loadFailed": "Tercihlerin yüklenemedi.",
    "saveFailed": "Değişikliğin kaydedilemedi.",
    "retry": "Tekrar dene"
  },
  "ru": {
    "title": "Настроить",
    "sounds": "Звуки",
    "screenReader": "Я использую программу чтения с экрана",
    "loading": "Загрузка…",
    "loadFailed": "Не удалось загрузить ваши настройки.",
    "saveFailed": "Не удалось сохранить изменение.",
    "retry": "Повторить"
  },
  "fi": {
    "title": "Mukauta",
    "sounds": "Äänet",
    "screenReader": "Käytän ruudunlukijaa",
    "loading": "Ladataan…",
    "loadFailed": "Asetuksiasi ei voitu ladata.",
    "saveFailed": "Muutostasi ei voitu tallentaa.",
    "retry": "Yritä uudelleen"
  },
  "cs": {
    "title": "Přizpůsobit",
    "sounds": "Zvuky",
    "screenReader": "Používám čtečku obrazovky",
    "loading": "Načítání…",
    "loadFailed": "Nepodařilo se načíst vaše předvolby.",
    "saveFailed": "Nepodařilo se uložit změnu.",
    "retry": "Zkusit znovu"
  },
  "is": {
    "title": "Sérsníða",
    "sounds": "Hljóð",
    "screenReader": "Ég nota skjálesara",
    "loading": "Hleður…",
    "loadFailed": "Ekki tókst að hlaða kjörstillingunum þínum.",
    "saveFailed": "Ekki tókst að vista breytinguna þína.",
    "retry": "Reyna aftur"
  },
  "hu": {
    "title": "Testreszabás",
    "sounds": "Hangok",
    "screenReader": "Képernyőolvasót használok",
    "loading": "Betöltés…",
    "loadFailed": "Nem sikerült betölteni a beállításaidat.",
    "saveFailed": "Nem sikerült menteni a módosítást.",
    "retry": "Újra"
  },
  "id": {
    "title": "Sesuaikan",
    "sounds": "Suara",
    "screenReader": "Saya menggunakan pembaca layar",
    "loading": "Memuat…",
    "loadFailed": "Preferensimu tidak dapat dimuat.",
    "saveFailed": "Perubahanmu tidak dapat disimpan.",
    "retry": "Coba lagi"
  },
  "ar": {
    "title": "تخصيص",
    "sounds": "الأصوات",
    "screenReader": "أستخدم قارئ شاشة",
    "loading": "جارٍ التحميل…",
    "loadFailed": "تعذر تحميل تفضيلاتك.",
    "saveFailed": "تعذر حفظ التغيير.",
    "retry": "حاول مرة أخرى"
  },
  "th": {
    "title": "ปรับแต่ง",
    "sounds": "เสียง",
    "screenReader": "ฉันใช้โปรแกรมอ่านหน้าจอ",
    "loading": "กำลังโหลด…",
    "loadFailed": "ไม่สามารถโหลดการตั้งค่าของคุณได้",
    "saveFailed": "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
    "retry": "ลองอีกครั้ง"
  },
  "ko": {
    "title": "맞춤 설정",
    "sounds": "소리",
    "screenReader": "스크린 리더를 사용합니다",
    "loading": "불러오는 중…",
    "loadFailed": "환경설정을 불러오지 못했습니다.",
    "saveFailed": "변경 사항을 저장하지 못했습니다.",
    "retry": "다시 시도"
  }
};
export function getCustomizeCopy(language: InfoLanguage): CustomizeCopy { return COPY[language]; }
