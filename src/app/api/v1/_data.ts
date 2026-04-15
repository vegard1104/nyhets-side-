export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  imageUrl: string | null;
  category: string;
  source: string;
  publishedAt: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
}

export interface Bookmark {
  id: string;
  articleId: string;
  article?: Article;
  createdAt: string;
}

export interface ReadingHistoryEntry {
  id: string;
  articleId: string;
  article?: Article;
  readAt: string;
}

export const categories: Category[] = [
  { id: "cat-1", name: "Politikk", slug: "politikk" },
  { id: "cat-2", name: "Sport", slug: "sport" },
  { id: "cat-3", name: "Teknologi", slug: "teknologi" },
  { id: "cat-4", name: "Økonomi", slug: "okonomi" },
  { id: "cat-5", name: "Kultur", slug: "kultur" },
];

export const sources: Source[] = [
  { id: "src-1", name: "NRK", url: "https://www.nrk.no" },
  { id: "src-2", name: "VG", url: "https://www.vg.no" },
  { id: "src-3", name: "Dagbladet", url: "https://www.dagbladet.no" },
  { id: "src-4", name: "Aftenposten", url: "https://www.aftenposten.no" },
];

export const articles: Article[] = [
  {
    id: "art-1",
    title: "Regjeringen legger frem ny klimaplan for 2030",
    summary:
      "Statsminister Jonas Gahr Støre presenterte tirsdag regjeringens oppdaterte klimaplan med nye tiltak for å nå utslippsmålene innen 2030.",
    content: `<article>
<p>Statsminister Jonas Gahr Støre presenterte tirsdag regjeringens oppdaterte klimaplan med nye tiltak for å nå utslippsmålene innen 2030. Planen inneholder blant annet økt satsing på karbonfangst og -lagring, samt nye incentiver for grønn industri.</p>
<h2>Hovedpunkter i planen</h2>
<p>Blant de viktigste tiltakene er en dobling av CO2-avgiften for petroleumssektoren og en ny støtteordning for bedrifter som investerer i klimavennlig teknologi. Regjeringen lover også å elektrifisere hele den offentlige bilparken innen 2028.</p>
<p>– Dette er den mest ambisiøse klimaplanen noen norsk regjering har lagt frem, sa Støre under pressekonferansen på Statsministerens kontor.</p>
<h2>Reaksjoner fra opposisjonen</h2>
<p>Høyres klimapolitiske talsperson mener planen mangler konkrete tiltak for transportsektoren, mens MDG kaller den «et skritt i riktig retning, men langt fra nok».</p>
</article>`,
    url: "https://www.nrk.no/norge/regjeringen-legger-frem-ny-klimaplan-1.17200001",
    imageUrl: "https://picsum.photos/seed/klimaplan/800/450",
    category: "Politikk",
    source: "NRK",
    publishedAt: "2026-04-15T08:30:00Z",
    createdAt: "2026-04-15T08:30:00Z",
  },
  {
    id: "art-2",
    title: "Haaland med hat trick da Norge slo Sverige 4-1",
    summary:
      "Erling Braut Haaland scoret tre mål da Norge dominerte nabooppgjøret mot Sverige på Ullevaal stadion.",
    content: `<article>
<p>Erling Braut Haaland var i storform da Norge tok imot Sverige på Ullevaal stadion tirsdag kveld. Manchester City-spissen scoret tre mål og var involvert i det fjerde da Norge vant 4-1 i Nations League.</p>
<h2>Første omgang</h2>
<p>Haaland åpnet scoringen allerede etter åtte minutter med et knallhardt skudd fra 20 meter. Sverige svarte med utligning ved Alexander Isak, men Haaland headet inn 2-1 like før pause etter et nydelig innlegg fra Martin Ødegaard.</p>
<h2>Andre omgang</h2>
<p>I andre omgang kontrollerte Norge kampen fullstendig. Haaland fullførte hat tricket etter 67 minutter, og Sander Berge satte inn 4-1 med et langskudd ti minutter senere.</p>
<p>– En fantastisk kveld for norsk fotball, sa landslagssjef Ståle Solbakken etter kampen.</p>
</article>`,
    url: "https://www.vg.no/sport/fotball/haaland-hat-trick-norge-sverige",
    imageUrl: "https://picsum.photos/seed/haaland/800/450",
    category: "Sport",
    source: "VG",
    publishedAt: "2026-04-14T21:45:00Z",
    createdAt: "2026-04-14T21:45:00Z",
  },
  {
    id: "art-3",
    title: "Norsk startup lanserer AI-verktøy for lakseoppdrett",
    summary:
      "Bergen-baserte AquaAI har utviklet et kunstig intelligens-system som kan forutsi sykdomsutbrudd i oppdrettsanlegg.",
    content: `<article>
<p>Bergen-baserte AquaAI lanserte onsdag et nytt AI-verktøy som kan revolusjonere norsk lakseoppdrett. Systemet bruker maskinlæring og sensorer til å overvåke fiskehelse i sanntid og kan forutsi sykdomsutbrudd opptil to uker før symptomene viser seg.</p>
<h2>Teknologien bak</h2>
<p>Verktøyet kombinerer undervannskameraer med avanserte algoritmer som analyserer fiskens bevegelsesmønstre, appetitt og miljøforholdene i merdene. Data fra over 50 oppdrettsanlegg langs norskekysten har blitt brukt til å trene modellen.</p>
<h2>Stor interesse fra næringen</h2>
<p>Flere av de største oppdrettsselskapene, deriblant Mowi og SalMar, har allerede signert avtaler om å ta i bruk teknologien. AquaAI hentet nylig 200 millioner kroner i en finansieringsrunde ledet av Investinor.</p>
<p>– Vi kan spare næringen for milliarder i tapte inntekter hvert år, sier gründer og daglig leder Maria Henriksen.</p>
</article>`,
    url: "https://www.aftenposten.no/okonomi/i/norsk-startup-ai-lakseoppdrett",
    imageUrl: "https://picsum.photos/seed/aquaai/800/450",
    category: "Teknologi",
    source: "Aftenposten",
    publishedAt: "2026-04-14T10:15:00Z",
    createdAt: "2026-04-14T10:15:00Z",
  },
  {
    id: "art-4",
    title: "Oslo Børs faller etter urolige markeder i Asia",
    summary:
      "Hovedindeksen på Oslo Børs åpnet ned 2,3 prosent etter kraftig fall på børsene i Tokyo og Shanghai over natten.",
    content: `<article>
<p>Oslo Børs hadde en tung start på handelsdagen onsdag etter at asiatiske markeder falt kraftig over natten. Hovedindeksen åpnet ned 2,3 prosent, trukket ned av fall i energi- og shippingaksjer.</p>
<h2>Energisektoren hardest rammet</h2>
<p>Equinor falt 3,1 prosent ved åpning, mens Aker BP var ned 4,2 prosent. Oljeprisen sank til under 70 dollar fatet etter rapporter om økt produksjon fra OPEC-landene.</p>
<h2>Analytikere advarer</h2>
<p>Sjeføkonom Kjersti Haugland i DNB Markets mener uroen kan vedvare. – Vi ser en kombinasjon av geopolitisk usikkerhet og bekymring for global vekst som presser markedene, sier Haugland til Aftenposten.</p>
<p>Lakseaksjene holdt seg derimot bedre, med Mowi opp 0,8 prosent etter sterke eksporttall.</p>
</article>`,
    url: "https://www.aftenposten.no/okonomi/oslo-bors-faller-asia-uro",
    imageUrl: "https://picsum.photos/seed/bors/800/450",
    category: "Økonomi",
    source: "Aftenposten",
    publishedAt: "2026-04-14T09:00:00Z",
    createdAt: "2026-04-14T09:00:00Z",
  },
  {
    id: "art-5",
    title: "Ny norsk film tar Cannes med storm",
    summary:
      "Joachim Triers nye film «Stillheten etterpå» er valgt ut til hovedkonkurransen i Cannes-festivalen.",
    content: `<article>
<p>Den norske regissøren Joachim Trier er igjen aktuell i Cannes. Hans nye film «Stillheten etterpå» er valgt ut til å konkurrere om Gullpalmen ved årets filmfestival i mai.</p>
<h2>Handling og skuespillere</h2>
<p>Filmen handler om en norsk familie som må konfrontere fortiden etter at en hemmelighet avdekkes under en ferietur til Nord-Norge. Renate Reinsve og Anders Danielsen Lie har hovedrollene, og filmen er delvis spilt inn i Lofoten.</p>
<h2>Internasjonal forventning</h2>
<p>Variety kaller filmen «en av de mest etterlengtede europeiske filmene i år», og flere internasjonale kritikere spår at Trier kan ta med seg sin første Gullpalme hjem til Norge.</p>
<p>– Det er en ære å komme tilbake til Cannes. Denne filmen er veldig personlig for meg, sier Trier i en pressemelding.</p>
</article>`,
    url: "https://www.dagbladet.no/kultur/joachim-trier-cannes-gullpalmen",
    imageUrl: "https://picsum.photos/seed/cannes/800/450",
    category: "Kultur",
    source: "Dagbladet",
    publishedAt: "2026-04-13T14:20:00Z",
    createdAt: "2026-04-13T14:20:00Z",
  },
  {
    id: "art-6",
    title: "Stortinget vedtar ny integreringslov",
    summary:
      "Med 98 mot 71 stemmer vedtok Stortinget tirsdag en ny integreringslov som stiller strengere krav til norskopplæring.",
    content: `<article>
<p>Etter en lang og opphetet debatt vedtok Stortinget tirsdag kveld den nye integreringsloven. Loven innfører blant annet krav om B1-nivå i norsk for å få permanent oppholdstillatelse.</p>
<h2>De viktigste endringene</h2>
<p>Den nye loven utvider introduksjonsprogrammet fra to til tre år og innfører obligatorisk samfunnskunnskapsundervisning. Kommunene får også plikt til å tilby norskopplæring innen fire uker etter bosetting.</p>
<p>– Dette handler om å gi folk bedre forutsetninger for å delta i det norske samfunnet, sa integreringsminister Marian Hussein da hun presenterte loven.</p>
<h2>Kritikk fra flere hold</h2>
<p>Rødt og SV stemte mot loven og mener språkkravene er for strenge. Flyktningorganisasjonene frykter at loven kan føre til at sårbare grupper faller utenfor.</p>
</article>`,
    url: "https://www.nrk.no/norge/stortinget-vedtar-ny-integreringslov-1.17200006",
    imageUrl: "https://picsum.photos/seed/stortinget/800/450",
    category: "Politikk",
    source: "NRK",
    publishedAt: "2026-04-13T20:10:00Z",
    createdAt: "2026-04-13T20:10:00Z",
  },
  {
    id: "art-7",
    title: "Warholm slår verdensrekord på 400 meter hekk innendørs",
    summary:
      "Karsten Warholm løp inn til 46,70 på 400 meter hekk under et stevne i Düsseldorf og satte ny verdensrekord.",
    content: `<article>
<p>Karsten Warholm fortsetter å skrive idrettshistorie. Under et internasjonalt stevne i Düsseldorf lørdag løp nordmannen inn til 46,70 på 400 meter hekk innendørs, noe som er ny verdensrekord.</p>
<h2>Overlegen seier</h2>
<p>Warholm ledet løpet fra start til mål og var over et halvt sekund foran andreplasserte Rai Benjamin fra USA. Den gamle rekorden på 46,92 hadde stått siden 2023.</p>
<p>– Jeg visste at formen var god, men dette hadde jeg ikke forventet. Det er helt utrolig, sa en jublende Warholm til NRK etter løpet.</p>
<h2>OL-forberedelser</h2>
<p>Rekorden kommer i god tid før sommerens OL i Los Angeles, der Warholm jakter sin andre olympiske gullmedalje etter seieren i Tokyo i 2021.</p>
</article>`,
    url: "https://www.nrk.no/sport/warholm-verdensrekord-400m-hekk-1.17200007",
    imageUrl: "https://picsum.photos/seed/warholm/800/450",
    category: "Sport",
    source: "NRK",
    publishedAt: "2026-04-12T19:30:00Z",
    createdAt: "2026-04-12T19:30:00Z",
  },
  {
    id: "art-8",
    title: "Telenor ruller ut 6G-pilotnett i Trondheim",
    summary:
      "Som første teleselskap i Norden har Telenor startet testing av sjette generasjons mobilnett i Trondheim sentrum.",
    content: `<article>
<p>Telenor annonserte mandag at selskapet har startet utrulling av et 6G-pilotnett i Trondheim sentrum. Prosjektet gjennomføres i samarbeid med NTNU og Sintef.</p>
<h2>Hva betyr 6G?</h2>
<p>Sjette generasjons mobilnett lover hastigheter opptil 100 ganger raskere enn 5G, med minimal forsinkelse. Teknologien åpner for nye bruksområder innen holografisk kommunikasjon, autonome kjøretøy og avansert fjernkirurgi.</p>
<h2>Pilotprosjektet</h2>
<p>I første fase dekker pilotnettet et område på rundt to kvadratkilometer i Trondheim sentrum. 500 utvalgte brukere får teste teknologien frem til sommeren 2026.</p>
<p>– Norge har alltid vært tidlig ute med mobilteknologi, og vi er stolte av å lede an også denne gangen, sier Telenor-sjef Sigve Brekke.</p>
</article>`,
    url: "https://www.vg.no/teknologi/telenor-6g-pilotnett-trondheim",
    imageUrl: "https://picsum.photos/seed/6g/800/450",
    category: "Teknologi",
    source: "VG",
    publishedAt: "2026-04-12T07:00:00Z",
    createdAt: "2026-04-12T07:00:00Z",
  },
  {
    id: "art-9",
    title: "Boligprisene stiger for sjette måned på rad",
    summary:
      "Ferske tall fra Eiendom Norge viser at boligprisene steg 1,4 prosent i mars, den sjette måneden på rad med prisoppgang.",
    content: `<article>
<p>Boligprisene i Norge fortsetter å stige. Tall fra Eiendom Norge viser en oppgang på 1,4 prosent i mars, sesongjustert. Det er den sjette måneden på rad med prisoppgang.</p>
<h2>Oslo og Bergen i tet</h2>
<p>De sterkeste prisøkningene ble registrert i Oslo med 1,8 prosent og Bergen med 1,6 prosent. Stavanger og Trondheim hadde mer moderat vekst på henholdsvis 0,9 og 1,1 prosent.</p>
<h2>Bekymring for førstegangskjøpere</h2>
<p>Forbrukerrådet uttrykker bekymring for at unge førstegangskjøpere presses ut av markedet. Gjennomsnittsprisen for en leilighet i Oslo er nå over 5 millioner kroner.</p>
<p>– Vi trenger flere boliger og bedre låneordninger for unge, sier forbrukerombud Inger-Lise Blystad.</p>
</article>`,
    url: "https://www.dagbladet.no/okonomi/boligprisene-stiger-sjette-maaned",
    imageUrl: "https://picsum.photos/seed/bolig/800/450",
    category: "Økonomi",
    source: "Dagbladet",
    publishedAt: "2026-04-11T11:00:00Z",
    createdAt: "2026-04-11T11:00:00Z",
  },
  {
    id: "art-10",
    title: "Munchmuseet setter besøksrekord med ny utstilling",
    summary:
      "Over 15 000 besøkende strømmet til Munchmuseet i helgen for å se den nye utstillingen «Munch og fremtiden».",
    content: `<article>
<p>Munchmuseet i Oslo satte ny besøksrekord i helgen da over 15 000 mennesker besøkte den nye utstillingen «Munch og fremtiden». Utstillingen kombinerer Edvard Munchs mest kjente verk med moderne digital kunst.</p>
<h2>Innovativ utstilling</h2>
<p>Utstillingen bruker projeksjoner og interaktive installasjoner for å sette Munchs kunst i en ny kontekst. Besøkende kan blant annet «gå inn i» Skrik ved hjelp av VR-teknologi og oppleve maleriet fra innsiden.</p>
<h2>Internasjonal oppmerksomhet</h2>
<p>The Guardian har kalt utstillingen «en av årets mest nyskapende kunstopplevelser i Europa», og billetter er nå utsolgt flere uker fremover.</p>
<p>– Vi ønsket å vise at Munchs kunst er like relevant i dag som for over hundre år siden, sier museumsdirektør Tone Hansen.</p>
</article>`,
    url: "https://www.aftenposten.no/kultur/munchmuseet-besoksrekord-ny-utstilling",
    imageUrl: "https://picsum.photos/seed/munch/800/450",
    category: "Kultur",
    source: "Aftenposten",
    publishedAt: "2026-04-10T16:45:00Z",
    createdAt: "2026-04-10T16:45:00Z",
  },
];
