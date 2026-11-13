import type { InfoLanguage } from '@/lib/info-popup-translations';

const labels: Record<InfoLanguage, readonly [string, string]> = {
  en: ["You are in Results.","You are in Statistics."],
  fr: ["Tu es dans les résultats.","Tu es dans les statistiques."],
  nl: ["Je bent bij de resultaten.","Je bent bij de statistieken."],
  zh: ["你已进入结果页面。","你已进入统计页面。"],
  it: ["Ti trovi nei risultati.","Ti trovi nelle statistiche."],
  de: ["Du bist bei den Ergebnissen.","Du bist bei den Statistiken."],
  sv: ["Du är på resultatsidan.","Du är på statistiksidan."],
  da: ["Du er på resultatsiden.","Du er på statistiksiden."],
  no: ["Du er på resultatsiden.","Du er på statistikksiden."],
  pl: ["Jesteś w wynikach.","Jesteś w statystykach."],
  ja: ["結果ページを表示しています。","統計ページを表示しています。"],
  he: ["אתה בעמוד התוצאות.","אתה בעמוד הסטטיסטיקה."],
  es: ["Estás en los resultados.","Estás en las estadísticas."],
  pt: ["Estás nos resultados.","Estás nas estatísticas."],
  hi: ["तुम परिणाम पृष्ठ पर हो।","तुम आँकड़ों के पृष्ठ पर हो।"],
  tr: ["Sonuçlar sayfasındasın.","İstatistikler sayfasındasın."],
  ru: ["Ты на странице результатов.","Ты на странице статистики."],
  el: ["Βρίσκεσαι στα αποτελέσματα.","Βρίσκεσαι στα στατιστικά."],
  fi: ["Olet tulossivulla.","Olet tilastosivulla."],
  cs: ["Jsi na stránce výsledků.","Jsi na stránce statistik."],
  is: ["Þú ert á niðurstöðusíðunni.","Þú ert á tölfræðisíðunni."],
  hu: ["Az eredmények oldalán vagy.","A statisztikák oldalán vagy."],
  id: ["Kamu berada di halaman hasil.","Kamu berada di halaman statistik."],
  ar: ["أنت في صفحة النتائج.","أنت في صفحة الإحصاءات."],
  th: ["คุณอยู่ที่หน้าผลการแข่งขัน","คุณอยู่ที่หน้าสถิติ"],
  ko: ["결과 페이지에 있습니다.","통계 페이지에 있습니다."],
};

export function personalDataPageLabel(kind: 'results' | 'statistics', language: InfoLanguage): string {
  return labels[language][kind === 'results' ? 0 : 1];
}
