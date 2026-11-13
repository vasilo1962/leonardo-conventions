import type { InfoLanguage } from '@/lib/info-popup-translations';

const SIGN_OUT: Record<InfoLanguage, string> = {
  en: 'Log out', el: 'Αποσύνδεση', fr: 'Déconnexion', nl: 'Uitloggen',
  zh: '退出登录', it: 'Esci', de: 'Abmelden', sv: 'Logga ut', da: 'Log ud', no: 'Logg ut',
  pl: 'Wyloguj się', ja: 'ログアウト', he: 'התנתקות', es: 'Cerrar sesión', pt: 'Terminar sessão',
  hi: 'लॉग आउट', tr: 'Çıkış yap', ru: 'Выйти', fi: 'Kirjaudu ulos', cs: 'Odhlásit se',
  is: 'Skrá út', hu: 'Kijelentkezés', id: 'Keluar', ar: 'تسجيل الخروج', th: 'ออกจากระบบ', ko: '로그아웃',
};
export function getAccountSignOutLabel(language: InfoLanguage): string {
  return SIGN_OUT[language];
}

const ACCOUNT_TITLE: Record<InfoLanguage, string> = {
  en: 'Account', el: 'Λογαριασμός', fr: 'Compte', nl: 'Account',
  zh: '账户', it: 'Account', de: 'Konto', sv: 'Konto', da: 'Konto', no: 'Konto',
  pl: 'Konto', ja: 'アカウント', he: 'חשבון', es: 'Cuenta', pt: 'Conta',
  hi: 'खाता', tr: 'Hesap', ru: 'Аккаунт', fi: 'Tili', cs: 'Účet',
  is: 'Aðgangur', hu: 'Fiók', id: 'Akun', ar: 'الحساب', th: 'บัญชี', ko: '계정',
};
export function getAccountTitleLabel(language: InfoLanguage): string {
  return ACCOUNT_TITLE[language];
}
