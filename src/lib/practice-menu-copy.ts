import type { InfoLanguage } from '@/lib/info-popup-translations';

export const PRACTICE_MENU_TITLE = 'PRACTICE';
export const PRACTICE_JUST_DECLARE_TITLE = 'PRACTICE · Just Declare';
export const PRACTICE_BID_AND_PLAY_TITLE = 'PRACTICE · Bid and Play';
export const PRACTICE_UNLIMITED_SUBTITLE = 'Unlimited deals for registered players';

type PracticeMenuCopy = { solo: string; partnership: string; justDeclare: string; bidAndPlay: string };
const copies: Record<InfoLanguage, PracticeMenuCopy> = {
  el: {"solo":"Εξάσκηση","partnership":"Εξάσκηση με συμπαίκτη","justDeclare":"Μόνο εκτέλεση","bidAndPlay":"Αγορά και παίξιμο"},
  en: {"solo":"Practice","partnership":"Partnership practice","justDeclare":"Just declare","bidAndPlay":"Bid and play"},
  fr: {"solo":"Entraînement","partnership":"Entraînement en partenariat","justDeclare":"Jeu de la carte","bidAndPlay":"Enchères et jeu"},
  nl: {"solo":"Oefenen","partnership":"Oefenen met een partner","justDeclare":"Alleen afspelen","bidAndPlay":"Bieden en spelen"},
  zh: {"solo":"练习","partnership":"搭档练习","justDeclare":"仅做庄","bidAndPlay":"叫牌和打牌"},
  it: {"solo":"Allenamento","partnership":"Allenamento con il compagno","justDeclare":"Solo gioco","bidAndPlay":"Licita e gioca"},
  de: {"solo":"Training","partnership":"Partnerschaftstraining","justDeclare":"Nur Alleinspiel","bidAndPlay":"Reizen und Spielen"},
  sv: {"solo":"Träning","partnership":"Träning med partner","justDeclare":"Bara spelföring","bidAndPlay":"Budgivning och spel"},
  da: {"solo":"Træning","partnership":"Træning med makker","justDeclare":"Kun spilføring","bidAndPlay":"Melding og spil"},
  no: {"solo":"Trening","partnership":"Trening med makker","justDeclare":"Bare spilleføring","bidAndPlay":"Melding og spill"},
  pl: {"solo":"Trening","partnership":"Trening z partnerem","justDeclare":"Tylko rozgrywka","bidAndPlay":"Licytacja i rozgrywka"},
  ja: {"solo":"練習","partnership":"パートナーと練習","justDeclare":"プレイのみ","bidAndPlay":"ビディングとプレイ"},
  he: {"solo":"אימון","partnership":"אימון עם שותף","justDeclare":"משחק בלבד","bidAndPlay":"הכרזה ומשחק"},
  es: {"solo":"Práctica","partnership":"Práctica con compañero","justDeclare":"Solo carteo","bidAndPlay":"Subasta y juego"},
  pt: {"solo":"Treino","partnership":"Treino com parceiro","justDeclare":"Só carteio","bidAndPlay":"Leilão e jogo"},
  hi: {"solo":"अभ्यास","partnership":"साथी के साथ अभ्यास","justDeclare":"केवल डिक्लेयरर का खेल","bidAndPlay":"बोली और खेल"},
  tr: {"solo":"Alıştırma","partnership":"Ortakla alıştırma","justDeclare":"Yalnızca oyun","bidAndPlay":"Deklarasyon ve oyun"},
  ru: {"solo":"Тренировка","partnership":"Тренировка с партнёром","justDeclare":"Только розыгрыш","bidAndPlay":"Торговля и розыгрыш"},
  fi: {"solo":"Harjoittelu","partnership":"Pariharjoittelu","justDeclare":"Vain pelinvienti","bidAndPlay":"Tarjous ja peli"},
  cs: {"solo":"Trénink","partnership":"Trénink s partnerem","justDeclare":"Pouze sehrávka","bidAndPlay":"Dražba a sehrávka"},
  is: {"solo":"Æfing","partnership":"Æfing með makker","justDeclare":"Aðeins úrspil","bidAndPlay":"Sagnir og spil"},
  hu: {"solo":"Gyakorlás","partnership":"Gyakorlás partnerrel","justDeclare":"Csak lejátszás","bidAndPlay":"Licit és játék"},
  id: {"solo":"Latihan","partnership":"Latihan bersama pasangan","justDeclare":"Hanya bermain","bidAndPlay":"Menawar dan bermain"},
  ar: {"solo":"التدريب","partnership":"تدريب مع الشريك","justDeclare":"اللعب فقط","bidAndPlay":"المزايدة واللعب"},
  th: {"solo":"ฝึกเล่น","partnership":"ฝึกเล่นกับคู่","justDeclare":"เล่นไพ่เท่านั้น","bidAndPlay":"ประมูลและเล่นไพ่"},
  ko: {"solo":"연습","partnership":"파트너와 연습","justDeclare":"플레이만","bidAndPlay":"비딩과 플레이"},
};
export function getPracticeMenuCopy(language: InfoLanguage): PracticeMenuCopy {
  return copies[language];
}
