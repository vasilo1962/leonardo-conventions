import { getAccountPresentationRevision, getEnglishAccountPreview, subscribeAccountPresentation } from '@/lib/account-presentation';

export const INFO_LANGUAGES = [
  'en','fr','nl','zh','it','de','sv','da','no','pl','ja','he','es','pt','hi','tr','ru','el','fi','cs','is','hu','id','ar','th','ko',
] as const;

export type InfoLanguage = typeof INFO_LANGUAGES[number];
export type InfoMessageKey =
  | 'normalTournament'
  | 'speedball'
  | 'visibleCards'
  | 'slamOnly'
  | 'duel'
  | 'tournamentResults'
  | 'dailyLeaderboard'
  | 'leonardoLeaderboard'
  | 'defenders';

type Copy = {
  tournamentTitle: string;
  resultsTitle: string;
  defendersTitle: string;
  close: string;
  english: string;
  messages: Record<InfoMessageKey, string>;
};

const en: Copy = {
  tournamentTitle: 'TOURNAMENT INFO',
  resultsTitle: 'RESULTS INFO',
  defendersTitle: 'THE DEFENDERS',
  close: 'Close',
  english: 'English',
  messages: {
    normalTournament: 'Play {count} deals before this Tournament ends. Your result updates after every completed deal. You must complete every deal to appear in Results. Retry is for practice only and never changes your official score.',
    speedball: 'Play as many deals as you can before time expires. Your raw scores are added across all completed deals. Every completed deal counts in Results. Retry is for practice only and never changes your official score.',
    visibleCards: "Play {count} deals with both defenders' cards visible. Make the maximum tricks on every deal to appear in Results. There is no ranking, and this Tournament does not use your Tournament allowance.",
    slamOnly: "Play {count} slam deals with the defenders' cards hidden. Your IMPs and position update after every completed deal. The result is included in the Leaderboard.",
    duel: 'Play {count} deals as declarer. Your opponent plays the same deals. Compare your total scores.',
    tournamentResults: 'Here you can see the current Tournament ranking and results. Select a player to view the score for each deal.',
    dailyLeaderboard: 'Here you can see the combined Leaderboard from completed Tournaments in the current Leonardo Bridge day.',
    leonardoLeaderboard: "Practice and completed Tournaments count.\n\nToday: from 00:00 UTC.\nMonthly: from the first day of the current month at 00:00 UTC.\nAll-time: all recorded points.\n\nHigher totals rank first. Exactly equal totals share the same position, before rounding to two decimal places. Guests do not appear in leaderboards.",
    defenders: '{west} and {east} are computer-controlled defenders. Their names come from {source}.',
  },
};

