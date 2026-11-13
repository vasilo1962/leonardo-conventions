import type { InfoLanguage } from '@/lib/info-popup-translations';

const instructions: Record<InfoLanguage, [string, string]> = {
 el: ['Για να συνεχίσεις, πάτησε Enter.', 'Για να συνεχίσεις, κάνε διπλό πάτημα οπουδήποτε στην οθόνη.'],
 en: ['To continue, press Enter.', 'To continue, double-tap anywhere on the screen.'],
 fr: ['Pour continuer, appuie sur Entrée.', 'Pour continuer, touche deux fois n’importe où sur l’écran.'],
 nl: ['Druk op Enter om verder te gaan.', 'Tik tweemaal ergens op het scherm om verder te gaan.'],
 zh: ['按 Enter 键继续。', '在屏幕任意位置轻点两下以继续。'],
 it: ['Per continuare, premi Invio.', 'Per continuare, tocca due volte un punto qualsiasi dello schermo.'],
 de: ['Drücke zum Fortfahren Enter.', 'Tippe zum Fortfahren zweimal auf eine beliebige Stelle des Bildschirms.'],
 sv: ['Tryck på Enter för att fortsätta.', 'Dubbeltryck var som helst på skärmen för att fortsätta.'],
 da: ['Tryk på Enter for at fortsætte.', 'Tryk to gange hvor som helst på skærmen for at fortsætte.'],
 no: ['Trykk Enter for å fortsette.', 'Dobbelttrykk hvor som helst på skjermen for å fortsette.'],
 pl: ['Aby kontynuować, naciśnij Enter.', 'Aby kontynuować, stuknij dwukrotnie w dowolnym miejscu ekranu.'],
 ja: ['続けるには Enter キーを押してください。', '続けるには画面の任意の場所をダブルタップしてください。'],
 he: ['כדי להמשיך, לחץ Enter.', 'כדי להמשיך, הקש פעמיים בכל מקום במסך.'],
 es: ['Para continuar, pulsa Enter.', 'Para continuar, toca dos veces en cualquier lugar de la pantalla.'],
 pt: ['Para continuar, prime Enter.', 'Para continuar, toque duas vezes em qualquer lugar da tela.'],
 hi: ['जारी रखने के लिए Enter दबाओ।', 'जारी रखने के लिए स्क्रीन पर कहीं भी दो बार टैप करो।'],
 tr: ['Devam etmek için Enter tuşuna bas.', 'Devam etmek için ekranın herhangi bir yerine iki kez dokunun.'],
 ru: ['Чтобы продолжить, нажми Enter.', 'Чтобы продолжить, дважды коснитесь любого места на экране.'],
 fi: ['Jatka painamalla Enter.', 'Jatka kaksoisnapauttamalla mitä tahansa kohtaa näytöllä.'],
 cs: ['Pokračuj stisknutím Enter.', 'Pokračuj dvojitým klepnutím kdekoli na obrazovce.'],
 is: ['Ýttu á Enter til að halda áfram.', 'Tvípikkaðu hvar sem er á skjánum til að halda áfram.'],
 hu: ['A folytatáshoz nyomd meg az Entert.', 'A folytatáshoz koppints duplán bárhol a képernyőn.'],
 id: ['Untuk melanjutkan, tekan Enter.', 'Untuk melanjutkan, ketuk dua kali di mana saja pada layar.'],
 ar: ['للمتابعة، اضغط Enter.', 'للمتابعة، انقر مرتين في أي مكان على الشاشة.'],
 th: ['กด Enter เพื่อดำเนินต่อ', 'แตะสองครั้งที่ใดก็ได้บนหน้าจอเพื่อดำเนินต่อ'],
 ko: ['계속하려면 Enter를 누르세요.', '계속하려면 화면 아무 곳이나 두 번 탭하세요.'],
};
export function popupActionInstruction(language: InfoLanguage, touch: boolean) {
 return instructions[language][touch ? 1 : 0];
}
export function popupPrimaryAction(root: HTMLElement, includeDisabled = false): HTMLElement | null {
 // An editable popup or a choice between actions must not acquire a default action.
 if (root.querySelector('input, textarea, select, [contenteditable="true"], [role="textbox"]')) return null;
 const buttons = Array.from(root.querySelectorAll<HTMLElement>('button, [role="button"], [tabindex="0"]'))
  .filter(button => !button.closest('[data-testid="popup-auxiliary-control"]')
   && !button.closest('[aria-hidden="true"]') && button.getClientRects().length > 0);
 return buttons.length === 1 && (includeDisabled || (buttons[0].getAttribute('aria-disabled') !== 'true' && !buttons[0].hasAttribute('disabled'))) ? buttons[0] : null;
}
