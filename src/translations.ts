export type Lang = 'fi' | 'en';

export interface Translation {
  pageTitle: string;
  nav: { features: string; ordering: string; compliance: string; cta: string };
  hero: {
    kicker: string;
    headline: { pre: string; em: string; post: string };
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  ticker: {
    live: string;
    fifoActive: string;
    columns: [string, string, string];
    footerLeft: string;
    footerRight: string;
  };
  stats: { label: string; note: string }[];
  features: {
    kicker: string;
    heading: string[];
    intro: string;
    cards: { title: string; body: string }[];
  };
  ordering: {
    kicker: string;
    heading: string[];
    intro: string;
    cards: { name: string; buffer: string; body: string }[];
  };
  workflow: {
    kicker: string;
    heading: string[];
    steps: { title: string; body: string }[];
  };
  compliance: {
    kicker: string;
    heading: string[];
    paragraph: string;
    items: string[];
  };
  contact: {
    kicker: string;
    heading: string[];
    paragraph: string;
    bullets: string[];
    form: {
      fields: { name: string; label: string; type: string; placeholder: string; required: boolean }[];
      submit: string;
      sending: string;
      successTitle: string;
      successBody: string;
      error: string;
    };
  };
  footer: { rights: string };
}

export const translations: Record<Lang, Translation> = {
  en: {
    pageTitle: 'Entailu — Fish Inventory Management',
    nav: { features: 'Features', ordering: 'Ordering', compliance: 'Compliance', cta: 'Get a demo' },
    hero: {
      kicker: 'Fish inventory management',
      headline: { pre: 'Every gram,', em: 'accounted', post: 'for.' },
      sub: 'Entailu tracks fish stock by weight through an append-only ledger, enforces FIFO automatically, and knows what each fish needs ordered — with a full compliance record, every single day.',
      ctaPrimary: 'Book a demo',
      ctaSecondary: 'See features →',
    },
    ticker: {
      live: 'Live stock',
      fifoActive: 'FIFO active',
      columns: ['Product', 'In stock', 'Expiry'],
      footerLeft: 'Auto-discard · Pending deliveries',
      footerRight: '8 items in stock',
    },
    stats: [
      { label: 'Grams tracked per counter per day', note: 'avg across customers' },
      { label: 'Compliance checklists stored to date', note: 'timestamped & audit-ready' },
      { label: 'Reduction in manual data entry', note: 'vs. spreadsheet workflows' },
    ],
    features: {
      kicker: 'Capabilities',
      heading: ['Built for fish retail,', 'not generic stock.'],
      intro: 'Every feature is designed around how fish counter teams actually work — perishable goods, weight-based selling, daily compliance, and AI-assisted receiving.',
      cards: [
        { title: 'Ledger-true stock', body: 'Every lot lives in an append-only movement ledger — received, sold, discarded, processed. The numbers always reconcile, and nothing is ever silently deleted.' },
        { title: 'Automatic FIFO', body: 'Sales deduct from the earliest-expiring stock first. Opened lots cap at the 2-day shelf life, and near-expiry pieces surface for a decision before they become waste.' },
        { title: 'AI delivery parsing', body: 'Photograph a delivery note. Claude vision reads every line item and matches it to your product catalogue — you just review and confirm.' },
        { title: 'POS import', body: 'Upload the daily sales export. Products match automatically, euros stay exact, and duplicate files are caught before they double-count.' },
        { title: 'Per-fish ordering', body: 'Four ordering strategies, from Lean to Safety+. Each product is auto-assigned one from its sales velocity and margin — or pin your own choice per fish.' },
        { title: 'Analytics dashboard', body: 'Sales, stock value, waste, margin and sell-through, charted per product — with waste risk and low stock flagged the moment you open it.' },
      ],
    },
    ordering: {
      kicker: 'Ordering intelligence',
      heading: ['One strategy', 'per fish.'],
      intro: 'Entailu measures 28-day sales velocity and margin for every product and places it on the service-versus-waste curve. Each fish is assigned the ordering strategy that fits it — automatically, or pinned by you.',
      cards: [
        { name: 'Lean', buffer: 'No buffer', body: 'Cover forecast demand exactly. For slow, low-margin products where waste costs more than a missed sale.' },
        { name: 'Cautious', buffer: '+10% buffer', body: 'A light safety margin for slower products that still earn their place in the counter.' },
        { name: 'Balanced', buffer: '+20% buffer', body: 'The workhorse. Enough buffer to absorb a busy weekend without filling the case with risk.' },
        { name: 'Safety+', buffer: '+3 days cover', body: 'Never miss a sale on your fast, high-margin heroes. Extra days of cover where stockouts hurt most.' },
      ],
    },
    workflow: {
      kicker: 'Workflow',
      heading: ['Four steps.', 'Every day.'],
      steps: [
        { title: 'Receive', body: 'Photograph the delivery note. AI reads every item and fuzzy-matches to your catalogue.' },
        { title: 'Open', body: 'Mark pieces opened. Expiry caps automatically at the 2-day fish shelf life.' },
        { title: 'Sell', body: 'Record manually or import the POS file. FIFO enforced without you thinking about it.' },
        { title: 'Comply', body: 'Morning and evening records — near-expiry decisions, deliveries, sales, waste. Timestamped and attested.' },
      ],
    },
    compliance: {
      kicker: 'EU Compliance',
      heading: ['Built for 852/2004,', '853/2004', 'and HACCP.'],
      paragraph: 'Morning and end-of-day checklists generate a timestamped, attested compliance record for every day of trading — and every product carries its scientific name, as EU labelling rules require. No paper. No gaps. Ready for inspection at any time.',
      items: [
        'Morning & end-of-day records',
        'Near-expiry action audit trail',
        'FIFO stock rotation',
        'Append-only movement ledger',
        'Discard documentation',
        'Delivery verification',
        'Scientific names per product',
        'Automatic expiry sweep',
      ],
    },
    contact: {
      kicker: 'Get started',
      heading: ['See it with', 'your own data.'],
      paragraph: "We'll walk you through Entailu using your product catalogue and delivery notes. No slides — just the actual system.",
      bullets: ['Setup in under one day', 'Training included', 'Multi-shop support', 'Finnish support'],
      form: {
        fields: [
          { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', required: true },
          { name: 'company', label: 'Company', type: 'text', placeholder: 'Optional', required: false },
        ],
        submit: 'Book a demo →',
        sending: 'Sending…',
        successTitle: 'Kiitos!',
        successBody: "Your demo request is on its way. We'll be in touch shortly.",
        error: 'Something went wrong — please try again, or email us directly.',
      },
    },
    footer: { rights: 'All rights reserved' },
  },
  fi: {
    pageTitle: 'Entailu — Kalatiskin varastonhallinta',
    nav: { features: 'Ominaisuudet', ordering: 'Tilaaminen', compliance: 'Omavalvonta', cta: 'Varaa esittely' },
    hero: {
      kicker: 'Kalatiskin varastonhallinta',
      headline: { pre: 'Kalan', em: 'tarkkuudella.', post: '' },
      sub: 'Entailu seuraa kalavarastoa painon tarkkuudella muuttumattomalla tapahtumakirjanpidolla, hoitaa FIFO-kierron automaattisesti ja kertoo, mitä kutakin kalaa kannattaa tilata — täydellä omavalvontajäljellä, joka ikinen päivä.',
      ctaPrimary: 'Varaa esittely',
      ctaSecondary: 'Katso ominaisuudet →',
    },
    ticker: {
      live: 'Varastotilanne',
      fifoActive: 'FIFO käytössä',
      columns: ['Tuote', 'Varastossa', 'Vanhenee'],
      footerLeft: 'Automaattipoisto · Tulevat toimitukset',
      footerRight: '8 tuotetta varastossa',
    },
    stats: [
      { label: 'Grammaa seurannassa tiskiä kohden päivässä', note: 'keskiarvo asiakkaillamme' },
      { label: 'Tallennettua omavalvontakirjausta tähän mennessä', note: 'aikaleimattu ja tarkastusvalmis' },
      { label: 'Vähemmän manuaalista kirjaamista', note: 'verrattuna taulukkolaskentaan' },
    ],
    features: {
      kicker: 'Ominaisuudet',
      heading: ['Kalatiskille tehty,', 'ei yleisvarastoksi.'],
      intro: 'Jokainen ominaisuus on suunniteltu kalatiskin todelliseen arkeen — helposti pilaantuvat tuotteet, painoperusteinen myynti, päivittäinen omavalvonta ja tekoälyavusteinen vastaanotto.',
      cards: [
        { title: 'Aukoton kirjanpito', body: 'Jokainen erä elää muuttumattomassa tapahtumakirjanpidossa — vastaanotot, myynnit, poistot, jalostukset. Luvut täsmäävät aina, eikä mitään poisteta hiljaa.' },
        { title: 'Automaattinen FIFO', body: 'Myynnit vähennetään ensin aikaisimmin vanhenevasta erästä. Avatut erät saavat enintään kahden päivän käyttöajan, ja vanheneva kala nousee esiin ennen kuin siitä tulee hävikkiä.' },
        { title: 'Tekoäly lukee lähetteet', body: 'Ota kuva lähetyslistasta. Claude lukee jokaisen rivin ja yhdistää sen tuotteisiisi — sinä vain tarkistat ja vahvistat.' },
        { title: 'Kassamyynnin tuonti', body: 'Lataa päivän myyntiraportti. Tuotteet täsmäytyvät automaattisesti, eurot pysyvät tarkkoina ja tuplatiedostot jäävät kiinni ennen kahdenkertaista kirjausta.' },
        { title: 'Kalakohtainen tilaaminen', body: 'Neljä tilausstrategiaa Leanista Safety+:aan. Jokainen tuote saa omansa myyntinopeuden ja katteen perusteella — tai valitse itse kalakohtaisesti.' },
        { title: 'Analytiikkanäkymä', body: 'Myynti, varaston arvo, hävikki, kate ja läpimyynti tuotteittain — hävikkiriski ja matala saldo näkyvät heti avattaessa.' },
      ],
    },
    ordering: {
      kicker: 'Älykäs tilaaminen',
      heading: ['Oma strategia', 'joka kalalle.'],
      intro: 'Entailu mittaa jokaisen tuotteen 28 päivän myyntinopeuden ja katteen ja sijoittaa sen palvelutaso–hävikki-akselille. Kukin kala saa sille sopivan tilausstrategian — automaattisesti tai itse valiten.',
      cards: [
        { name: 'Lean', buffer: 'Ei puskuria', body: 'Tilaa täsmälleen ennustetun menekin verran. Hitaille, matalakatteisille tuotteille, joilla hävikki maksaa enemmän kuin menetetty myynti.' },
        { name: 'Cautious', buffer: '+10 % puskuri', body: 'Kevyt varmuusmarginaali hitaammille tuotteille, jotka silti ansaitsevat paikkansa tiskissä.' },
        { name: 'Balanced', buffer: '+20 % puskuri', body: 'Työjuhta. Riittävästi puskuria kiireisen viikonlopun varalle täyttämättä tiskiä riskillä.' },
        { name: 'Safety+', buffer: '+3 päivän kate', body: 'Älä menetä myyntiä nopeilla, hyväkatteisilla suosikeillasi. Lisäpäiviä sinne, missä hyllypuute sattuu eniten.' },
      ],
    },
    workflow: {
      kicker: 'Työnkulku',
      heading: ['Neljä vaihetta.', 'Joka päivä.'],
      steps: [
        { title: 'Vastaanota', body: 'Ota kuva lähetteestä. Tekoäly lukee rivit ja täsmäyttää ne tuotteisiisi.' },
        { title: 'Avaa', body: 'Merkitse erä avatuksi. Viimeinen käyttöpäivä rajautuu automaattisesti kahteen päivään.' },
        { title: 'Myy', body: 'Kirjaa käsin tai tuo kassatiedosto. FIFO toteutuu ilman että sitä ajattelet.' },
        { title: 'Kirjaa', body: 'Aamu- ja iltakirjaukset — vanhenemispäätökset, toimitukset, myynti, hävikki. Aikaleimattu ja kuitattu.' },
      ],
    },
    compliance: {
      kicker: 'EU-omavalvonta',
      heading: ['Tehty 852/2004:n,', '853/2004:n', 'ja HACCP:n mukaan.'],
      paragraph: 'Aamu- ja iltakirjaukset tuottavat aikaleimatun, kuitatun omavalvontamerkinnän jokaisesta myyntipäivästä — ja jokaisella tuotteella on tieteellinen nimensä, kuten EU:n merkintäsäännöt edellyttävät. Ei paperia. Ei aukkoja. Valmiina tarkastukseen milloin tahansa.',
      items: [
        'Aamu- ja iltakirjaukset',
        'Vanhenevien erien päätösjälki',
        'FIFO-varastonkierto',
        'Muuttumaton tapahtumakirjanpito',
        'Poistojen dokumentointi',
        'Toimitusten todennus',
        'Tieteelliset nimet tuotteilla',
        'Automaattinen vanhentumispoisto',
      ],
    },
    contact: {
      kicker: 'Aloita',
      heading: ['Näe se omilla', 'tiedoillasi.'],
      paragraph: 'Käymme Entailun läpi sinun tuotteillasi ja lähetteilläsi. Ei kalvoja — pelkkä oikea järjestelmä.',
      bullets: ['Käyttöönotto alle päivässä', 'Koulutus sisältyy', 'Monen myymälän tuki', 'Suomenkielinen tuki'],
      form: {
        fields: [
          { name: 'name', label: 'Nimi', type: 'text', placeholder: 'Nimesi', required: true },
          { name: 'email', label: 'Sähköposti', type: 'email', placeholder: 'sina@yritys.fi', required: true },
          { name: 'company', label: 'Yritys', type: 'text', placeholder: 'Valinnainen', required: false },
        ],
        submit: 'Varaa esittely →',
        sending: 'Lähetetään…',
        successTitle: 'Kiitos!',
        successBody: 'Esittelypyyntösi on matkalla. Olemme yhteydessä pian.',
        error: 'Jokin meni pieleen — yritä uudelleen tai lähetä meille sähköpostia.',
      },
    },
    footer: { rights: 'Kaikki oikeudet pidätetään' },
  },
};
