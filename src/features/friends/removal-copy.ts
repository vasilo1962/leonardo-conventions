import type { InfoLanguage } from '@/lib/info-popup-translations';

const rows: Record<InfoLanguage, readonly [string, string, string]> = {
  en: ['Remove friend', 'Remove', 'Remove {username} from your friends?'],
  el: ['Αφαίρεση φίλου', 'Αφαίρεση', 'Να αφαιρεθεί ο/η {username} από τους φίλους σου;'],
  fr: ['Retirer un ami', 'Retirer', 'Retirer {username} de tes amis ?'],
  nl: ['Vriend verwijderen', 'Verwijderen', '{username} uit je vrienden verwijderen?'],
  zh: ['移除好友', '移除', '要将{username}从好友中移除吗？'],
  it: ['Rimuovi amico', 'Rimuovi', 'Vuoi rimuovere {username} dai tuoi amici?'],
  de: ['Freund entfernen', 'Entfernen', 'Möchtest du {username} aus deiner Freundesliste entfernen?'],
  sv: ['Ta bort vän', 'Ta bort', 'Vill du ta bort {username} från dina vänner?'],
  da: ['Fjern ven', 'Fjern', 'Vil du fjerne {username} fra dine venner?'],
  no: ['Fjern venn', 'Fjern', 'Vil du fjerne {username} fra vennene dine?'],
  pl: ['Usuń znajomego', 'Usuń', 'Czy chcesz usunąć {username} ze znajomych?'],
  ja: ['友達を削除', '削除', '{username}を友達から削除しますか？'],
  he: ['הסרה מרשימת החברים', 'הסרה', 'להסיר את {username} מרשימת החברים שלך?'],
  es: ['Eliminar amigo', 'Eliminar', '¿Quieres eliminar a {username} de tus amigos?'],
  pt: ['Remover amigo', 'Remover', 'Queres remover {username} dos teus amigos?'],
  hi: ['मित्र हटाओ', 'हटाओ', 'क्या तुम {username} को अपने मित्रों से हटाना चाहते हो?'],
  tr: ['Arkadaşı kaldır', 'Kaldır', '{username} adlı kişiyi arkadaşlarından kaldırmak istiyor musun?'],
  ru: ['Удалить друга', 'Удалить', 'Удалить {username} из твоих друзей?'],
  fi: ['Poista ystävä', 'Poista', 'Haluatko poistaa käyttäjän {username} ystävistäsi?'],
  cs: ['Odebrat přítele', 'Odebrat', 'Chceš odebrat {username} ze svých přátel?'],
  is: ['Fjarlægja vin', 'Fjarlægja', 'Viltu fjarlægja {username} af vinalistanum þínum?'],
  hu: ['Barát eltávolítása', 'Eltávolítás', 'Eltávolítod {username} felhasználót a barátaid közül?'],
  id: ['Hapus teman', 'Hapus', 'Hapus {username} dari daftar temanmu?'],
  ar: ['إزالة صديق', 'إزالة', 'هل تريد إزالة {username} من أصدقائك؟'],
  th: ['ลบเพื่อน', 'ลบ', 'ต้องการลบ {username} ออกจากเพื่อนของคุณไหม?'],
  ko: ['친구 삭제', '삭제', '{username}님을 친구에서 삭제할까요?'],
};

export function getFriendRemovalCopy(language: InfoLanguage, username: string) {
  const [label, remove, message] = rows[language];
  return { label: label + ': ' + username, remove, message: message.replace('{username}', () => username) };
}