const copies: Record<InfoLanguage, Copy> = {
  en,
  fr: {
    tournamentTitle: 'INFORMATIONS DU TOURNOI', resultsTitle: 'INFORMATIONS SUR LES RÉSULTATS', defendersTitle: 'LES DÉFENSEURS', close: 'Fermer', english: 'English',
    messages: {
      normalTournament: "Jouez {count} donnes avant la fin de ce tournoi. Votre résultat est actualisé après chaque donne terminée. Vous devez terminer toutes les donnes pour apparaître dans les résultats. Retry sert uniquement à l’entraînement et ne modifie jamais votre score officiel.",
      speedball: "Jouez autant de donnes que possible avant la fin du temps. Vos scores bruts sont additionnés sur toutes les donnes terminées. Chaque donne terminée compte dans les résultats. Retry sert uniquement à l’entraînement et ne modifie jamais votre score officiel.",
      visibleCards: "Jouez {count} donnes avec les cartes des deux défenseurs visibles. Réalisez le maximum de levées à chaque donne pour apparaître dans les résultats. Il n’y a pas de classement et ce tournoi ne réduit pas votre quota de tournois.",
      slamOnly: "Jouez {count} donnes de chelem avec les cartes des défenseurs cachées. Vos IMP et votre position sont actualisés après chaque donne terminée. Le résultat compte pour le classement quotidien.",
      duel: "Jouez {count} donnes comme déclarant. Votre adversaire joue les mêmes donnes. Comparez vos scores totaux.",
      tournamentResults: "Vous voyez ici le classement et les résultats actuels du tournoi. Sélectionnez un joueur pour voir son score à chaque donne.",
      dailyLeaderboard: "Vous voyez ici le classement quotidien combiné des tournois terminés pendant la journée Leonardo Bridge en cours.",
      leonardoLeaderboard: "L’entraînement et les tournois terminés sont pris en compte.\n\nQuotidien : aujourd’hui depuis 00:00 UTC.\nMensuel : depuis le premier jour du mois en cours à 00:00 UTC.\nDepuis le début : tous les points enregistrés.\n\nLes totaux les plus élevés sont classés en premier. Les totaux exactement égaux partagent la même place, avant l’arrondi à deux décimales. Les invités ne figurent pas dans les classements.",
      defenders: "{west} et {east} sont des défenseurs contrôlés par l’ordinateur. Leurs noms viennent de {source}.",
    },
  },
  nl: {
    tournamentTitle: 'TOERNOOI-INFORMATIE', resultsTitle: 'RESULTATEN-INFORMATIE', defendersTitle: 'DE TEGENSTANDERS', close: 'Sluiten', english: 'English',
    messages: {
      normalTournament: 'Speel {count} spellen voordat dit toernooi eindigt. Je resultaat wordt na elk voltooid spel bijgewerkt. Je moet alle spellen voltooien om in de resultaten te komen. Retry is alleen om te oefenen en verandert je officiële score nooit.',
      speedball: 'Speel zoveel mogelijk spellen voordat de tijd om is. Je ruwe scores van alle voltooide spellen worden opgeteld. Elk voltooid spel telt mee in de resultaten. Retry is alleen om te oefenen en verandert je officiële score nooit.',
      visibleCards: 'Speel {count} spellen met de kaarten van beide tegenstanders zichtbaar. Maak op elk spel het maximale aantal slagen om in de resultaten te komen. Er is geen ranglijst en dit toernooi gebruikt je toernooilimiet niet.',
      slamOnly: 'Speel {count} slemspellen met de kaarten van de tegenstanders verborgen. Je IMPs en positie worden na elk voltooid spel bijgewerkt. Het resultaat telt mee voor het Leaderboard.',
      duel: 'Speel {count} spellen als leider. Je tegenstander speelt dezelfde spellen. Vergelijk jullie totaalscores.',
      tournamentResults: 'Hier zie je de huidige toernooiranglijst en resultaten. Selecteer een speler om de score per spel te bekijken.',
      dailyLeaderboard: 'Hier zie je het gecombineerde Leaderboard van voltooide toernooien in de huidige Leonardo Bridge-dag.',
      leonardoLeaderboard: "Practice en voltooide toernooien tellen mee.\n\nDagelijks: vandaag vanaf 00:00 UTC.\nMaandelijks: vanaf de eerste dag van de huidige maand om 00:00 UTC.\nAltijd: alle geregistreerde punten.\n\nHogere totalen staan bovenaan. Exact gelijke totalen delen dezelfde plaats, vóór afronding op twee decimalen. Gasten verschijnen niet in de ranglijsten.",
      defenders: '{west} en {east} zijn computergestuurde tegenstanders. Hun namen komen uit {source}.',
    },
  },
  zh: {
    tournamentTitle: '比赛信息', resultsTitle: '结果信息', defendersTitle: '防守方', close: '关闭', english: 'English',
    messages: {
      normalTournament: '请在本场比赛结束前完成 {count} 副牌。每完成一副牌，成绩都会更新。必须完成全部牌局才能进入结果榜。Retry 仅供练习，不会改变正式成绩。',
      speedball: '请在时间结束前尽可能多地完成牌局。所有已完成牌局的原始分相加。每一副完成的牌都计入结果。Retry 仅供练习，不会改变正式成绩。',
      visibleCards: '完成 {count} 副牌，两名防守方的牌均可见。每副牌都取得最多墩数才能进入结果榜。本比赛不排名，也不占用你的比赛次数。',
      slamOnly: '完成 {count} 副满贯牌，防守方的牌不可见。每完成一副牌，你的 IMP 和名次都会更新。成绩计入每日排行榜。',
      duel: '作为庄家完成 {count} 副牌。你的对手会打同样的牌。比较双方总分。',
      tournamentResults: '这里显示当前比赛排名和结果。选择一名牌手可查看每副牌的得分。',
      dailyLeaderboard: '这里显示当前 Leonardo Bridge 日内所有已完成比赛的综合每日排行榜。',
      leonardoLeaderboard: "计入练习和已完成比赛的积分。\n\n每日：从今天 00:00 UTC 起。\n每月：从本月第一天 00:00 UTC 起。\n总榜：所有已记录的积分。\n\n总积分越高，排名越靠前。按保留两位小数之前的精确总积分判断并列，相同者共享名次。访客不列入排行榜。",
      defenders: '{west} 和 {east} 是电脑控制的防守方。他们的名字来自 {source}。',
    },
  },
  it: {
    tournamentTitle: 'INFORMAZIONI TORNEO', resultsTitle: 'INFORMAZIONI RISULTATI', defendersTitle: 'I DIFENSORI', close: 'Chiudi', english: 'English',
    messages: {
      normalTournament: 'Gioca {count} smazzate prima della fine del torneo. Il risultato si aggiorna dopo ogni smazzata completata. Devi completarle tutte per apparire nei risultati. Retry serve solo per allenarsi e non modifica mai il punteggio ufficiale.',
      speedball: 'Gioca più smazzate possibile prima dello scadere del tempo. I punteggi grezzi di tutte le smazzate completate vengono sommati. Ogni smazzata completata conta nei risultati. Retry serve solo per allenarsi e non modifica mai il punteggio ufficiale.',
      visibleCards: 'Gioca {count} smazzate con le carte di entrambi i difensori visibili. Realizza il massimo numero di prese in ogni smazzata per apparire nei risultati. Non c’è classifica e il torneo non consuma il tuo limite di partecipazioni.',
      slamOnly: 'Gioca {count} smazzate di slam con le carte dei difensori nascoste. IMP e posizione si aggiornano dopo ogni smazzata completata. Il risultato entra nella classifica giornaliera.',
      duel: 'Gioca {count} smazzate come dichiarante. Il tuo avversario gioca le stesse smazzate. Confrontate i punteggi totali.',
      tournamentResults: 'Qui vedi la classifica e i risultati attuali del torneo. Seleziona un giocatore per vedere il punteggio di ogni smazzata.',
      dailyLeaderboard: 'Qui vedi la classifica giornaliera combinata dei tornei completati nell’attuale giornata Leonardo Bridge.',
      leonardoLeaderboard: "Contano la pratica e i tornei completati.\n\nGiornaliera: da oggi alle 00:00 UTC.\nMensile: dal primo giorno del mese corrente alle 00:00 UTC.\nDi sempre: tutti i punti registrati.\n\nI totali più alti sono in testa. Totali esattamente uguali condividono la stessa posizione, prima dell’arrotondamento a due decimali. Gli ospiti non compaiono nelle classifiche.",
      defenders: '{west} e {east} sono difensori controllati dal computer. I loro nomi provengono da {source}.',
    },
  },
  de: {
    tournamentTitle: 'TURNIERINFORMATION', resultsTitle: 'ERGEBNISINFORMATION', defendersTitle: 'DIE GEGENSPIELER', close: 'Schließen', english: 'English',
    messages: {
      normalTournament: 'Spiele {count} Boards, bevor dieses Turnier endet. Dein Ergebnis wird nach jedem abgeschlossenen Board aktualisiert. Du musst alle Boards abschließen, um in den Ergebnissen zu erscheinen. Retry dient nur zum Üben und ändert nie dein offizielles Ergebnis.',
      speedball: 'Spiele so viele Boards wie möglich, bevor die Zeit abläuft. Deine Rohpunkte aller abgeschlossenen Boards werden addiert. Jedes abgeschlossene Board zählt für die Ergebnisse. Retry dient nur zum Üben und ändert nie dein offizielles Ergebnis.',
      visibleCards: 'Spiele {count} Boards mit sichtbaren Karten beider Gegenspieler. Erziele auf jedem Board die maximale Stichzahl, um in den Ergebnissen zu erscheinen. Es gibt keine Rangliste und dieses Turnier belastet dein Turnierkontingent nicht.',
      slamOnly: 'Spiele {count} Schlemm-Boards mit verdeckten Karten der Gegenspieler. Deine IMPs und Platzierung werden nach jedem abgeschlossenen Board aktualisiert. Das Ergebnis zählt für die Tagesrangliste.',
      duel: 'Spiele {count} Boards als Alleinspieler. Dein Gegner spielt dieselben Boards. Vergleicht eure Gesamtpunkte.',
      tournamentResults: 'Hier siehst du die aktuelle Turnierwertung und die Ergebnisse. Wähle einen Spieler, um das Ergebnis jedes Boards zu sehen.',
      dailyLeaderboard: 'Hier siehst du die gemeinsame Tagesrangliste der abgeschlossenen Turniere des aktuellen Leonardo Bridge-Tages.',
      leonardoLeaderboard: "Übung und abgeschlossene Turniere zählen.\n\nTäglich: heute ab 00:00 UTC.\nMonatlich: ab dem ersten Tag des aktuellen Monats um 00:00 UTC.\nGesamt: alle erfassten Punkte.\n\nHöhere Gesamtpunktzahlen stehen oben. Exakt gleiche Summen teilen sich einen Platz, vor der Rundung auf zwei Dezimalstellen. Gäste erscheinen nicht in den Ranglisten.",
      defenders: '{west} und {east} sind computergesteuerte Gegenspieler. Ihre Namen stammen aus {source}.',
    },
  },
  sv: {
    tournamentTitle: 'TURNERINGSINFO', resultsTitle: 'RESULTATINFO', defendersTitle: 'FÖRSVARARNA', close: 'Stäng', english: 'English',
    messages: {
      normalTournament: 'Spela {count} brickor innan turneringen slutar. Ditt resultat uppdateras efter varje färdig bricka. Du måste spela alla brickor för att visas i resultatet. Retry är endast träning och ändrar aldrig ditt officiella resultat.',
      speedball: 'Spela så många brickor du hinner innan tiden går ut. Dina råpoäng från alla färdiga brickor summeras. Varje färdig bricka räknas i resultatet. Retry är endast träning och ändrar aldrig ditt officiella resultat.',
      visibleCards: 'Spela {count} brickor med båda försvararnas kort synliga. Ta maximalt antal stick på varje bricka för att visas i resultatet. Ingen rangordning görs och turneringen använder inte din turneringskvot.',
      slamOnly: 'Spela {count} slambrickor med försvararnas kort dolda. Dina IMP och din placering uppdateras efter varje färdig bricka. Resultatet ingår i dagens topplista.',
      duel: 'Spela {count} brickor som spelförare. Motståndaren spelar samma brickor. Jämför era totalpoäng.',
      tournamentResults: 'Här ser du aktuell turneringsplacering och resultat. Välj en spelare för att se poängen på varje bricka.',
      dailyLeaderboard: 'Här ser du den sammanlagda dagliga topplistan från färdigspelade turneringar under aktuell Leonardo Bridge-dag.',
      leonardoLeaderboard: "Träning och avslutade turneringar räknas.\n\nDaglig: idag från 00:00 UTC.\nMånatlig: från den första dagen i innevarande månad kl. 00:00 UTC.\nGenom tiderna: alla registrerade poäng.\n\nHögre totalsummor rankas först. Exakt lika totalsummor delar placering, före avrundning till två decimaler. Gäster visas inte i topplistorna.",
      defenders: '{west} och {east} är datorstyrda försvarare. Deras namn kommer från {source}.',
    },
  },
  da: {
    tournamentTitle: 'TURNERINGSINFO', resultsTitle: 'RESULTATINFO', defendersTitle: 'MODSPILLERNE', close: 'Luk', english: 'English',
    messages: {
      normalTournament: 'Spil {count} spil, før turneringen slutter. Dit resultat opdateres efter hvert afsluttet spil. Du skal afslutte alle spil for at komme med i resultaterne. Retry er kun til træning og ændrer aldrig din officielle score.',
      speedball: 'Spil så mange spil som muligt, før tiden udløber. Dine rå scorer fra alle afsluttede spil lægges sammen. Hvert afsluttet spil tæller i resultaterne. Retry er kun til træning og ændrer aldrig din officielle score.',
      visibleCards: 'Spil {count} spil med begge modspilleres kort synlige. Tag det maksimale antal stik i hvert spil for at komme med i resultaterne. Der er ingen rangliste, og turneringen bruger ikke din turneringskvote.',
      slamOnly: 'Spil {count} slemspil med modspillernes kort skjult. Dine IMP og din placering opdateres efter hvert afsluttet spil. Resultatet tæller med i dagens rangliste.',
      duel: 'Spil {count} spil som spilfører. Din modstander spiller de samme spil. Sammenlign jeres samlede scorer.',
      tournamentResults: 'Her kan du se den aktuelle turneringsrangliste og resultaterne. Vælg en spiller for at se scoren på hvert spil.',
      dailyLeaderboard: 'Her kan du se den samlede daglige rangliste fra afsluttede turneringer i den aktuelle Leonardo Bridge-dag.',
      leonardoLeaderboard: "Træning og afsluttede turneringer tæller med.\n\nDaglig: i dag fra 00:00 UTC.\nMånedlig: fra den første dag i den aktuelle måned kl. 00:00 UTC.\nSamlet: alle registrerede point.\n\nHøjere summer placeres først. Præcis ens summer deler placering, før afrunding til to decimaler. Gæster vises ikke på ranglisterne.",
      defenders: '{west} og {east} er computerstyrede modspillere. Deres navne kommer fra {source}.',
    },
  },
  no: {
    tournamentTitle: 'TURNERINGSINFO', resultsTitle: 'RESULTATINFO', defendersTitle: 'MOTSPILLERNE', close: 'Lukk', english: 'English',
    messages: {
      normalTournament: 'Spill {count} spill før turneringen avsluttes. Resultatet oppdateres etter hvert fullførte spill. Du må fullføre alle spillene for å vises i resultatene. Retry er bare trening og endrer aldri den offisielle scoren.',
      speedball: 'Spill så mange spill som mulig før tiden går ut. Råscorene fra alle fullførte spill summeres. Hvert fullført spill teller i resultatene. Retry er bare trening og endrer aldri den offisielle scoren.',
      visibleCards: 'Spill {count} spill med kortene til begge motspillerne synlige. Ta maksimalt antall stikk i hvert spill for å vises i resultatene. Det er ingen rangering, og turneringen bruker ikke turneringskvoten din.',
      slamOnly: 'Spill {count} slemmspill med motspillernes kort skjult. IMP og plassering oppdateres etter hvert fullførte spill. Resultatet teller i dagens resultatliste.',
      duel: 'Spill {count} spill som spillefører. Motstanderen spiller de samme spillene. Sammenlign totalscorene.',
      tournamentResults: 'Her ser du gjeldende turneringsrangering og resultater. Velg en spiller for å se scoren på hvert spill.',
      dailyLeaderboard: 'Her ser du den samlede daglige resultatlisten fra fullførte turneringer i gjeldende Leonardo Bridge-dag.',
      leonardoLeaderboard: "Trening og fullførte turneringer teller med.\n\nDaglig: i dag fra 00:00 UTC.\nMånedlig: fra første dag i inneværende måned kl. 00:00 UTC.\nTotalt: alle registrerte poeng.\n\nHøyere summer rangeres først. Nøyaktig like summer deler plassering, før avrunding til to desimaler. Gjester vises ikke på rangeringene.",
      defenders: '{west} og {east} er datastyrte motspillere. Navnene deres kommer fra {source}.',
    },
  },
  pl: {
    tournamentTitle: 'INFORMACJE O TURNIEJU', resultsTitle: 'INFORMACJE O WYNIKACH', defendersTitle: 'OBROŃCY', close: 'Zamknij', english: 'English',
    messages: {
      normalTournament: 'Rozegraj {count} rozdań przed końcem turnieju. Wynik aktualizuje się po każdym ukończonym rozdaniu. Musisz ukończyć wszystkie rozdania, aby pojawić się w wynikach. Retry służy wyłącznie do ćwiczeń i nigdy nie zmienia oficjalnego wyniku.',
      speedball: 'Rozegraj jak najwięcej rozdań przed upływem czasu. Surowe wyniki ze wszystkich ukończonych rozdań są sumowane. Każde ukończone rozdanie liczy się w wynikach. Retry służy wyłącznie do ćwiczeń i nigdy nie zmienia oficjalnego wyniku.',
      visibleCards: 'Rozegraj {count} rozdań z widocznymi kartami obu obrońców. W każdym rozdaniu weź maksymalną liczbę lew, aby pojawić się w wynikach. Nie ma rankingu, a turniej nie wykorzystuje twojego limitu turniejowego.',
      slamOnly: 'Rozegraj {count} rozdań szlemowych z ukrytymi kartami obrońców. IMP-y i pozycja aktualizują się po każdym ukończonym rozdaniu. Wynik wlicza się do rankingu dziennego.',
      duel: 'Rozegraj {count} rozdań jako rozgrywający. Przeciwnik gra te same rozdania. Porównajcie łączne wyniki.',
      tournamentResults: 'Tutaj zobaczysz aktualny ranking i wyniki turnieju. Wybierz gracza, aby zobaczyć wynik każdego rozdania.',
      dailyLeaderboard: 'Tutaj zobaczysz łączny ranking dzienny z ukończonych turniejów w bieżącym dniu Leonardo Bridge.',
      leonardoLeaderboard: "Liczą się trening i ukończone turnieje.\n\nDzienny: dzisiaj od 00:00 UTC.\nMiesięczny: od pierwszego dnia bieżącego miesiąca o 00:00 UTC.\nWszech czasów: wszystkie zapisane punkty.\n\nWyższa suma oznacza wyższe miejsce. Dokładnie równe sumy dają to samo miejsce, przed zaokrągleniem do dwóch miejsc po przecinku. Goście nie pojawiają się w rankingach.",
      defenders: '{west} i {east} to obrońcy sterowani przez komputer. Ich imiona pochodzą z {source}.',
    },
  },
  ja: {
    tournamentTitle: 'トーナメント情報', resultsTitle: '結果情報', defendersTitle: 'ディフェンダー', close: '閉じる', english: 'English',
    messages: {
      normalTournament: 'トーナメント終了までに {count} ボードをプレイしてください。完了するたびに結果が更新されます。結果に表示されるには全ボードを完了する必要があります。Retry は練習専用で、公式スコアは変わりません。',
      speedball: '時間切れまでにできるだけ多くのボードをプレイしてください。完了した全ボードのロースコアが合計されます。完了した各ボードが結果に加算されます。Retry は練習専用で、公式スコアは変わりません。',
      visibleCards: '両ディフェンダーのカードを見ながら {count} ボードをプレイします。各ボードで最大トリック数を取ると結果に表示されます。順位付けはなく、トーナメント参加枠も消費しません。',
      slamOnly: 'ディフェンダーのカードを伏せた状態で {count} のスラムボードをプレイします。完了するたびに IMP と順位が更新されます。結果はデイリーランキングに含まれます。',
      duel: 'ディクレアラーとして {count} ボードをプレイします。対戦相手も同じボードをプレイします。合計スコアを比較してください。',
      tournamentResults: '現在のトーナメント順位と結果を確認できます。プレイヤーを選ぶと各ボードのスコアが表示されます。',
      dailyLeaderboard: '現在の Leonardo Bridge デイに完了したトーナメントを合算したデイリーランキングです。',
      leonardoLeaderboard: "練習と完了したトーナメントが対象です。\n\n日間：本日の 00:00 UTC から。\n月間：今月1日の 00:00 UTC から。\n累計：記録されたすべてのポイント。\n\n合計が高いほど上位になります。小数第2位への丸め前の合計が完全に同じ場合は同順位です。ゲストはランキングに表示されません。",
      defenders: '{west} と {east} はコンピューターが操作するディフェンダーです。名前は {source} に由来します。',
    },
  },
  he: {
    tournamentTitle: 'מידע על הטורניר', resultsTitle: 'מידע על התוצאות', defendersTitle: 'המגינים', close: 'סגירה', english: 'English',
    messages: {
      normalTournament: 'שחקו {count} חלוקות לפני סיום הטורניר. התוצאה מתעדכנת אחרי כל חלוקה שהושלמה. יש להשלים את כולן כדי להופיע בתוצאות. Retry מיועד לאימון בלבד ואינו משנה את התוצאה הרשמית.',
      speedball: 'שחקו כמה שיותר חלוקות לפני תום הזמן. התוצאות הגולמיות של כל החלוקות שהושלמו מתחברות. כל חלוקה שהושלמה נכללת בתוצאות. Retry מיועד לאימון בלבד ואינו משנה את התוצאה הרשמית.',
      visibleCards: 'שחקו {count} חלוקות כאשר הקלפים של שני המגינים גלויים. השיגו את מספר הלקיחות המרבי בכל חלוקה כדי להופיע בתוצאות. אין דירוג והטורניר אינו מנצל את מכסת הטורנירים שלכם.',
      slamOnly: 'שחקו {count} חלוקות סלאם כאשר קלפי המגינים מוסתרים. ה-IMP והמיקום מתעדכנים לאחר כל חלוקה שהושלמה. התוצאה נכללת בדירוג היומי.',
      duel: 'שחקו {count} חלוקות ככרוז. היריב משחק את אותן חלוקות. השוו את התוצאות הכוללות.',
      tournamentResults: 'כאן ניתן לראות את דירוג הטורניר והתוצאות העדכניות. בחרו שחקן כדי לראות את התוצאה בכל חלוקה.',
      dailyLeaderboard: 'כאן ניתן לראות את הדירוג היומי המשולב מטורנירים שהושלמו ביום Leonardo Bridge הנוכחי.',
      leonardoLeaderboard: "האימון והטורנירים שהושלמו נספרים.\n\nיומי: היום החל מ־00:00 UTC.\nחודשי: מהיום הראשון של החודש הנוכחי בשעה 00:00 UTC.\nכל הזמנים: כל הנקודות שנרשמו.\n\nסכומים גבוהים יותר מדורגים ראשונים. סכומים זהים בדיוק חולקים את אותו מקום, לפני עיגול לשתי ספרות אחרי הנקודה. אורחים אינם מופיעים בדירוגים.",
      defenders: '{west} ו-{east} הם מגינים הנשלטים בידי המחשב. שמותיהם מגיעים מ-{source}.',
    },
  },
  es: {
    tournamentTitle: 'INFORMACIÓN DEL TORNEO', resultsTitle: 'INFORMACIÓN DE RESULTADOS', defendersTitle: 'LOS DEFENSORES', close: 'Cerrar', english: 'English',
    messages: {
      normalTournament: 'Juega {count} manos antes de que termine el torneo. Tu resultado se actualiza después de cada mano completada. Debes completarlas todas para aparecer en los resultados. Retry es solo para practicar y nunca cambia tu puntuación oficial.',
      speedball: 'Juega tantas manos como puedas antes de que se acabe el tiempo. Se suman tus puntuaciones brutas de todas las manos completadas. Cada mano completada cuenta en los resultados. Retry es solo para practicar y nunca cambia tu puntuación oficial.',
      visibleCards: 'Juega {count} manos con las cartas de ambos defensores visibles. Consigue el máximo número de bazas en cada mano para aparecer en los resultados. No hay clasificación y este torneo no consume tu cupo de torneos.',
      slamOnly: 'Juega {count} manos de slam con las cartas de los defensores ocultas. Tus IMP y tu posición se actualizan después de cada mano completada. El resultado se incluye en la clasificación diaria.',
      duel: 'Juega {count} manos como declarante. Tu oponente juega las mismas manos. Comparad las puntuaciones totales.',
      tournamentResults: 'Aquí puedes ver la clasificación y los resultados actuales del torneo. Selecciona un jugador para ver la puntuación de cada mano.',
      dailyLeaderboard: 'Aquí puedes ver la clasificación diaria combinada de los torneos completados en el día actual de Leonardo Bridge.',
      leonardoLeaderboard: "Cuentan la práctica y los torneos completados.\n\nDiaria: hoy desde las 00:00 UTC.\nMensual: desde el primer día del mes actual a las 00:00 UTC.\nHistórica: todos los puntos registrados.\n\nLos totales más altos ocupan los primeros puestos. Los totales exactamente iguales comparten posición, antes de redondear a dos decimales. Los invitados no aparecen en las clasificaciones.",
      defenders: '{west} y {east} son defensores controlados por el ordenador. Sus nombres proceden de {source}.',
    },
  },
  pt: {
    tournamentTitle: 'INFORMAÇÕES DO TORNEIO', resultsTitle: 'INFORMAÇÕES DOS RESULTADOS', defendersTitle: 'OS DEFENSORES', close: 'Fechar', english: 'English',
    messages: {
      normalTournament: 'Jogue {count} mãos antes do fim do torneio. O seu resultado é atualizado após cada mão concluída. Deve concluir todas as mãos para aparecer nos resultados. Retry serve apenas para treino e nunca altera a pontuação oficial.',
      speedball: 'Jogue o maior número possível de mãos antes de o tempo terminar. As pontuações brutas de todas as mãos concluídas são somadas. Cada mão concluída conta nos resultados. Retry serve apenas para treino e nunca altera a pontuação oficial.',
      visibleCards: 'Jogue {count} mãos com as cartas dos dois defensores visíveis. Faça o máximo de vazas em cada mão para aparecer nos resultados. Não existe classificação e este torneio não usa o seu limite de torneios.',
      slamOnly: 'Jogue {count} mãos de slam com as cartas dos defensores ocultas. Os seus IMP e a sua posição são atualizados após cada mão concluída. O resultado entra na classificação diária.',
      duel: 'Jogue {count} mãos como declarante. O adversário joga as mesmas mãos. Compare as pontuações totais.',
      tournamentResults: 'Aqui pode ver a classificação e os resultados atuais do torneio. Selecione um jogador para ver a pontuação de cada mão.',
      dailyLeaderboard: 'Aqui pode ver a classificação diária combinada dos torneios concluídos no dia Leonardo Bridge atual.',
      leonardoLeaderboard: "Contam a prática e os torneios concluídos.\n\nDiária: hoje desde as 00:00 UTC.\nMensal: desde o primeiro dia do mês atual às 00:00 UTC.\nGeral: todos os pontos registados.\n\nOs totais mais altos ficam à frente. Totais exatamente iguais partilham a mesma posição, antes do arredondamento a duas casas decimais. Os convidados não aparecem nas classificações.",
      defenders: '{west} e {east} são defensores controlados pelo computador. Os nomes vêm de {source}.',
    },
  },
  hi: {
    tournamentTitle: 'टूर्नामेंट जानकारी', resultsTitle: 'परिणाम जानकारी', defendersTitle: 'डिफेंडर', close: 'बंद करें', english: 'English',
    messages: {
      normalTournament: 'इस टूर्नामेंट के समाप्त होने से पहले {count} बोर्ड खेलें। हर पूरा बोर्ड के बाद परिणाम अपडेट होता है। परिणामों में आने के लिए सभी बोर्ड पूरे करना ज़रूरी है। Retry केवल अभ्यास के लिए है और आधिकारिक स्कोर नहीं बदलता।',
      speedball: 'समय समाप्त होने से पहले जितने बोर्ड खेल सकें, खेलें। सभी पूरे बोर्डों के रॉ स्कोर जोड़े जाते हैं। हर पूरा बोर्ड परिणामों में गिना जाता है। Retry केवल अभ्यास के लिए है और आधिकारिक स्कोर नहीं बदलता।',
      visibleCards: 'दोनों डिफेंडरों के पत्ते दिखाई देते हुए {count} बोर्ड खेलें। परिणामों में आने के लिए हर बोर्ड पर अधिकतम ट्रिक लें। कोई रैंकिंग नहीं है और यह टूर्नामेंट आपकी टूर्नामेंट सीमा का उपयोग नहीं करता।',
      slamOnly: 'डिफेंडरों के पत्ते छिपे हुए {count} स्लैम बोर्ड खेलें। हर पूरा बोर्ड के बाद IMP और स्थान अपडेट होते हैं। परिणाम Leaderboard में शामिल होता है।',
      duel: 'डिक्लेयरर के रूप में {count} बोर्ड खेलें। आपका प्रतिद्वंद्वी वही बोर्ड खेलता है। कुल स्कोर की तुलना करें।',
      tournamentResults: 'यहाँ वर्तमान टूर्नामेंट रैंकिंग और परिणाम देख सकते हैं। हर बोर्ड का स्कोर देखने के लिए खिलाड़ी चुनें।',
      dailyLeaderboard: 'यहाँ वर्तमान Leonardo Bridge दिन में पूरे हुए टूर्नामेंटों का संयुक्त Leaderboard देख सकते हैं।',
      leonardoLeaderboard: "अभ्यास और पूरे किए गए टूर्नामेंट गिने जाते हैं।\n\nदैनिक: आज 00:00 UTC से।\nमासिक: चालू महीने के पहले दिन 00:00 UTC से।\nसर्वकालिक: सभी दर्ज अंक।\n\nअधिक कुल अंक वालों का स्थान ऊपर होता है। दो दशमलव स्थानों तक पूर्णांकित करने से पहले बिल्कुल समान कुल अंकों वाले खिलाड़ी एक ही स्थान साझा करते हैं। अतिथि रैंकिंग में नहीं दिखाई देते।",
      defenders: '{west} और {east} कंप्यूटर द्वारा नियंत्रित डिफेंडर हैं। उनके नाम {source} से लिए गए हैं।',
    },
  },
  tr: {
    tournamentTitle: 'TURNUVA BİLGİSİ', resultsTitle: 'SONUÇ BİLGİSİ', defendersTitle: 'DEFANS OYUNCULARI', close: 'Kapat', english: 'English',
    messages: {
      normalTournament: 'Turnuva bitmeden {count} eli oynayın. Sonucunuz tamamlanan her elden sonra güncellenir. Sonuçlarda görünmek için tüm elleri tamamlamalısınız. Retry yalnızca pratik içindir ve resmi skorunuzu değiştirmez.',
      speedball: 'Süre dolmadan oynayabildiğiniz kadar çok el oynayın. Tamamlanan tüm ellerdeki ham skorlarınız toplanır. Tamamlanan her el sonuçlara dahil edilir. Retry yalnızca pratik içindir ve resmi skorunuzu değiştirmez.',
      visibleCards: 'Her iki defans oyuncusunun kartları açıkken {count} el oynayın. Sonuçlarda görünmek için her elde mümkün olan en fazla löveyi alın. Sıralama yoktur ve bu turnuva turnuva hakkınızı kullanmaz.',
      slamOnly: 'Defans kartları kapalıyken {count} şlem eli oynayın. IMP ve sıranız tamamlanan her elden sonra güncellenir. Sonuç Günlük Liderlik Tablosuna eklenir.',
      duel: 'Deklaran olarak {count} el oynayın. Rakibiniz aynı elleri oynar. Toplam skorlarınızı karşılaştırın.',
      tournamentResults: 'Burada güncel turnuva sıralamasını ve sonuçlarını görebilirsiniz. Her elin skorunu görmek için bir oyuncu seçin.',
      dailyLeaderboard: 'Burada geçerli Leonardo Bridge gününde tamamlanan turnuvaların birleşik Günlük Liderlik Tablosunu görebilirsiniz.',
      leonardoLeaderboard: "Alıştırma ve tamamlanmış turnuvalar hesaba katılır.\n\nGünlük: bugün 00:00 UTC’den itibaren.\nAylık: içinde bulunulan ayın ilk günü 00:00 UTC’den itibaren.\nTüm zamanlar: kaydedilmiş tüm puanlar.\n\nYüksek toplamlar önce gelir. İki ondalık basamağa yuvarlanmadan önce tam olarak eşit toplamlar aynı sırayı paylaşır. Misafirler sıralamalarda görünmez.",
      defenders: '{west} ve {east} bilgisayar kontrollü defans oyuncularıdır. İsimleri {source} kaynağından gelir.',
    },
  },
  ru: {
    tournamentTitle: 'ИНФОРМАЦИЯ О ТУРНИРЕ', resultsTitle: 'ИНФОРМАЦИЯ О РЕЗУЛЬТАТАХ', defendersTitle: 'ЗАЩИТНИКИ', close: 'Закрыть', english: 'English',
    messages: {
      normalTournament: 'Сыграйте {count} сдач до окончания турнира. Результат обновляется после каждой завершённой сдачи. Чтобы попасть в результаты, нужно завершить все сдачи. Retry предназначен только для тренировки и не меняет официальный результат.',
      speedball: 'Сыграйте как можно больше сдач до истечения времени. Ваши очки по всем завершённым сдачам складываются. Каждая завершённая сдача учитывается в результатах. Retry предназначен только для тренировки и не меняет официальный результат.',
      visibleCards: 'Сыграйте {count} сдач с открытыми картами обоих защитников. Возьмите максимум взяток в каждой сдаче, чтобы попасть в результаты. Ранжирования нет, и турнир не расходует ваш лимит турниров.',
      slamOnly: 'Сыграйте {count} шлемовых сдач с закрытыми картами защитников. IMP и место обновляются после каждой завершённой сдачи. Результат входит в дневной рейтинг.',
      duel: 'Сыграйте {count} сдач как разыгрывающий. Соперник играет те же сдачи. Сравните суммарные очки.',
      tournamentResults: 'Здесь показаны текущий рейтинг и результаты турнира. Выберите игрока, чтобы увидеть результат каждой сдачи.',
      dailyLeaderboard: 'Здесь показан общий дневной рейтинг завершённых турниров текущего дня Leonardo Bridge.',
      leonardoLeaderboard: "Учитываются тренировка и завершённые турниры.\n\nЗа день: сегодня с 00:00 UTC.\nЗа месяц: с первого дня текущего месяца, 00:00 UTC.\nЗа всё время: все записанные очки.\n\nБольшая сумма даёт более высокое место. Точно равные суммы делят одно место до округления до двух знаков после запятой. Гости не отображаются в рейтингах.",
      defenders: '{west} и {east} — защитники под управлением компьютера. Их имена взяты из {source}.',
    },
  },
  el: {
    tournamentTitle: 'ΠΛΗΡΟΦΟΡΙΕΣ ΤΟΥΡΝΟΥΑ', resultsTitle: 'ΠΛΗΡΟΦΟΡΙΕΣ ΑΠΟΤΕΛΕΣΜΑΤΩΝ', defendersTitle: 'ΟΙ ΑΜΥΝΟΜΕΝΟΙ', close: 'Κλείσιμο', english: 'English',
    messages: {
      normalTournament: 'Παίξε {count} διανομές πριν ολοκληρωθεί το τουρνουά. Το αποτέλεσμά σου ενημερώνεται μετά από κάθε ολοκληρωμένη διανομή. Πρέπει να ολοκληρώσεις όλες τις διανομές για να εμφανιστείς στα Αποτελέσματα. Το Retry είναι μόνο για εξάσκηση και δεν αλλάζει ποτέ το επίσημο σκορ σου.',
      speedball: 'Παίξε όσες περισσότερες διανομές μπορείς πριν τελειώσει ο χρόνος. Τα raw scores όλων των διανομών που ολοκλήρωσες προστίθενται. Κάθε ολοκληρωμένη διανομή μετρά στα Αποτελέσματα. Το Retry είναι μόνο για εξάσκηση και δεν αλλάζει ποτέ το επίσημο σκορ σου.',
      visibleCards: 'Παίξε {count} διανομές βλέποντας τα φύλλα και των δύο αμυνομένων. Κάνε τις μέγιστες μπάζες σε κάθε διανομή για να εμφανιστείς στα Αποτελέσματα. Δεν υπάρχει κατάταξη και το τουρνουά δεν καταναλώνει μία από τις ημερήσιες συμμετοχές σου.',
      slamOnly: 'Παίξε {count} διανομές σλεμ με κρυμμένα τα φύλλα των αμυνομένων. Τα IMPs και η θέση σου ενημερώνονται μετά από κάθε ολοκληρωμένη διανομή. Το αποτέλεσμα συμμετέχει στο Leaderboard.',
      duel: 'Παίξε {count} διανομές ως εκτελεστής. Ο αντίπαλός σου παίζει τις ίδιες διανομές. Συγκρίνετε τα συνολικά σκορ σας.',
      tournamentResults: 'Εδώ βλέπεις την τρέχουσα κατάταξη και τα αποτελέσματα του τουρνουά. Επίλεξε έναν παίκτη για να δεις το σκορ κάθε διανομής.',
      dailyLeaderboard: 'Εδώ βλέπεις το συνολικό Leaderboard από τα ολοκληρωμένα τουρνουά της τρέχουσας ημέρας του Leonardo Bridge.',
      leonardoLeaderboard: "Συνυπολογίζονται η Εξάσκηση και τα ολοκληρωμένα Τουρνουά.\n\nΗμερήσιο: από τις 00:00 UTC της σημερινής ημέρας.\nΜηνιαίο: από την πρώτη ημέρα του τρέχοντος μήνα, στις 00:00 UTC.\nΔιαχρονικό: όλοι οι καταγεγραμμένοι βαθμοί.\n\nΜεγαλύτερο σύνολο σημαίνει υψηλότερη θέση. Ίδια ακριβώς σύνολα μοιράζονται την ίδια θέση, πριν από τη στρογγυλοποίηση στα δύο δεκαδικά. Οι επισκέπτες δεν εμφανίζονται στις κατατάξεις.",
      defenders: 'Οι {west} και {east} είναι αμυνόμενοι που ελέγχονται από τον υπολογιστή. Τα ονόματά τους προέρχονται από {source}.',
    },
  },
  fi: {
    tournamentTitle: 'TURNAUSTIEDOT', resultsTitle: 'TULOSTIEDOT', defendersTitle: 'PUOLUSTAJAT', close: 'Sulje', english: 'English',
    messages: {
      normalTournament: 'Pelaa {count} jakoa ennen turnauksen päättymistä. Tulos päivittyy jokaisen valmistuneen jaon jälkeen. Kaikki jaot on pelattava, jotta pääset tuloksiin. Retry on vain harjoittelua varten eikä muuta virallista tulostasi.',
      speedball: 'Pelaa niin monta jakoa kuin ehdit ennen ajan loppumista. Kaikkien valmistuneiden jakojen raakapisteet lasketaan yhteen. Jokainen valmistunut jako lasketaan tuloksiin. Retry on vain harjoittelua varten eikä muuta virallista tulostasi.',
      visibleCards: 'Pelaa {count} jakoa molempien puolustajien kortit näkyvissä. Ota jokaisessa jaossa suurin mahdollinen määrä tikkejä päästäksesi tuloksiin. Sijoitusta ei ole, eikä turnaus käytä turnauskiintiötäsi.',
      slamOnly: 'Pelaa {count} slam-jakoa puolustajien kortit piilossa. IMPit ja sijoituksesi päivittyvät jokaisen valmistuneen jaon jälkeen. Tulos sisältyy päivän tulostaulukkoon.',
      duel: 'Pelaa {count} jakoa pelinviejänä. Vastustajasi pelaa samat jaot. Vertailkaa kokonaispisteitänne.',
      tournamentResults: 'Tässä näet turnauksen nykyisen sijoituksen ja tulokset. Valitse pelaaja nähdäksesi jokaisen jaon pisteet.',
      dailyLeaderboard: 'Tässä näet kuluvan Leonardo Bridge-päivän päättyneiden turnausten yhdistetyn päivittäisen tulostaulukon.',
      leonardoLeaderboard: "Harjoittelu ja loppuun pelatut turnaukset lasketaan mukaan.\n\nPäivittäinen: tänään klo 00:00 UTC alkaen.\nKuukausittainen: kuluvan kuukauden ensimmäisestä päivästä klo 00:00 UTC alkaen.\nKaikkien aikojen: kaikki tallennetut pisteet.\n\nSuurempi pistemäärä sijoittuu korkeammalle. Täsmälleen samat summat jakavat sijoituksen ennen pyöristystä kahteen desimaaliin. Vieraat eivät näy tuloslistoissa.",
      defenders: '{west} ja {east} ovat tietokoneen ohjaamia puolustajia. Heidän nimensä tulevat kohteesta {source}.',
    },
  },
  cs: {
    tournamentTitle: 'INFORMACE O TURNAJI', resultsTitle: 'INFORMACE O VÝSLEDCÍCH', defendersTitle: 'OBRÁNCI', close: 'Zavřít', english: 'English',
    messages: {
      normalTournament: 'Odehrajte {count} rozdání před koncem turnaje. Výsledek se aktualizuje po každém dokončeném rozdání. Pro zobrazení ve výsledcích musíte dokončit všechna rozdání. Retry slouží pouze k tréninku a nikdy nemění oficiální skóre.',
      speedball: 'Odehrajte co nejvíce rozdání před vypršením času. Hrubá skóre všech dokončených rozdání se sčítají. Každé dokončené rozdání se započítá do výsledků. Retry slouží pouze k tréninku a nikdy nemění oficiální skóre.',
      visibleCards: 'Odehrajte {count} rozdání s odkrytými kartami obou obránců. V každém rozdání získejte maximální počet zdvihů, abyste se objevili ve výsledcích. Pořadí se neurčuje a turnaj nečerpá váš turnajový limit.',
      slamOnly: 'Odehrajte {count} slemových rozdání se skrytými kartami obránců. IMP a pořadí se aktualizují po každém dokončeném rozdání. Výsledek se započítává do denního žebříčku.',
      duel: 'Odehrajte {count} rozdání jako hlavní hráč. Soupeř hraje stejná rozdání. Porovnejte celková skóre.',
      tournamentResults: 'Zde uvidíte aktuální pořadí a výsledky turnaje. Vyberte hráče a zobrazte skóre každého rozdání.',
      dailyLeaderboard: 'Zde uvidíte společný denní žebříček dokončených turnajů v aktuálním dni Leonardo Bridge.',
      leonardoLeaderboard: "Počítají se trénink a dokončené turnaje.\n\nDenní: dnes od 00:00 UTC.\nMěsíční: od prvního dne aktuálního měsíce v 00:00 UTC.\nCelkové: všechny zaznamenané body.\n\nVyšší součty jsou na vyšších místech. Přesně stejné součty sdílejí pořadí, před zaokrouhlením na dvě desetinná místa. Hosté se v žebříčcích nezobrazují.",
      defenders: '{west} a {east} jsou obránci ovládaní počítačem. Jejich jména pocházejí z {source}.',
    },
  },
  is: {
    tournamentTitle: 'UPPLÝSINGAR UM MÓT', resultsTitle: 'UPPLÝSINGAR UM ÚRSLIT', defendersTitle: 'VARNARSPILARARNIR', close: 'Loka', english: 'English',
    messages: {
      normalTournament: 'Spilaðu {count} spil áður en mótinu lýkur. Úrslitin uppfærast eftir hvert lokið spil. Þú verður að ljúka öllum spilum til að birtast í úrslitum. Retry er aðeins til æfinga og breytir aldrei opinberu skori.',
      speedball: 'Spilaðu eins mörg spil og þú getur áður en tíminn rennur út. Hráskor allra lokinna spila leggst saman. Hvert lokið spil telur í úrslitum. Retry er aðeins til æfinga og breytir aldrei opinberu skori.',
      visibleCards: 'Spilaðu {count} spil með spil beggja varnarspilara sýnileg. Taktu hámarksfjölda slaga í hverju spili til að birtast í úrslitum. Engin röðun er og mótið notar ekki mótakvótann þinn.',
      slamOnly: 'Spilaðu {count} slemmuspil með spil varnarspilaranna falin. IMP og staða uppfærast eftir hvert lokið spil. Úrslitin telja í daglegu stigatöflunni.',
      duel: 'Spilaðu {count} spil sem sagnhafi. Andstæðingurinn spilar sömu spil. Berið saman heildarskorin.',
      tournamentResults: 'Hér sérðu núverandi röðun og úrslit mótsins. Veldu spilara til að sjá skor hvers spils.',
      dailyLeaderboard: 'Hér sérðu sameinaða daglega stigatöflu lokinna móta á núverandi Leonardo Bridge-degi.',
      leonardoLeaderboard: "Æfingar og lokið mót telja með.\n\nDaglegt: í dag frá kl. 00:00 UTC.\nMánaðarlegt: frá fyrsta degi yfirstandandi mánaðar kl. 00:00 UTC.\nFrá upphafi: öll skráð stig.\n\nHærri heildarstig gefa hærra sæti. Nákvæmlega jafnar summur deila sæti, áður en námundað er að tveimur aukastöfum. Gestir birtast ekki á stigatöflunum.",
      defenders: '{west} og {east} eru tölvustýrðir varnarspilarar. Nöfn þeirra koma frá {source}.',
    },
  },
  hu: {
    tournamentTitle: 'VERSENYINFORMÁCIÓ', resultsTitle: 'EREDMÉNYINFORMÁCIÓ', defendersTitle: 'A VÉDŐK', close: 'Bezárás', english: 'English',
    messages: {
      normalTournament: 'Játssz le {count} leosztást a verseny vége előtt. Az eredmény minden befejezett leosztás után frissül. Az eredményekhez minden leosztást be kell fejezned. A Retry csak gyakorlásra szolgál, és nem változtatja meg a hivatalos eredményt.',
      speedball: 'Játssz le annyi leosztást, amennyit csak tudsz az idő lejárta előtt. Az összes befejezett leosztás nyers pontszáma összeadódik. Minden befejezett leosztás számít az eredményben. A Retry csak gyakorlásra szolgál, és nem változtatja meg a hivatalos eredményt.',
      visibleCards: 'Játssz le {count} leosztást úgy, hogy mindkét védő lapjai láthatók. Minden leosztásban érd el a maximális ütésszámot, hogy megjelenj az eredményekben. Nincs rangsor, és a verseny nem használja fel a versenykeretedet.',
      slamOnly: 'Játssz le {count} szlemleosztást rejtett védőlapokkal. Az IMP és a helyezés minden befejezett leosztás után frissül. Az eredmény bekerül a napi ranglistába.',
      duel: 'Játssz le {count} leosztást felvevőként. Az ellenfeled ugyanazokat a leosztásokat játssza. Hasonlítsátok össze az összpontszámot.',
      tournamentResults: 'Itt láthatod a verseny aktuális rangsorát és eredményeit. Válassz egy játékost az egyes leosztások pontszámához.',
      dailyLeaderboard: 'Itt láthatod az aktuális Leonardo Bridge-napon befejezett versenyek összesített napi ranglistáját.',
      leonardoLeaderboard: "A gyakorlás és a befejezett versenyek számítanak.\n\nNapi: ma 00:00 UTC-től.\nHavi: az aktuális hónap első napján 00:00 UTC-től.\nÖsszesített: az összes rögzített pont.\n\nA magasabb összeg jobb helyezést jelent. A pontosan azonos összegek azonos helyezést kapnak, a két tizedesjegyre kerekítés előtt. A vendégek nem jelennek meg a ranglistákon.",
      defenders: '{west} és {east} számítógép által vezérelt védők. Nevük innen származik: {source}.',
    },
  },
  id: {
    tournamentTitle: 'INFORMASI TURNAMEN', resultsTitle: 'INFORMASI HASIL', defendersTitle: 'PEMAIN BERTAHAN', close: 'Tutup', english: 'English',
    messages: {
      normalTournament: 'Mainkan {count} papan sebelum turnamen berakhir. Hasil diperbarui setelah setiap papan selesai. Anda harus menyelesaikan semua papan agar muncul di hasil. Retry hanya untuk latihan dan tidak pernah mengubah skor resmi.',
      speedball: 'Mainkan sebanyak mungkin papan sebelum waktu habis. Skor mentah dari semua papan yang selesai dijumlahkan. Setiap papan yang selesai dihitung dalam hasil. Retry hanya untuk latihan dan tidak pernah mengubah skor resmi.',
      visibleCards: 'Mainkan {count} papan dengan kartu kedua pemain bertahan terlihat. Raih trik maksimum di setiap papan agar muncul di hasil. Tidak ada peringkat dan turnamen ini tidak memakai kuota turnamen Anda.',
      slamOnly: 'Mainkan {count} papan slam dengan kartu pemain bertahan tersembunyi. IMP dan posisi diperbarui setelah setiap papan selesai. Hasil termasuk dalam Papan Peringkat Harian.',
      duel: 'Mainkan {count} papan sebagai declarer. Lawan memainkan papan yang sama. Bandingkan total skor.',
      tournamentResults: 'Di sini Anda dapat melihat peringkat dan hasil turnamen saat ini. Pilih pemain untuk melihat skor setiap papan.',
      dailyLeaderboard: 'Di sini Anda dapat melihat Papan Peringkat Harian gabungan dari turnamen yang selesai pada hari Leonardo Bridge saat ini.',
      leonardoLeaderboard: "Latihan dan turnamen yang telah selesai dihitung.\n\nHarian: hari ini sejak 00:00 UTC.\nBulanan: sejak hari pertama bulan ini pukul 00:00 UTC.\nSepanjang waktu: semua poin yang tercatat.\n\nTotal lebih tinggi mendapat peringkat lebih tinggi. Total yang persis sama berbagi peringkat, sebelum pembulatan ke dua angka desimal. Tamu tidak muncul di peringkat.",
      defenders: '{west} dan {east} adalah pemain bertahan yang dikendalikan komputer. Nama mereka berasal dari {source}.',
    },
  },
  ar: {
    tournamentTitle: 'معلومات البطولة', resultsTitle: 'معلومات النتائج', defendersTitle: 'المدافعون', close: 'إغلاق', english: 'English',
    messages: {
      normalTournament: 'العب {count} توزيعات قبل انتهاء البطولة. تتحدث نتيجتك بعد كل توزيعة مكتملة. يجب إكمال جميع التوزيعات للظهور في النتائج. Retry للتدريب فقط ولا يغير نتيجتك الرسمية.',
      speedball: 'العب أكبر عدد ممكن من التوزيعات قبل انتهاء الوقت. تُجمع النقاط الخام لجميع التوزيعات المكتملة. كل توزيعة مكتملة تُحتسب في النتائج. Retry للتدريب فقط ولا يغير نتيجتك الرسمية.',
      visibleCards: 'العب {count} توزيعات مع ظهور أوراق المدافعين. حقق الحد الأقصى من اللمّات في كل توزيعة للظهور في النتائج. لا يوجد ترتيب، وهذه البطولة لا تستهلك حصتك من البطولات.',
      slamOnly: 'العب {count} توزيعات سلام مع إخفاء أوراق المدافعين. تتحدث نقاط IMP والمركز بعد كل توزيعة مكتملة. تدخل النتيجة في لوحة الصدارة اليومية.',
      duel: 'العب {count} توزيعات كمصرّح. يلعب خصمك التوزيعات نفسها. قارنوا مجموع النقاط.',
      tournamentResults: 'يمكنك هنا رؤية ترتيب البطولة ونتائجها الحالية. اختر لاعبًا لرؤية نتيجة كل توزيعة.',
      dailyLeaderboard: 'يمكنك هنا رؤية لوحة الصدارة اليومية المجمعة للبطولات المكتملة في يوم Leonardo Bridge الحالي.',
      leonardoLeaderboard: "يُحتسب التدريب والبطولات المكتملة.\n\nاليومي: اليوم من الساعة 00:00 UTC.\nالشهري: من أول يوم في الشهر الحالي الساعة 00:00 UTC.\nعبر كل الأوقات: جميع النقاط المسجلة.\n\nتحتل المجاميع الأعلى المراكز الأولى. تتشارك المجاميع المتساوية تمامًا المركز نفسه، قبل التقريب إلى منزلتين عشريتين. لا يظهر الضيوف في الترتيب.",
      defenders: '{west} و{east} مدافعان يتحكم بهما الكمبيوتر. أسماؤهما من {source}.',
    },
  },
  th: {
    tournamentTitle: 'ข้อมูลทัวร์นาเมนต์', resultsTitle: 'ข้อมูลผลการแข่งขัน', defendersTitle: 'ฝ่ายป้องกัน', close: 'ปิด', english: 'English',
    messages: {
      normalTournament: 'เล่น {count} บอร์ดก่อนทัวร์นาเมนต์จบ ผลของคุณจะอัปเดตหลังจบแต่ละบอร์ด คุณต้องเล่นให้ครบทุกบอร์ดจึงจะแสดงในผลการแข่งขัน Retry ใช้สำหรับฝึกซ้อมเท่านั้นและไม่เปลี่ยนคะแนนทางการ',
      speedball: 'เล่นให้ได้มากที่สุดก่อนหมดเวลา คะแนนดิบของทุกบอร์ดที่เล่นจบจะถูกรวม ทุกบอร์ดที่เล่นจบจะนับในผลการแข่งขัน Retry ใช้สำหรับฝึกซ้อมเท่านั้นและไม่เปลี่ยนคะแนนทางการ',
      visibleCards: 'เล่น {count} บอร์ดโดยเห็นไพ่ของฝ่ายป้องกันทั้งสอง ทำจำนวนทริกสูงสุดในทุกบอร์ดเพื่อแสดงในผลการแข่งขัน ไม่มีการจัดอันดับและทัวร์นาเมนต์นี้ไม่ใช้โควตาทัวร์นาเมนต์ของคุณ',
      slamOnly: 'เล่นสแลม {count} บอร์ดโดยซ่อนไพ่ฝ่ายป้องกัน IMP และอันดับจะอัปเดตหลังจบแต่ละบอร์ด ผลจะรวมในอันดับประจำวัน',
      duel: 'เล่น {count} บอร์ดในฐานะผู้เล่นสัญญา คู่แข่งเล่นบอร์ดเดียวกัน เปรียบเทียบคะแนนรวม',
      tournamentResults: 'ที่นี่คุณสามารถดูอันดับและผลของทัวร์นาเมนต์ปัจจุบัน เลือกผู้เล่นเพื่อดูคะแนนแต่ละบอร์ด',
      dailyLeaderboard: 'ที่นี่คุณสามารถดูอันดับประจำวันรวมจากทัวร์นาเมนต์ที่จบแล้วในวัน Leonardo Bridge ปัจจุบัน',
      leonardoLeaderboard: "นับคะแนนจากการฝึกซ้อมและทัวร์นาเมนต์ที่จบแล้ว\n\nรายวัน: วันนี้ตั้งแต่ 00:00 UTC\nรายเดือน: ตั้งแต่วันแรกของเดือนปัจจุบัน เวลา 00:00 UTC\nตลอดกาล: คะแนนทั้งหมดที่บันทึกไว้\n\nคะแนนรวมสูงกว่าจะอยู่ในอันดับที่สูงกว่า หากคะแนนรวมเท่ากันทุกประการก่อนปัดเป็นทศนิยมสองตำแหน่ง จะได้อันดับเดียวกัน ผู้เล่นรับเชิญจะไม่ปรากฏในอันดับ",
      defenders: '{west} และ {east} เป็นฝ่ายป้องกันที่ควบคุมโดยคอมพิวเตอร์ ชื่อของพวกเขามาจาก {source}',
    },
  },
  ko: {
    tournamentTitle: '토너먼트 정보', resultsTitle: '결과 정보', defendersTitle: '수비수', close: '닫기', english: 'English',
    messages: {
      normalTournament: '토너먼트가 끝나기 전에 {count} 보드를 플레이하세요. 완료한 보드마다 결과가 갱신됩니다. 결과에 표시되려면 모든 보드를 완료해야 합니다. Retry는 연습 전용이며 공식 점수는 바뀌지 않습니다.',
      speedball: '시간이 끝나기 전에 최대한 많은 보드를 플레이하세요. 완료한 모든 보드의 원점수를 합산합니다. 완료한 각 보드가 결과에 반영됩니다. Retry는 연습 전용이며 공식 점수는 바뀌지 않습니다.',
      visibleCards: '두 수비수의 카드를 보면서 {count} 보드를 플레이하세요. 결과에 표시되려면 모든 보드에서 최대 트릭을 달성해야 합니다. 순위는 없으며 토너먼트 참가 한도를 사용하지 않습니다.',
      slamOnly: '수비수의 카드를 숨긴 채 {count} 슬램 보드를 플레이하세요. 완료한 보드마다 IMP와 순위가 갱신됩니다. 결과는 일일 순위표에 포함됩니다.',
      duel: '선언자로 {count} 보드를 플레이하세요. 상대도 같은 보드를 플레이합니다. 총점을 비교하세요.',
      tournamentResults: '현재 토너먼트 순위와 결과를 볼 수 있습니다. 플레이어를 선택하면 각 보드의 점수를 볼 수 있습니다.',
      dailyLeaderboard: '현재 Leonardo Bridge 날짜에 완료된 토너먼트의 통합 일일 순위표를 볼 수 있습니다.',
      leonardoLeaderboard: "연습과 완료된 토너먼트가 반영됩니다.\n\n일간: 오늘 00:00 UTC부터.\n월간: 이번 달 첫날 00:00 UTC부터.\n전체: 기록된 모든 포인트.\n\n총점이 높을수록 순위가 높습니다. 소수점 둘째 자리로 반올림하기 전의 총점이 정확히 같으면 공동 순위입니다. 게스트는 순위에 표시되지 않습니다.",
      defenders: '{west}와 {east}는 컴퓨터가 조종하는 수비수입니다. 이름은 {source}에서 가져왔습니다.',
    },
  },
} as Record<InfoLanguage, Copy>;

