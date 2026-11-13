import {
  getPlayerInfoLanguage,
  type InfoLanguage,
} from '@/lib/info-popup-translations';

type DuelDashboardExtraCopy = {
  newDuel: string;
  endsIn: string;
  completeBefore: string;
  dealCount: string;
  you: string;
  youMarker: string;
  invitationLimit: string;
  createError: string;
  hourUnit: string;
  minuteUnit: string;
};

type DuelDashboardBaseCopy = {
  title: string;
  intro: string;
  active: string;
  completedToday: string;
  invitationsSent: string;
  start: string;
  continue: string;
  waitingFor: string;
  viewResults: string;
  loadError: string;
  startError: string;
  expired: string;
  duplicateActive: string;
};

export type DuelDashboardCopy = DuelDashboardBaseCopy & DuelDashboardExtraCopy;

const keys: (keyof DuelDashboardBaseCopy)[] = ["title","intro","active","completedToday","invitationsSent","start","continue","waitingFor","viewResults","loadError","startError","expired","duplicateActive"];

function row(values: string[]): DuelDashboardBaseCopy {
  return Object.fromEntries(
    keys.map((key, index) => [key, values[index]])
  ) as DuelDashboardBaseCopy;
}

const copies: Record<InfoLanguage, DuelDashboardBaseCopy> = {
  en: row(["CHALLENGES","Challenge another player.\nPlay the same deals as declarer.\nCompare your total scores.","ACTIVE CHALLENGES","TODAY’S COMPLETED CHALLENGES","INVITATIONS PENDING","START","CONTINUE","WAITING FOR {opponent}","VIEW RESULTS","Could not load your Challenges.","Could not start this Challenge. Please try again.","This Challenge has expired.","{opponent} couldn’t accept this invitation because the two of you already have an active Challenge. You can challenge {opponent} again after it is complete."]),
  fr: row(["DÉFIS","Défiez un autre joueur.\nJouez les mêmes donnes comme déclarant.\nComparez vos scores totaux.","DÉFIS EN COURS","DÉFIS TERMINÉS AUJOURD’HUI","INVITATIONS EN ATTENTE","COMMENCER","CONTINUER","EN ATTENTE DE {opponent}","VOIR LES RÉSULTATS","Impossible de charger vos Défis.","Impossible de démarrer ce Défi. Réessayez.","Ce Défi a expiré.","{opponent} n’a pas pu accepter cette invitation, car vous avez déjà un Défi en cours ensemble. Vous pourrez défier à nouveau {opponent} une fois celui-ci terminé."]),
  nl: row(["UITDAGINGEN","Daag een andere speler uit.\nSpeel dezelfde spellen als leider.\nVergelijk jullie totaalscores.","ACTIEVE UITDAGINGEN","VANDAAG VOLTOOIDE UITDAGINGEN","OPENSTAANDE UITNODIGINGEN","START","DOORGAAN","WACHTEN OP {opponent}","BEKIJK RESULTATEN","Je Uitdagingen konden niet worden geladen.","Deze Uitdaging kon niet worden gestart. Probeer opnieuw.","Deze Uitdaging is verlopen.","{opponent} kon deze uitnodiging niet accepteren omdat jullie samen al een actieve Uitdaging hebben. Je kunt {opponent} opnieuw uitdagen wanneer die is voltooid."]),
  zh: row(["挑战","挑战另一位玩家。\n以庄家身份打相同的副牌。\n比较双方总分。","进行中的挑战","今日已完成的挑战","待接受的邀请","开始","继续","等待 {opponent}","查看结果","无法加载你的挑战。","无法开始此挑战，请重试。","此挑战已过期。","{opponent} 无法接受此邀请，因为你们两人已有一场进行中的挑战。完成后可再次挑战 {opponent}。"]),
  it: row(["SFIDE","Sfida un altro giocatore.\nGiocate le stesse mani come dichiaranti.\nConfrontate i punteggi totali.","SFIDE ATTIVE","SFIDE COMPLETATE OGGI","INVITI IN ATTESA","INIZIA","CONTINUA","IN ATTESA DI {opponent}","VEDI RISULTATI","Impossibile caricare le tue Sfide.","Impossibile iniziare questa Sfida. Riprova.","Questa Sfida è scaduta.","{opponent} non ha potuto accettare l’invito perché avete già una Sfida attiva tra voi. Potrai sfidare di nuovo {opponent} al termine."]),
  de: row(["HERAUSFORDERUNGEN","Fordere einen anderen Spieler heraus.\nSpielt dieselben Boards als Alleinspieler.\nVergleicht eure Gesamtpunkte.","AKTIVE HERAUSFORDERUNGEN","HEUTE BEENDETE HERAUSFORDERUNGEN","AUSSTEHENDE EINLADUNGEN","STARTEN","FORTSETZEN","WARTEN AUF {opponent}","ERGEBNISSE ANZEIGEN","Deine Herausforderungen konnten nicht geladen werden.","Diese Herausforderung konnte nicht gestartet werden. Versuche es erneut.","Diese Herausforderung ist abgelaufen.","{opponent} konnte die Einladung nicht annehmen, weil ihr beide bereits eine aktive Herausforderung miteinander habt. Nach deren Ende kannst du {opponent} erneut herausfordern."]),
  sv: row(["UTMANINGAR","Utmana en annan spelare.\nSpela samma givar som spelförare.\nJämför era totalpoäng.","AKTIVA UTMANINGAR","DAGENS AVSLUTADE UTMANINGAR","VÄNTANDE INBJUDNINGAR","STARTA","FORTSÄTT","VÄNTAR PÅ {opponent}","VISA RESULTAT","Det gick inte att läsa in dina Utmaningar.","Det gick inte att starta denna Utmaning. Försök igen.","Denna Utmaning har löpt ut.","{opponent} kunde inte acceptera inbjudan eftersom ni två redan har en aktiv Utmaning tillsammans. Du kan utmana {opponent} igen när den är klar."]),
  da: row(["UDFORDRINGER","Udfordr en anden spiller.\nSpil de samme spil som spilfører.\nSammenlign jeres samlede scorer.","AKTIVE UDFORDRINGER","DAGENS AFSLUTTEDE UDFORDRINGER","AFVENTENDE INVITATIONER","START","FORTSÆT","VENTER PÅ {opponent}","SE RESULTATER","Dine Udfordringer kunne ikke indlæses.","Denne Udfordring kunne ikke startes. Prøv igen.","Denne Udfordring er udløbet.","{opponent} kunne ikke acceptere invitationen, fordi I to allerede har en aktiv Udfordring sammen. Du kan udfordre {opponent} igen, når den er afsluttet."]),
  no: row(["UTFORDRINGER","Utfordre en annen spiller.\nSpill de samme spillene som spillefører.\nSammenlign totalscorene deres.","AKTIVE UTFORDRINGER","DAGENS FULLFØRTE UTFORDRINGER","VENTENDE INVITASJONER","START","FORTSETT","VENTER PÅ {opponent}","VIS RESULTATER","Kunne ikke laste inn Utfordringene dine.","Kunne ikke starte denne Utfordringen. Prøv igjen.","Denne Utfordringen har utløpt.","{opponent} kunne ikke godta invitasjonen fordi dere to allerede har en aktiv Utfordring sammen. Du kan utfordre {opponent} igjen når den er fullført."]),
  pl: row(["WYZWANIA","Rzuć wyzwanie innemu graczowi.\nZagrajcie te same rozdania jako rozgrywający.\nPorównajcie wyniki łączne.","AKTYWNE WYZWANIA","DZISIEJSZE ZAKOŃCZONE WYZWANIA","OCZEKUJĄCE ZAPROSZENIA","START","KONTYNUUJ","OCZEKIWANIE NA {opponent}","ZOBACZ WYNIKI","Nie udało się wczytać Wyzwań.","Nie udało się rozpocząć tego Wyzwania. Spróbuj ponownie.","To Wyzwanie wygasło.","{opponent} nie mógł przyjąć zaproszenia, ponieważ macie już wspólny aktywne Wyzwanie. Po jego zakończeniu możesz ponownie wyzwać {opponent}."]),
  ja: row(["チャレンジ","別のプレイヤーに挑戦。\nディクレアラーとして同じボードをプレイ。\n合計スコアを比較します。","進行中のチャレンジ","今日完了したチャレンジ","承認待ちの招待","開始","続ける","{opponent} を待っています","結果を見る","チャレンジを読み込めませんでした。","このチャレンジを開始できませんでした。もう一度お試しください。","このチャレンジは期限切れです。","あなたと {opponent} の間ですでに進行中のチャレンジがあるため、招待を承認できませんでした。完了後に再び {opponent} に挑戦できます。"]),
  he: row(["אתגרים","אתגרו שחקן אחר.\nשחקו את אותן חלוקות ככרוז.\nהשוו את הניקוד הכולל.","אתגרים פעילים","אתגרים שהושלמו היום","הזמנות ממתינות","התחלה","המשך","ממתינים ל-{opponent}","הצגת תוצאות","לא ניתן לטעון את האתגרים.","לא ניתן להתחיל את האתגר. נסו שוב.","תוקף האתגר פג.","{opponent} לא הצליח לקבל את ההזמנה כי לשניכם כבר יש אתגר פעיל זה עם זה. תוכלו לאתגר שוב את {opponent} לאחר סיומו."]),
  es: row(["DESAFÍOS","Desafía a otro jugador.\nJugad las mismas manos como declarantes.\nComparad vuestros resultados totales.","DESAFÍOS ACTIVOS","DESAFÍOS COMPLETADOS HOY","INVITACIONES PENDIENTES","EMPEZAR","CONTINUAR","ESPERANDO A {opponent}","VER RESULTADOS","No se pudieron cargar tus Desafíos.","No se pudo iniciar este Desafío. Inténtalo de nuevo.","Este Desafío ha caducado.","{opponent} no pudo aceptar esta invitación porque ya tenéis un Desafío activo entre vosotros. Podrás volver a desafiar a {opponent} cuando termine."]),
  pt: row(["DESAFIOS","Desafie outro jogador.\nJoguem as mesmas mãos como declarantes.\nComparem as pontuações totais.","DESAFIOS ATIVOS","DESAFIOS CONCLUÍDOS HOJE","CONVITES PENDENTES","COMEÇAR","CONTINUAR","AGUARDANDO {opponent}","VER RESULTADOS","Não foi possível carregar seus Desafios.","Não foi possível iniciar este Desafio. Tente novamente.","Este Desafio expirou.","{opponent} não pôde aceitar o convite porque vocês dois já têm um Desafio ativo entre si. Você poderá desafiar {opponent} novamente quando ele terminar."]),
  hi: row(["चुनौतियाँ","किसी अन्य खिलाड़ी को चुनौती दें।\nडिक्लेयरर के रूप में वही डील खेलें।\nअपने कुल स्कोर की तुलना करें।","सक्रिय चुनौतियाँ","आज पूरी हुई चुनौतियाँ","लंबित निमंत्रण","शुरू करें","जारी रखें","{opponent} की प्रतीक्षा","परिणाम देखें","आपकी चुनौतियाँ लोड नहीं हो सकीं।","यह चुनौती शुरू नहीं हो सकी। फिर प्रयास करें।","यह चुनौती समाप्त हो चुकी है।","{opponent} यह निमंत्रण स्वीकार नहीं कर सका क्योंकि आप दोनों के बीच पहले से एक सक्रिय चुनौती है। उसके पूरा होने के बाद आप {opponent} को फिर चुनौती दे सकते हैं।"]),
  tr: row(["MEYDAN OKUMALAR","Başka bir oyuncuya meydan oku.\nDeklaran olarak aynı eli oynayın.\nToplam skorlarınızı karşılaştırın.","AKTİF MEYDAN OKUMALAR","BUGÜN TAMAMLANAN MEYDAN OKUMALAR","BEKLEYEN DAVETLER","BAŞLA","DEVAM ET","{opponent} BEKLENİYOR","SONUÇLARI GÖR","Meydan okumaların yüklenemedi.","Bu Meydan okuma başlatılamadı. Tekrar dene.","Bu Meydan okumanın süresi doldu.","İkinizin arasında zaten aktif bir Meydan okuma olduğu için {opponent} daveti kabul edemedi. Tamamlandıktan sonra {opponent} adlı oyuncuya yeniden meydan okuyabilirsin."]),
  ru: row(["ВЫЗОВЫ","Бросьте вызов другому игроку.\nСыграйте те же сдачи разыгрывающим.\nСравните общие результаты.","АКТИВНЫЕ ВЫЗОВЫ","СЕГОДНЯШНИЕ ЗАВЕРШЁННЫЕ ВЫЗОВЫ","ПРИГЛАШЕНИЯ В ОЖИДАНИИ","НАЧАТЬ","ПРОДОЛЖИТЬ","ОЖИДАНИЕ {opponent}","ПОСМОТРЕТЬ РЕЗУЛЬТАТЫ","Не удалось загрузить ваши Вызовы.","Не удалось начать этот Вызов. Попробуйте снова.","Срок этого Вызова истёк.","{opponent} не смог принять приглашение, потому что между вами уже идёт Вызов. После его завершения вы сможете снова вызвать {opponent}."]),
  el: row(["ΠΡΟΚΛΗΣΕΙΣ","Προκάλεσε έναν άλλο παίκτη.\nΠαίξτε τις ίδιες διανομές ως εκτελεστές.\nΣυγκρίνετε τα συνολικά σκορ σας.","ΕΝΕΡΓΕΣ ΠΡΟΚΛΗΣΕΙΣ","ΣΗΜΕΡΙΝΕΣ ΟΛΟΚΛΗΡΩΜΕΝΕΣ ΠΡΟΚΛΗΣΕΙΣ","ΠΡΟΣΚΛΗΣΕΙΣ ΣΕ ΑΝΑΜΟΝΗ","ΕΝΑΡΞΗ","ΣΥΝΕΧΕΙΑ","ΑΝΑΜΟΝΗ ΓΙΑ {opponent}","ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ","Δεν ήταν δυνατή η φόρτωση των Προκλήσεών σου.","Δεν ήταν δυνατή η έναρξη αυτής της Πρόκλησης. Δοκίμασε ξανά.","Αυτή η Πρόκληση έχει λήξει.","Ο/Η {opponent} δεν μπόρεσε να αποδεχτεί την πρόσκληση, επειδή έχετε ήδη ενεργή Πρόκληση. Μπορείς να προκαλέσεις ξανά τον/την {opponent} όταν ολοκληρωθεί."]),
  fi: row(["HAASTEET","Haasta toinen pelaaja.\nPelatkaa samat jakoa pelinviejinä.\nVertailkaa kokonaispisteitänne.","AKTIIVISET HAASTEET","TÄNÄÄN PÄÄTTYNEET HAASTEET","ODOTTAVAT KUTSUT","ALOITA","JATKA","ODOTETAAN PELAAJAA {opponent}","NÄYTÄ TULOKSET","Haasteitasi ei voitu ladata.","Tätä Haastetta ei voitu aloittaa. Yritä uudelleen.","Tämä Haaste on vanhentunut.","{opponent} ei voinut hyväksyä kutsua, koska teillä kahdella on jo yhteinen aktiivinen Haaste. Voit haastaa pelaajan {opponent} uudelleen sen päätyttyä."]),
  cs: row(["VÝZVY","Vyzvěte jiného hráče.\nZahrajte stejné partie jako hlavní hráč.\nPorovnejte celkové výsledky.","AKTIVNÍ VÝZVY","DNEŠNÍ DOKONČENÉ VÝZVY","ČEKAJÍCÍ POZVÁNKY","ZAČÍT","POKRAČOVAT","ČEKÁ SE NA {opponent}","ZOBRAZIT VÝSLEDKY","Vaše Výzvy se nepodařilo načíst.","Tuto Výzvu se nepodařilo zahájit. Zkuste to znovu.","Platnost této Výzvy vypršela.","{opponent} nemohl přijmout pozvánku, protože spolu již máte aktivní Výzvu. Po jejím dokončení můžete hráče {opponent} vyzvat znovu."]),
  is: row(["ÁSKORANIR","Skoraðu á annan spilara.\nSpilið sömu spilin sem sagnhafar.\nBerið saman heildarskorin.","VIRKAR ÁSKORANIR","ÁSKORANIR LOKIÐ Í DAG","BOÐ Í BIÐ","BYRJA","HALDA ÁFRAM","BEÐIÐ EFTIR {opponent}","SKOÐA ÚRSLIT","Ekki tókst að hlaða Áskorununum þínum.","Ekki tókst að hefja þessa Áskorun. Reyndu aftur.","Þessi Áskorun er útrunnin.","{opponent} gat ekki samþykkt boðið því þið tvö eigið þegar virka Áskorun saman. Þú getur skorað aftur á {opponent} þegar henni lýkur."]),
  hu: row(["KIHÍVÁSOK","Hívj ki egy másik játékost.\nJátsszátok ugyanazt a leosztást felvevőként.\nHasonlítsátok össze az összpontszámotokat.","AKTÍV KIHÍVÁSOK","MA BEFEJEZETT KIHÍVÁSOK","FÜGGŐBEN LÉVŐ MEGHÍVÓK","KEZDÉS","FOLYTATÁS","VÁRAKOZÁS: {opponent}","EREDMÉNYEK","Nem sikerült betölteni a Kihívásokat.","Nem sikerült elindítani ezt a Kihívást. Próbáld újra.","Ez a Kihívás lejárt.","{opponent} nem tudta elfogadni a meghívást, mert már van egy aktív Kihívásotok egymással. A befejezése után újra kihívhatod {opponent} játékost."]),
  id: row(["TANTANGAN","Tantang pemain lain.\nMainkan papan yang sama sebagai declarer.\nBandingkan skor total kalian.","TANTANGAN AKTIF","TANTANGAN YANG SELESAI HARI INI","UNDANGAN MENUNGGU","MULAI","LANJUTKAN","MENUNGGU {opponent}","LIHAT HASIL","Tantangan Anda tidak dapat dimuat.","Tantangan ini tidak dapat dimulai. Coba lagi.","Tantangan ini telah kedaluwarsa.","{opponent} tidak dapat menerima undangan karena kalian berdua sudah memiliki Tantangan aktif bersama. Anda dapat menantang {opponent} lagi setelah selesai."]),
  ar: row(["التحديات","تحدَّ لاعبًا آخر.\nالعبا التوزيعات نفسها كمعلنين.\nقارنا مجموع النقاط.","التحديات النشطة","تحديات اليوم المكتملة","الدعوات المعلقة","ابدأ","تابع","بانتظار {opponent}","عرض النتائج","تعذر تحميل تحدياتك.","تعذر بدء هذا التحدي. حاول مجددًا.","انتهت صلاحية هذا التحدي.","لم يتمكن {opponent} من قبول الدعوة لأن بينكما تحدٍ نشط بالفعل. يمكنك تحدي {opponent} مجددًا بعد انتهائه."]),
  th: row(["การแข่งขันท้าทาย","ท้าผู้เล่นคนอื่น\nเล่นไพ่ดีลเดียวกันในฐานะดีแคลเรอร์\nเปรียบเทียบคะแนนรวม","การแข่งขันท้าทายที่กำลังเล่น","การแข่งขันท้าทายที่จบวันนี้","คำเชิญที่รอการตอบรับ","เริ่ม","เล่นต่อ","รอ {opponent}","ดูผลลัพธ์","ไม่สามารถโหลดการแข่งขันท้าทายของคุณได้","ไม่สามารถเริ่มการแข่งขันท้าทายนี้ได้ โปรดลองอีกครั้ง","การแข่งขันท้าทายนี้หมดอายุแล้ว","{opponent} ไม่สามารถรับคำเชิญได้ เพราะคุณทั้งสองมีการแข่งขันท้าทายที่กำลังเล่นร่วมกันอยู่แล้ว คุณสามารถท้า {opponent} อีกครั้งเมื่อจบแล้ว"]),
  ko: row(["챌린지","다른 플레이어에게 도전하세요.\n선언자로서 같은 보드를 플레이하세요.\n총점을 비교하세요.","진행 중인 챌린지","오늘 완료한 챌린지","수락 대기 중인 초대","시작","계속","{opponent} 기다리는 중","결과 보기","챌린지를 불러오지 못했습니다.","이 챌린지를 시작하지 못했습니다. 다시 시도하세요.","이 챌린지는 만료되었습니다.","두 분 사이에 이미 진행 중인 챌린지가 있어 {opponent} 님이 초대를 수락하지 못했습니다. 완료 후 {opponent} 님에게 다시 도전할 수 있습니다."]),
};


