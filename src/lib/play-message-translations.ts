import type { InfoLanguage } from '@/lib/info-popup-translations';

type Copy={generic:string;incompleteOne:string;incompleteAll:string;full:string;noneLeft:string};
const copies:Record<InfoLanguage,Copy>={
en:{generic:'The action could not be completed. Please try again.',incompleteOne:'You did not complete a deal, so you will not appear in the leaderboard.',incompleteAll:'You did not complete all {count} deals, so you will not appear in the leaderboard.',full:'This Tournament is full.',noneLeft:'No Tournaments remaining today.'},
fr:{generic:'L’action n’a pas pu être effectuée. Réessayez.',incompleteOne:'Vous n’avez terminé aucune donne et n’apparaîtrez donc pas au classement.',incompleteAll:'Vous n’avez pas terminé les {count} donnes et n’apparaîtrez donc pas au classement.',full:'Ce tournoi est complet.',noneLeft:'Plus aucun tournoi disponible aujourd’hui.'},
nl:{generic:'De actie kon niet worden voltooid. Probeer opnieuw.',incompleteOne:'Je hebt geen spel voltooid en komt daarom niet in de ranglijst.',incompleteAll:'Je hebt niet alle {count} spellen voltooid en komt daarom niet in de ranglijst.',full:'Dit toernooi is vol.',noneLeft:'Vandaag zijn er geen toernooien meer beschikbaar.'},
zh:{generic:'操作无法完成，请重试。',incompleteOne:'您没有完成任何牌局，因此不会出现在排行榜中。',incompleteAll:'您没有完成全部 {count} 副牌，因此不会出现在排行榜中。',full:'本场比赛已满。',noneLeft:'今天没有剩余比赛次数。'},
it:{generic:'Impossibile completare l’azione. Riprova.',incompleteOne:'Non hai completato alcuna smazzata, quindi non apparirai in classifica.',incompleteAll:'Non hai completato tutte le {count} smazzate, quindi non apparirai in classifica.',full:'Questo torneo è completo.',noneLeft:'Nessun torneo disponibile oggi.'},
de:{generic:'Die Aktion konnte nicht abgeschlossen werden. Bitte erneut versuchen.',incompleteOne:'Du hast kein Board abgeschlossen und erscheinst daher nicht in der Rangliste.',incompleteAll:'Du hast nicht alle {count} Boards abgeschlossen und erscheinst daher nicht in der Rangliste.',full:'Dieses Turnier ist voll.',noneLeft:'Heute sind keine Turniere mehr verfügbar.'},
sv:{generic:'Åtgärden kunde inte slutföras. Försök igen.',incompleteOne:'Du slutförde ingen giv och visas därför inte i rankingen.',incompleteAll:'Du slutförde inte alla {count} givar och visas därför inte i rankingen.',full:'Turneringen är full.',noneLeft:'Inga turneringar återstår i dag.'},
da:{generic:'Handlingen kunne ikke gennemføres. Prøv igen.',incompleteOne:'Du fuldførte ikke et spil og vises derfor ikke på ranglisten.',incompleteAll:'Du fuldførte ikke alle {count} spil og vises derfor ikke på ranglisten.',full:'Turneringen er fuld.',noneLeft:'Ingen turneringer tilbage i dag.'},
no:{generic:'Handlingen kunne ikke fullføres. Prøv igjen.',incompleteOne:'Du fullførte ikke et spill og vises derfor ikke på resultatlisten.',incompleteAll:'Du fullførte ikke alle {count} spill og vises derfor ikke på resultatlisten.',full:'Turneringen er full.',noneLeft:'Ingen turneringer igjen i dag.'},
pl:{generic:'Nie udało się wykonać działania. Spróbuj ponownie.',incompleteOne:'Nie ukończono rozdania, więc nie pojawisz się w rankingu.',incompleteAll:'Nie ukończono wszystkich {count} rozdań, więc nie pojawisz się w rankingu.',full:'Ten turniej jest pełny.',noneLeft:'Brak turniejów na dzisiaj.'},
ja:{generic:'操作を完了できませんでした。もう一度お試しください。',incompleteOne:'ボードを完了しなかったため、ランキングには表示されません。',incompleteAll:'全 {count} ボードを完了しなかったため、ランキングには表示されません。',full:'このトーナメントは満員です。',noneLeft:'本日プレイできるトーナメントは残っていません。'},
he:{generic:'לא ניתן להשלים את הפעולה. נסו שוב.',incompleteOne:'לא השלמת חלוקה ולכן לא תופיע בדירוג.',incompleteAll:'לא השלמת את כל {count} החלוקות ולכן לא תופיע בדירוג.',full:'הטורניר מלא.',noneLeft:'לא נותרו טורנירים להיום.'},
es:{generic:'No se pudo completar la acción. Inténtalo de nuevo.',incompleteOne:'No completaste ninguna mano, por lo que no aparecerás en la clasificación.',incompleteAll:'No completaste las {count} manos, por lo que no aparecerás en la clasificación.',full:'Este torneo está completo.',noneLeft:'No quedan torneos para hoy.'},
pt:{generic:'Não foi possível concluir a ação. Tente novamente.',incompleteOne:'Você não concluiu uma mão e não aparecerá na classificação.',incompleteAll:'Você não concluiu todas as {count} mãos e não aparecerá na classificação.',full:'Este torneio está lotado.',noneLeft:'Não há torneios restantes hoje.'},
hi:{generic:'कार्रवाई पूरी नहीं हो सकी। फिर प्रयास करें।',incompleteOne:'आपने कोई डील पूरी नहीं की, इसलिए लीडरबोर्ड में नहीं दिखेंगे।',incompleteAll:'आपने सभी {count} डील पूरी नहीं कीं, इसलिए लीडरबोर्ड में नहीं दिखेंगे।',full:'यह टूर्नामेंट भर चुका है।',noneLeft:'आज कोई टूर्नामेंट शेष नहीं है।'},
tr:{generic:'İşlem tamamlanamadı. Tekrar deneyin.',incompleteOne:'Bir eli tamamlamadığınız için liderlik tablosunda görünmeyeceksiniz.',incompleteAll:'{count} elin tamamını bitirmediğiniz için liderlik tablosunda görünmeyeceksiniz.',full:'Bu Turnuva dolu.',noneLeft:'Bugün kalan Turnuva yok.'},
ru:{generic:'Не удалось выполнить действие. Попробуйте снова.',incompleteOne:'Вы не завершили сдачу и не появитесь в рейтинге.',incompleteAll:'Вы не завершили все {count} сдач и не появитесь в рейтинге.',full:'Этот турнир заполнен.',noneLeft:'На сегодня турниров больше нет.'},
el:{generic:'Η ενέργεια δεν ολοκληρώθηκε. Δοκίμασε ξανά.',incompleteOne:'Δεν ολοκλήρωσες διανομή, οπότε δεν θα εμφανιστείς στην κατάταξη.',incompleteAll:'Δεν ολοκλήρωσες και τις {count} διανομές, οπότε δεν θα εμφανιστείς στην κατάταξη.',full:'Αυτό το Τουρνουά είναι πλήρες.',noneLeft:'Δεν απομένουν Τουρνουά για σήμερα.'},
fi:{generic:'Toimintoa ei voitu suorittaa. Yritä uudelleen.',incompleteOne:'Et suorittanut jakoa, joten et näy tulostaulukossa.',incompleteAll:'Et suorittanut kaikkia {count} jakoa, joten et näy tulostaulukossa.',full:'Tämä turnaus on täynnä.',noneLeft:'Tälle päivälle ei ole turnauksia jäljellä.'},
cs:{generic:'Akci se nepodařilo dokončit. Zkuste to znovu.',incompleteOne:'Nedokončili jste rozdání, takže se nezobrazíte v pořadí.',incompleteAll:'Nedokončili jste všech {count} rozdání, takže se nezobrazíte v pořadí.',full:'Tento turnaj je plný.',noneLeft:'Pro dnešek nezbývají žádné turnaje.'},
is:{generic:'Ekki tókst að ljúka aðgerðinni. Reyndu aftur.',incompleteOne:'Þú laukst ekki spili og birtist því ekki í stöðutöflunni.',incompleteAll:'Þú laukst ekki öllum {count} spilunum og birtist því ekki í stöðutöflunni.',full:'Mótið er fullt.',noneLeft:'Engin mót eru eftir í dag.'},
hu:{generic:'A művelet nem sikerült. Próbáld újra.',incompleteOne:'Nem fejeztél be leosztást, ezért nem jelensz meg a ranglistán.',incompleteAll:'Nem fejezted be mind a(z) {count} leosztást, ezért nem jelensz meg a ranglistán.',full:'Ez a verseny megtelt.',noneLeft:'Mára nem maradt verseny.'},
id:{generic:'Tindakan tidak dapat diselesaikan. Coba lagi.',incompleteOne:'Anda tidak menyelesaikan papan sehingga tidak akan tampil di peringkat.',incompleteAll:'Anda tidak menyelesaikan seluruh {count} papan sehingga tidak akan tampil di peringkat.',full:'Turnamen ini penuh.',noneLeft:'Tidak ada Turnamen tersisa hari ini.'},
ar:{generic:'تعذر إكمال الإجراء. حاول مرة أخرى.',incompleteOne:'لم تكمل توزيعة، لذلك لن تظهر في الترتيب.',incompleteAll:'لم تكمل التوزيعات الـ{count} كلها، لذلك لن تظهر في الترتيب.',full:'هذه البطولة ممتلئة.',noneLeft:'لا توجد بطولات متبقية اليوم.'},
th:{generic:'ดำเนินการไม่สำเร็จ โปรดลองอีกครั้ง',incompleteOne:'คุณเล่นไพ่ไม่จบ จึงไม่ปรากฏในกระดานผู้นำ',incompleteAll:'คุณเล่นไพ่ {count} ชุดไม่ครบ จึงไม่ปรากฏในกระดานผู้นำ',full:'ทัวร์นาเมนต์นี้เต็มแล้ว',noneLeft:'วันนี้ไม่มีทัวร์นาเมนต์เหลือแล้ว'},
ko:{generic:'작업을 완료할 수 없습니다. 다시 시도하세요.',incompleteOne:'보드를 완료하지 않아 순위표에 표시되지 않습니다.',incompleteAll:'{count}개 보드를 모두 완료하지 않아 순위표에 표시되지 않습니다.',full:'이 토너먼트은 정원이 찼습니다.',noneLeft:'오늘 남은 토너먼트가 없습니다.'}
};
const tournamentRegistrationBlockMessages:Record<InfoLanguage,string>={
en:'You are registered for a Tournament that starts soon. Cancel your registration before starting another Tournament or Challenge.',
fr:'Vous êtes inscrit à un tournoi qui commence bientôt. Annulez votre inscription avant de commencer un autre tournoi ou Défi.',
nl:'Je bent ingeschreven voor een toernooi dat binnenkort begint. Annuleer je inschrijving voordat je een ander toernooi of Uitdaging start.',
zh:'您已报名参加一场即将开始的比赛。请先取消报名，再开始另一场比赛或 挑战。',
it:'Sei iscritto a un torneo che inizierà a breve. Annulla l’iscrizione prima di iniziare un altro torneo o Sfida.',
de:'Du bist für ein Turnier angemeldet, das bald beginnt. Melde dich ab, bevor du ein anderes Turnier oder Herausforderung startest.',
sv:'Du är anmäld till en turnering som börjar snart. Avanmäl dig innan du startar en annan turnering eller Utmaning.',
da:'Du er tilmeldt en turnering, der snart begynder. Afmeld dig, før du starter en anden turnering eller Udfordring.',
no:'Du er påmeldt en turnering som starter snart. Avmeld deg før du starter en annen turnering eller Utfordring.',
pl:'Jesteś zapisany do turnieju, który wkrótce się rozpocznie. Anuluj zapis przed rozpoczęciem innego turnieju lub Wyzwania.',
ja:'まもなく始まるトーナメントに登録されています。別のトーナメントまたは チャレンジ を始める前に登録を取り消してください。',
he:'נרשמת לטורניר שמתחיל בקרוב. יש לבטל את ההרשמה לפני התחלת טורניר אחר או אתגר.',
es:'Estás inscrito en un torneo que comenzará pronto. Cancela tu inscripción antes de empezar otro torneo o Desafío.',
pt:'Você está inscrito em um torneio que começará em breve. Cancele sua inscrição antes de iniciar outro torneio ou Desafio.',
hi:'आप एक ऐसे टूर्नामेंट में पंजीकृत हैं जो जल्द शुरू होगा। कोई दूसरा टूर्नामेंट या चुनौती शुरू करने से पहले अपना पंजीकरण रद्द करें।',
tr:'Yakında başlayacak bir Turnuvaya kayıtlısın. Başka bir Turnuva veya Meydan okuma başlatmadan önce kaydını iptal et.',
ru:'Вы зарегистрированы на турнир, который скоро начнётся. Отмените регистрацию, прежде чем начинать другой турнир или Вызов.',
el:'Έχεις εγγραφεί σε Τουρνουά που ξεκινά σύντομα. Ακύρωσε την εγγραφή σου πριν ξεκινήσεις άλλο Τουρνουά ή Πρόκληση.',
fi:'Olet ilmoittautunut pian alkavaan turnaukseen. Peru ilmoittautumisesi ennen kuin aloitat toisen turnauksen tai Haasteen.',
cs:'Jste přihlášeni do turnaje, který brzy začne. Před zahájením jiného turnaje nebo Výzvy zrušte svou registraci.',
is:'Þú ert skráð(ur) í mót sem hefst fljótlega. Afskráðu þig áður en þú byrjar annað mót eða Áskorun.',
hu:'Regisztráltál egy hamarosan kezdődő versenyre. Töröld a regisztrációdat, mielőtt másik versenyt vagy Kihívást indítasz.',
id:'Anda terdaftar untuk Turnamen yang akan segera dimulai. Batalkan pendaftaran sebelum memulai Turnamen atau Tantangan lain.',
ar:'أنت مسجل في بطولة ستبدأ قريبًا. ألغِ تسجيلك قبل بدء بطولة أخرى أو تحدٍ.',
th:'คุณลงทะเบียนทัวร์นาเมนต์ที่กำลังจะเริ่มเร็ว ๆ นี้ โปรดยกเลิกการลงทะเบียนก่อนเริ่มทัวร์นาเมนต์หรือ การแข่งขันท้าทาย อื่น',
ko:'곧 시작되는 토너먼트에 등록되어 있습니다. 다른 토너먼트나 챌린지를 시작하기 전에 등록을 취소하세요.'
};
function fill(text:string,values:Record<string,string>):string{return text.replace(/\{(\w+)\}/g,(_,k:string)=>values[k]??'');}
export function localizePlayMessage(message:string,language:InfoLanguage):string{
 message=message.replace(/\bDuels?\b/g,(name)=>name==='Duels'?'Challenges':'Challenge');
 if(message.startsWith('OPEN_TABLE_INVITE_ACCEPT_ERROR:')){
  const code=message.slice('OPEN_TABLE_INVITE_ACCEPT_ERROR:'.length);
  return `${copies[language].generic}\nOpen Table · accept · ${code}`;
 }
 if(message==='You are registered for a Tournament that starts soon. Cancel your registration before starting another Tournament or Challenge.')return tournamentRegistrationBlockMessages[language];
 if(language==='en')return message;
 const c=copies[language];
 let match=message.match(/^You did not complete all (\d+) deals/); if(match)return fill(c.incompleteAll,{count:match[1]});
 if(message.includes('did not complete a deal'))return c.incompleteOne;
 if(message==='This Tournament is full.')return c.full;
 if(message==='No Tournaments remaining today.')return c.noneLeft;
 return c.generic;
}