const LANGUAGE_ALIASES: Record<string, InfoLanguage> = {
  nb: 'no',
  nn: 'no',
  iw: 'he',
  in: 'id',
};

function normalizeLanguage(locale: string): InfoLanguage {
  const base = locale.toLowerCase().split(/[-_]/)[0];
  if ((INFO_LANGUAGES as readonly string[]).includes(base)) {
    return base as InfoLanguage;
  }
  return LANGUAGE_ALIASES[base] ?? 'en';
}

const PLAYER_LANGUAGE_STORAGE_KEY = 'leonardo-player-language';
const ENGLISH_ACCOUNT_LANGUAGE_STORAGE_KEY = 'leonardo-player-language:vasilo';
const playerLanguageListeners = new Set<() => void>();
const selectedPlayerLanguages = new Map<string, InfoLanguage>();
let playerLanguageRevision = 0;

export const getPlayerInfoLanguageRevision = () => playerLanguageRevision + getAccountPresentationRevision();

function playerLanguageStorageKey(): string {
  return getEnglishAccountPreview()
    ? ENGLISH_ACCOUNT_LANGUAGE_STORAGE_KEY : PLAYER_LANGUAGE_STORAGE_KEY;
}

function savedPlayerLanguage(storageKey = playerLanguageStorageKey()): InfoLanguage | null {
  try {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem(storageKey);
    return saved && (INFO_LANGUAGES as readonly string[]).includes(saved)
      ? saved as InfoLanguage : null;
  } catch {
    return null;
  }
}