const extraCopies: Record<InfoLanguage, DuelDashboardExtraCopy> = {
  en: {
    newDuel: "NEW CHALLENGE",
    endsIn: "End in: {time}",
    completeBefore: "Both players must complete all {count} deals within the next {time}.",
    dealCount: "Number of deals",
    you: "You",
    youMarker: " (YOU)",
    invitationLimit: "You've sent 4 invitations in the last hour. You can create another in {minutes} minutes.",
    createError: "Could not create the invitation. Please try again.",
    hourUnit: "h",
    minuteUnit: "m",
  },
  fr: {
    newDuel: "NOUVEAU DÉFI",
    endsIn: "Se terminent dans : {time}",
    completeBefore: "Les deux joueurs doivent terminer les {count} donnes dans les {time} à venir.",
    dealCount: "Nombre de donnes",
    you: "Vous",
    youMarker: " (VOUS)",
    invitationLimit: "Vous avez envoyé 4 invitations au cours de la dernière heure. Vous pourrez en créer une autre dans {minutes} minutes.",
    createError: "Impossible de créer l'invitation. Réessayez.",
    hourUnit: "h",
    minuteUnit: "min",
  },
  nl: {
    newDuel: "NIEUWE UITDAGING",
    endsIn: "Eindigen over: {time}",
    completeBefore: "Beide spelers moeten alle {count} spellen binnen de komende {time} voltooien.",
    dealCount: "Aantal spellen",
    you: "Jij",
    youMarker: " (JIJ)",
    invitationLimit: "Je hebt het afgelopen uur 4 uitnodigingen verstuurd. Over {minutes} minuten kun je er weer een maken.",
    createError: "De uitnodiging kon niet worden gemaakt. Probeer het opnieuw.",
    hourUnit: "u",
    minuteUnit: "min",
  },
  zh: {
    newDuel: "新挑战",
    endsIn: "距结束：{time}",
    completeBefore: "双方必须在接下来的{time}内完成全部{count}副牌。",
    dealCount: "牌局数量",
    you: "你",
    youMarker: "（你）",
    invitationLimit: "过去一小时你已发送 4 份邀请。请在 {minutes} 分钟后再创建邀请。",
    createError: "无法创建邀请，请重试。",
    hourUnit: "小时",
    minuteUnit: "分",
  },
  it: {
    newDuel: "NUOVA SFIDA",
    endsIn: "Terminano tra: {time}",
    completeBefore: "Entrambi i giocatori devono completare tutte le {count} mani entro le prossime {time}.",
    dealCount: "Numero di mani",
    you: "Tu",
    youMarker: " (TU)",
    invitationLimit: "Hai inviato 4 inviti nell'ultima ora. Potrai crearne un altro tra {minutes} minuti.",
    createError: "Impossibile creare l'invito. Riprova.",
    hourUnit: "h",
    minuteUnit: "min",
  },
  de: {
    newDuel: "NEUE HERAUSFORDERUNG",
    endsIn: "Enden in: {time}",
    completeBefore: "Beide Spieler müssen alle {count} Boards innerhalb der nächsten {time} abschließen.",
    dealCount: "Anzahl der Boards",
    you: "Du",
    youMarker: " (DU)",
    invitationLimit: "Du hast in der letzten Stunde 4 Einladungen verschickt. In {minutes} Minuten kannst du eine weitere erstellen.",
    createError: "Die Einladung konnte nicht erstellt werden. Versuche es erneut.",
    hourUnit: "Std.",
    minuteUnit: "Min.",
  },
  sv: {
    newDuel: "NY UTMANING",
    endsIn: "Slutar om: {time}",
    completeBefore: "Båda spelarna måste slutföra alla {count} givar inom de kommande {time}.",
    dealCount: "Antal givar",
    you: "Du",
    youMarker: " (DU)",
    invitationLimit: "Du har skickat 4 inbjudningar den senaste timmen. Du kan skapa en ny om {minutes} minuter.",
    createError: "Det gick inte att skapa inbjudan. Försök igen.",
    hourUnit: "tim",
    minuteUnit: "min",
  },
  da: {
    newDuel: "NY UDFORDRING",
    endsIn: "Slutter om: {time}",
    completeBefore: "Begge spillere skal gennemføre alle {count} spil inden for de næste {time}.",
    dealCount: "Antal spil",
    you: "Du",
    youMarker: " (DIG)",
    invitationLimit: "Du har sendt 4 invitationer inden for den sidste time. Du kan oprette en ny om {minutes} minutter.",
    createError: "Invitationen kunne ikke oprettes. Prøv igen.",
    hourUnit: "t",
    minuteUnit: "min",
  },
  no: {
    newDuel: "NY UTFORDRING",
    endsIn: "Avsluttes om: {time}",
    completeBefore: "Begge spillerne må fullføre alle {count} spillene innen de neste {time}.",
    dealCount: "Antall spill",
    you: "Du",
    youMarker: " (DEG)",
    invitationLimit: "Du har sendt 4 invitasjoner den siste timen. Du kan opprette en ny om {minutes} minutter.",
    createError: "Kunne ikke opprette invitasjonen. Prøv igjen.",
    hourUnit: "t",
    minuteUnit: "min",
  },
  pl: {
    newDuel: "NOWE WYZWANIE",
    endsIn: "Kończą się za: {time}",
    completeBefore: "Obaj gracze muszą ukończyć wszystkie {count} rozdania w ciągu najbliższych {time}.",
    dealCount: "Liczba rozdań",
    you: "Ty",
    youMarker: " (TY)",
    invitationLimit: "W ostatniej godzinie wysłano 4 zaproszenia. Kolejne możesz utworzyć za {minutes} min.",
    createError: "Nie udało się utworzyć zaproszenia. Spróbuj ponownie.",
    hourUnit: "godz.",
    minuteUnit: "min",
  },
  ja: {
    newDuel: "新しいチャレンジ",
    endsIn: "終了まで：{time}",
    completeBefore: "両プレイヤーは今から{time}以内に全{count}ボードを完了してください。",
    dealCount: "ボード数",
    you: "あなた",
    youMarker: "（あなた）",
    invitationLimit: "過去1時間に4件の招待を送信しました。あと{minutes}分で次の招待を作成できます。",
    createError: "招待を作成できませんでした。もう一度お試しください。",
    hourUnit: "時間",
    minuteUnit: "分",
  },
  he: {
    newDuel: "אתגר חדש",
    endsIn: "מסתיימים בעוד: {time}",
    completeBefore: "שני השחקנים חייבים להשלים את כל {count} החלוקות בתוך {time} הקרובות.",
    dealCount: "מספר חלוקות",
    you: "אתם",
    youMarker: " (אתם)",
    invitationLimit: "שלחתם 4 הזמנות בשעה האחרונה. ניתן ליצור הזמנה נוספת בעוד {minutes} דקות.",
    createError: "לא ניתן ליצור את ההזמנה. נסו שוב.",
    hourUnit: "ש׳",
    minuteUnit: "דק׳",
  },
  es: {
    newDuel: "NUEVO DESAFÍO",
    endsIn: "Terminan en: {time}",
    completeBefore: "Ambos jugadores deben completar las {count} manos dentro de las próximas {time}.",
    dealCount: "Número de manos",
    you: "Tú",
    youMarker: " (TÚ)",
    invitationLimit: "Has enviado 4 invitaciones en la última hora. Podrás crear otra en {minutes} minutos.",
    createError: "No se pudo crear la invitación. Inténtalo de nuevo.",
    hourUnit: "h",
    minuteUnit: "min",
  },
  pt: {
    newDuel: "NOVO DESAFIO",
    endsIn: "Terminam em: {time}",
    completeBefore: "Ambos os jogadores devem concluir as {count} mãos dentro das próximas {time}.",
    dealCount: "Número de mãos",
    you: "Você",
    youMarker: " (VOCÊ)",
    invitationLimit: "Você enviou 4 convites na última hora. Poderá criar outro em {minutes} minutos.",
    createError: "Não foi possível criar o convite. Tente novamente.",
    hourUnit: "h",
    minuteUnit: "min",
  },
  hi: {
    newDuel: "नई चुनौती",
    endsIn: "समाप्त होने में: {time}",
    completeBefore: "दोनों खिलाड़ियों को अगले {time} में सभी {count} डील पूरी करनी होंगी।",
    dealCount: "डील की संख्या",
    you: "आप",
    youMarker: " (आप)",
    invitationLimit: "आपने पिछले एक घंटे में 4 निमंत्रण भेजे हैं। आप {minutes} मिनट में अगला निमंत्रण बना सकते हैं।",
    createError: "निमंत्रण नहीं बनाया जा सका। कृपया फिर प्रयास करें।",
    hourUnit: "घं",
    minuteUnit: "मि",
  },
  tr: {
    newDuel: "YENİ MEYDAN OKUMA",
    endsIn: "Bitmesine: {time}",
    completeBefore: "Her iki oyuncu da önümüzdeki {time} içinde {count} elin tamamını bitirmelidir.",
    dealCount: "El sayısı",
    you: "Sen",
    youMarker: " (SEN)",
    invitationLimit: "Son bir saatte 4 davet gönderdin. {minutes} dakika sonra yeni bir davet oluşturabilirsin.",
    createError: "Davet oluşturulamadı. Lütfen tekrar dene.",
    hourUnit: "sa",
    minuteUnit: "dk",
  },
  ru: {
    newDuel: "НОВЫЙ ВЫЗОВ",
    endsIn: "Завершатся через: {time}",
    completeBefore: "Оба игрока должны завершить все {count} сдач в течение следующих {time}.",
    dealCount: "Количество сдач",
    you: "Вы",
    youMarker: " (ВЫ)",
    invitationLimit: "За последний час вы отправили 4 приглашения. Новое можно создать через {minutes} мин.",
    createError: "Не удалось создать приглашение. Попробуйте ещё раз.",
    hourUnit: "ч",
    minuteUnit: "мин",
  },
  el: {
    newDuel: "ΝΕΑ ΠΡΟΚΛΗΣΗ",
    endsIn: "ΛΗΓΟΥΝ ΣΕ: {time}",
    completeBefore: "Και οι δύο παίκτες πρέπει να ολοκληρώσετε και τις {count} διανομές μέσα στις επόμενες {time}.",
    dealCount: "Αριθμός διανομών",
    you: "Εσύ",
    youMarker: " (ΕΣΥ)",
    invitationLimit: "Έστειλες 4 προσκλήσεις την τελευταία ώρα. Μπορείς να δημιουργήσεις άλλη σε {minutes} λεπτά.",
    createError: "Δεν ήταν δυνατή η δημιουργία της πρόσκλησης. Δοκίμασε ξανά.",
    hourUnit: "ώ",
    minuteUnit: "λ",
  },
  fi: {
    newDuel: "UUSI HAASTE",
    endsIn: "Päättyvät: {time} kuluttua",
    completeBefore: "Molempien pelaajien on pelattava kaikki {count} jakoa seuraavan {time} aikana.",
    dealCount: "Jakojen määrä",
    you: "Sinä",
    youMarker: " (SINÄ)",
    invitationLimit: "Olet lähettänyt 4 kutsua viimeisen tunnin aikana. Voit luoda uuden {minutes} minuutin kuluttua.",
    createError: "Kutsun luominen epäonnistui. Yritä uudelleen.",
    hourUnit: "t",
    minuteUnit: "min",
  },
  cs: {
    newDuel: "NOVÁ VÝZVA",
    endsIn: "Končí za: {time}",
    completeBefore: "Oba hráči musí dokončit všech {count} rozdání během následujících {time}.",
    dealCount: "Počet rozdání",
    you: "Vy",
    youMarker: " (VY)",
    invitationLimit: "Za poslední hodinu jste odeslali 4 pozvánky. Další můžete vytvořit za {minutes} minut.",
    createError: "Pozvánku se nepodařilo vytvořit. Zkuste to znovu.",
    hourUnit: "h",
    minuteUnit: "min",
  },
  is: {
    newDuel: "NÝ ÁSKORUN",
    endsIn: "LÝKUR EFTIR: {time}",
    completeBefore: "Báðir leikmenn verða að ljúka öllum {count} spilunum innan næstu {time}.",
    dealCount: "Fjöldi spila",
    you: "Þú",
    youMarker: " (ÞÚ)",
    invitationLimit: "Þú hefur sent 4 boð á síðustu klukkustund. Þú getur búið til annað eftir {minutes} mínútur.",
    createError: "Ekki tókst að búa til boðið. Reyndu aftur.",
    hourUnit: "klst.",
    minuteUnit: "mín",
  },
  hu: {
    newDuel: "ÚJ KIHÍVÁS",
    endsIn: "Véget érnek: {time} múlva",
    completeBefore: "Mindkét játékosnak be kell fejeznie mind a(z) {count} leosztást a következő {time} alatt.",
    dealCount: "Leosztások száma",
    you: "Te",
    youMarker: " (TE)",
    invitationLimit: "Az elmúlt órában 4 meghívót küldtél. {minutes} perc múlva hozhatsz létre újat.",
    createError: "Nem sikerült létrehozni a meghívót. Próbáld újra.",
    hourUnit: "ó",
    minuteUnit: "p",
  },
  id: {
    newDuel: "TANTANGAN BARU",
    endsIn: "Berakhir dalam: {time}",
    completeBefore: "Kedua pemain harus menyelesaikan seluruh {count} papan dalam {time} ke depan.",
    dealCount: "Jumlah papan",
    you: "Kamu",
    youMarker: " (KAMU)",
    invitationLimit: "Kamu telah mengirim 4 undangan dalam satu jam terakhir. Kamu dapat membuat undangan lagi dalam {minutes} menit.",
    createError: "Undangan tidak dapat dibuat. Silakan coba lagi.",
    hourUnit: "j",
    minuteUnit: "mnt",
  },
  ar: {
    newDuel: "تحدٍ جديد",
    endsIn: "تنتهي خلال: {time}",
    completeBefore: "يجب على كلا اللاعبين إكمال جميع التوزيعات وعددها {count} خلال {time} القادمة.",
    dealCount: "عدد التوزيعات",
    you: "أنت",
    youMarker: " (أنت)",
    invitationLimit: "أرسلت 4 دعوات خلال الساعة الماضية. يمكنك إنشاء دعوة أخرى بعد {minutes} دقيقة.",
    createError: "تعذر إنشاء الدعوة. حاول مرة أخرى.",
    hourUnit: "س",
    minuteUnit: "د",
  },
  th: {
    newDuel: "การแข่งขันท้าทายใหม่",
    endsIn: "สิ้นสุดใน: {time}",
    completeBefore: "ผู้เล่นทั้งสองต้องเล่นให้ครบทั้ง {count} ดีลภายใน {time} ข้างหน้า",
    dealCount: "จำนวนดีล",
    you: "คุณ",
    youMarker: " (คุณ)",
    invitationLimit: "คุณส่งคำเชิญ 4 รายการในชั่วโมงที่ผ่านมา คุณจะสร้างคำเชิญใหม่ได้ในอีก {minutes} นาที",
    createError: "ไม่สามารถสร้างคำเชิญได้ โปรดลองอีกครั้ง",
    hourUnit: "ชม.",
    minuteUnit: "นาที",
  },
  ko: {
    newDuel: "새 챌린지",
    endsIn: "종료까지: {time}",
    completeBefore: "두 플레이어 모두 앞으로 {time} 이내에 {count}개 보드를 모두 완료해야 합니다.",
    dealCount: "보드 수",
    you: "나",
    youMarker: " (나)",
    invitationLimit: "지난 한 시간 동안 초대 4건을 보냈습니다. {minutes}분 후에 새 초대를 만들 수 있습니다.",
    createError: "초대를 만들지 못했습니다. 다시 시도하세요.",
    hourUnit: "시간",
    minuteUnit: "분",
  },
};

export function getDuelDashboardCopy(language: InfoLanguage = getPlayerInfoLanguage()): DuelDashboardCopy {
  return {
    ...(copies[language] ?? copies.en),
    ...(extraCopies[language] ?? extraCopies.en),
  };
}

export function formatDuelRemaining(milliseconds: number, language: InfoLanguage = getPlayerInfoLanguage()): string {
  const totalMinutes = Math.max(0, Math.ceil(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const locale = language === 'no' ? 'nb' : language;
  const parts = [
    ...(hours > 0 ? [new Intl.NumberFormat(locale, {
      style: 'unit', unit: 'hour', unitDisplay: 'long',
    }).format(hours)] : []),
    new Intl.NumberFormat(locale, {
      style: 'unit', unit: 'minute', unitDisplay: 'long',
    }).format(minutes),
  ];
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(parts);
}
