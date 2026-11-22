// Only compact card-count expressions; bids, points and distributions are untouched.
const el={2:'δί',3:'τρί',4:'τετρά',5:'πεντά',6:'εξά',7:'επτά',8:'οκτά',9:'εννεά',10:'δεκά',11:'ενδεκά',12:'δωδεκά',13:'δεκατρί'};
const en={2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve',13:'thirteen'};
const pl={2:'dwu',3:'trój',4:'cztero',5:'pięcio',6:'sześcio',7:'siedmio',8:'ośmio',9:'dziewięcio',10:'dziesięcio',11:'jedenasto',12:'dwunasto',13:'trzynasto'};
const da={2:'to',3:'tre',4:'fire',5:'fem',6:'seks',7:'syv',8:'otte',9:'ni',10:'ti',11:'elleve',12:'tolv',13:'tretten'};
const ko={2:'두',3:'세',4:'네',5:'다섯',6:'여섯',7:'일곱',8:'여덟',9:'아홉',10:'열',11:'열한',12:'열두',13:'열세'};
const ja={2:'二',3:'三',4:'四',5:'五',6:'六',7:'七',8:'八',9:'九',10:'十',11:'十一',12:'十二',13:'十三'};
export function cardLengthSpeech(value,language){
 const replace=(pattern,words,join='')=>value.replace(pattern,(_,n,suffix)=>words[Number(n.normalize('NFKC'))]+join+suffix);
 switch(language){
 case 'el':return replace(/(?<![\p{L}\p{N}–-])(1[0-3]|[2-9])(φυλλ(?:ου|ων|ες|οι|ος|ο|η|α|ης|ους))(?!\p{L})/gu,el);
 case 'en':return replace(/(?<![\p{L}\p{N}–-])(1[0-3]|[2-9])[-‑](cards?)(?!\p{L})/gu,en,'-');
 case 'pl':return replace(/(?<![\p{L}\p{N}–-])(1[0-3]|[2-9])[-‑](kartow\p{L}*)/gu,pl);
 case 'da':return replace(/(?<![\p{L}\p{N}–-])(1[0-3]|[2-9])[-‑](korts|farve(?:n)?)(?!\p{L})/gu,da);
 case 'ko':return replace(/(?<![\p{L}\p{N}–-])(1[0-3]|[2-9])\s*(장)/gu,ko,' ');
 case 'ja':return replace(/(?<![\p{N}–-])([２-９2-9]|1[0-3]|１[０-３])(枚)/gu,ja);
 default:return value;
 }
}