export function hasPlayerInfoLanguagePreference(): boolean {
  return getEnglishAccountPreview()
    || selectedPlayerLanguages.has(playerLanguageStorageKey())
    || savedPlayerLanguage() !== null;
}

export function getPlayerInfoLanguage(): InfoLanguage {
  const selected = selectedPlayerLanguages.get(playerLanguageStorageKey()) ?? savedPlayerLanguage();
  if (selected) return selected;
  // Vasilo represents a player in England using an English browser.
  // This is the initial browser language; an explicit selection always takes priority.
  if (getEnglishAccountPreview()) return normalizeLanguage('en-GB');
  try {
    return normalizeLanguage(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return 'en';
  }
}

export function selectPlayerInfoLanguage(language: InfoLanguage) {
  if (!(INFO_LANGUAGES as readonly string[]).includes(language)) return;
  const storageKey = playerLanguageStorageKey();
  selectedPlayerLanguages.set(storageKey, language);
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, language);
    }
  } catch { /* Η επιλογή διατηρείται και χωρίς αποθήκευση. */ }
  playerLanguageRevision += 1;
  playerLanguageListeners.forEach(listener => listener());
}

function syncStoredPlayerLanguage(event: StorageEvent) {
  if (event.key === null) {
    selectedPlayerLanguages.clear();
  } else {
    if (event.key !== PLAYER_LANGUAGE_STORAGE_KEY && event.key !== ENGLISH_ACCOUNT_LANGUAGE_STORAGE_KEY) return;
    const saved = savedPlayerLanguage(event.key);
    if (saved) selectedPlayerLanguages.set(event.key, saved);
    else selectedPlayerLanguages.delete(event.key);
    // Keep inactive account preferences current without changing the active language.
    if (event.key !== playerLanguageStorageKey()) return;
  }
  playerLanguageRevision += 1;
  playerLanguageListeners.forEach(listener => listener());
}

export function subscribePlayerInfoLanguage(listener: () => void) {
  if (playerLanguageListeners.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('storage', syncStoredPlayerLanguage);
  }
  playerLanguageListeners.add(listener);
  const unsubscribeAccount = subscribeAccountPresentation(listener);
  return () => {
    unsubscribeAccount();
    playerLanguageListeners.delete(listener);
    if (playerLanguageListeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', syncStoredPlayerLanguage);
    }
  };
}

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export function getInfoCopy(
  language: InfoLanguage,
  key: InfoMessageKey,
  values: Record<string, string | number> = {}
) {
  const copy = copies[language] ?? en;
  return {
    tournamentTitle: copy.tournamentTitle,
    resultsTitle: copy.resultsTitle,
    defendersTitle: copy.defendersTitle,
    close: copy.close,
    english: copy.english,
    message: interpolate(copy.messages[key] ?? en.messages[key], values),
  };
}

