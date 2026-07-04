# FI/EN Translations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the landing page bilingual (Finnish default, English via nav toggle, persisted in localStorage) per `docs/superpowers/specs/2026-07-04-translations-design.md`.

**Architecture:** One new typed module `src/translations.ts` holds every user-visible string for both languages; `src/App.tsx` reads `translations[lang]` from React state initialised from localStorage. No router, no i18n library.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind (existing). Playwright (borrowed from `/home/lappemikb/projects/fish-inventory/frontend/node_modules/playwright/index.mjs`) for verification only.

## Global Constraints

- No new npm dependencies.
- Default language: `'fi'`. localStorage key: `entailu-lang`; any value other than `'fi'`/`'en'` is treated as `'fi'`.
- Hero headline FI: **"Kalan *tarkkuudella*."** (pre `'Kalan'`, em `'tarkkuudella.'`, post `''`). EN: pre `'Every gram,'`, em `'accounted'`, post `'for.'`.
- The four ordering-algorithm names (Lean, Cautious, Balanced, Safety+) are product terms — identical in both languages; only their buffer tags and body text translate.
- Ticker fish rows (names/kg/expiry), stat numbers, and all styling/layout stay unchanged.
- The Web3Forms access key and submit logic stay unchanged; only visible form labels translate.
- Dev server assumed running at `http://localhost:5174` (`npm run dev` in the repo root; port 5173 is usually taken by another project).
- Every commit message ends with the `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.

---

### Task 1: Failing e2e verification script

**Files:**
- Create: `/tmp/claude-1000/-home-lappemikb-projects-entailu-landing/e80a4944-5011-4af3-a9cf-55424851f9c2/scratchpad/i18n-verify.mjs` (scratchpad — deliberately not committed; the repo has no test infra and this is a session verification harness)

**Interfaces:**
- Produces: a script whose exit code 0 defines "translations work"; Tasks 2–3 make it pass. It asserts: FI renders by default, the toggle switches to EN, and the choice survives a reload.

- [ ] **Step 1: Write the script**

```js
import { chromium } from '/home/lappemikb/projects/fish-inventory/frontend/node_modules/playwright/index.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

let failures = 0;
const check = (name, ok) => { console.log(ok ? `PASS ${name}` : `FAIL ${name}`); if (!ok) failures++; };

await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

// 1. Finnish renders by default
check('FI hero by default', await page.locator('h1', { hasText: 'Kalan' }).count() === 1);
check('FI nav by default', await page.locator('nav a', { hasText: 'Ominaisuudet' }).count() === 1);
check('FI title', (await page.title()) === 'Entailu — Kalatiskin varastonhallinta');
check('html lang=fi', await page.getAttribute('html', 'lang') === 'fi');

// 2. Toggle switches to English
await page.click('button:has-text("EN")');
await page.waitForTimeout(300);
check('EN hero after toggle', await page.locator('h1', { hasText: 'Every gram' }).count() === 1);
check('EN title after toggle', (await page.title()) === 'Entailu — Fish Inventory Management');

// 3. Choice persists across reload
await page.reload({ waitUntil: 'networkidle' });
check('EN persists after reload', await page.locator('h1', { hasText: 'Every gram' }).count() === 1);

// 4. Screenshots for copy review
await page.screenshot({ path: 'i18n-en.png', fullPage: true });
await page.click('button:has-text("FI")');
await page.waitForTimeout(300);
await page.screenshot({ path: 'i18n-fi.png', fullPage: true });

check('no page errors', errors.length === 0);
await browser.close();
console.log(failures ? `${failures} FAILURES` : 'ALL PASS');
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails against the current English-only page**

Run (from the scratchpad directory): `node i18n-verify.mjs`
Expected: `FAIL FI hero by default`, `FAIL FI nav by default`, `FAIL FI title`, exit code 1. (The dev server must be up; start with `npm run dev` in the repo if not.)

No commit — scratchpad file.

---

### Task 2: `src/translations.ts`

**Files:**
- Create: `src/translations.ts`

**Interfaces:**
- Produces: `export type Lang = 'fi' | 'en'`; `export interface Translation` (shape below); `export const translations: Record<Lang, Translation>`. Task 3 imports exactly these three names.

- [ ] **Step 1: Write the module with the full copy for both languages**

```ts
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (module is not imported yet — that's fine; TypeScript still type-checks it, and any FI/EN key mismatch fails here).

- [ ] **Step 3: Commit**

```bash
git add src/translations.ts
git commit -m "feat: add FI/EN translation catalogue"
```

---

### Task 3: Wire `App.tsx` to the translations

**Files:**
- Modify: `src/App.tsx` (whole file below)

**Interfaces:**
- Consumes: `Lang`, `translations` from `src/translations.ts` (Task 2).
- Produces: the final page. The nav toggle buttons render the literal texts `FI` and `EN` (Task 1's script clicks `button:has-text("EN")`).

- [ ] **Step 1: Replace `src/App.tsx` with the version below**

Key changes from the current file, so the reviewer knows what to look for: the `FEATURES`/`ALGOS`/`STEPS`/`COMPLIANCE` constants are gone (moved to `translations.ts`), `TICKER` and `WEB3FORMS_ACCESS_KEY` stay, a `lang` state + `useEffect` + nav toggle are added, and every literal string is a `t.…` lookup. The hero headline renders `pre` / `em` (italic) / `post` and skips empty segments.

```tsx
import { useEffect, useRef, useState } from 'react';
import { translations, Lang } from './translations';

// ── Counter hook ──────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    const frame = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started, target, duration]);

  return { count, ref };
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TICKER = [
  { name: 'Lohifile',   kg: '14.3', expiry: '2d', warn: false },
  { name: 'Kirjolohi',  kg: '8.7',  expiry: '1d', warn: true  },
  { name: 'Kuha',       kg: '22.1', expiry: '5d', warn: false },
  { name: 'Siika',      kg: '6.4',  expiry: '3d', warn: false },
  { name: 'Ahven',      kg: '11.9', expiry: '4d', warn: false },
  { name: 'Hauki',      kg: '3.2',  expiry: '1d', warn: true  },
  { name: 'Turska',     kg: '18.5', expiry: '6d', warn: false },
  { name: 'Kampela',    kg: '9.1',  expiry: '2d', warn: false },
  { name: 'Muikku',     kg: '5.8',  expiry: '3d', warn: false },
  { name: 'Seiti',      kg: '7.2',  expiry: '1d', warn: true  },
];

const WEB3FORMS_ACCESS_KEY = '17ae9229-1b47-4ace-b060-852f261496a6';

function initialLang(): Lang {
  const stored = localStorage.getItem('entailu-lang');
  return stored === 'en' ? 'en' : 'fi';
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const s1 = useCounter(12400);
  const s2 = useCounter(847);
  const s3 = useCounter(98);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const t = translations[lang];
  const stats = [
    { stat: s1, suffix: '+', ...t.stats[0] },
    { stat: s2, suffix: '',  ...t.stats[1] },
    { stat: s3, suffix: '%', ...t.stats[2] },
  ];

  useEffect(() => {
    localStorage.setItem('entailu-lang', lang);
    document.title = t.pageTitle;
    document.documentElement.lang = lang;
  }, [lang, t.pageTitle]);

  async function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('botcheck')) return; // honeypot
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'Entailu demo request',
      from_name: 'entailu.fi landing page',
      name: data.get('name'),
      email: data.get('email'),
      company: data.get('company'),
    };
    setFormStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setFormStatus('sent');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-cream font-body text-ink overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <span className="font-display text-xl tracking-[0.15em] font-medium select-none">ENTAILU</span>
          <div className="flex items-center gap-8">
            <a href="#features"    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors hidden sm:block">{t.nav.features}</a>
            <a href="#ordering"    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors hidden sm:block">{t.nav.ordering}</a>
            <a href="#compliance"  className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors hidden sm:block">{t.nav.compliance}</a>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
              {(['fi', 'en'] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-ink/20">/</span>}
                  <button
                    onClick={() => setLang(l)}
                    className={l === lang ? 'text-ink' : 'text-ink/35 hover:text-ink transition-colors'}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <a href="#contact"     className="font-mono text-[10px] uppercase tracking-[0.2em] bg-ink text-cream px-5 py-2.5 hover:bg-forest transition-colors">
              {t.nav.cta}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen bg-ink text-cream pt-14 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">

          {/* Headline */}
          <div className="animate-fadeUp">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-ochre mb-10">
              {t.hero.kicker}
            </p>
            <h1 className="font-display text-[clamp(3.5rem,8vw,6rem)] font-light leading-[1.02] mb-10 text-cream">
              {t.hero.headline.pre}<br />
              <em className="italic text-forest-300">{t.hero.headline.em}</em>
              {t.hero.headline.post && <><br />{t.hero.headline.post}</>}
            </h1>
            <p className="font-body text-cream/50 text-lg leading-relaxed max-w-md mb-12">
              {t.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact"  className="font-mono text-[10px] uppercase tracking-[0.2em] bg-ochre text-ink px-8 py-4 hover:bg-ochre-400 transition-colors text-center">
                {t.hero.ctaPrimary}
              </a>
              <a href="#features" className="font-mono text-[10px] uppercase tracking-[0.2em] border border-cream/15 text-cream/50 px-8 py-4 hover:border-cream/40 hover:text-cream/80 transition-colors text-center">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Live stock panel */}
          <div className="animate-fadeUp delay-300">
            <div className="border border-cream/10 bg-cream/[0.03] overflow-hidden">
              {/* Terminal bar */}
              <div className="border-b border-cream/10 px-5 py-3 flex items-center justify-between bg-cream/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-ochre/60 animate-pulse" />
                  <span className="font-mono text-[10px] text-cream/30 uppercase tracking-widest">
                    {t.ticker.live} — {new Date().toLocaleDateString('fi-FI')}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-forest-400">{t.ticker.fifoActive}</span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_70px] px-5 py-2.5 border-b border-cream/5">
                {t.ticker.columns.map(h => (
                  <span key={h} className="font-mono text-[9px] uppercase tracking-widest text-cream/20">{h}</span>
                ))}
              </div>

              {/* Scrolling ticker */}
              <div className="h-[280px] overflow-hidden relative">
                <div className="animate-scrollUp">
                  {[...TICKER, ...TICKER].map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_80px_70px] px-5 py-3 items-center border-b border-cream/[0.06] hover:bg-cream/[0.04] transition-colors"
                    >
                      <span className="font-mono text-sm text-cream/80">{item.name}</span>
                      <span className="font-mono text-sm text-cream">{item.kg} kg</span>
                      <span className={`font-mono text-[10px] px-2 py-0.5 inline-flex items-center justify-center w-fit ${
                        item.warn
                          ? 'bg-ochre/20 text-ochre-400'
                          : 'bg-forest/20 text-forest-300'
                      }`}>
                        {item.expiry}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Fade out */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-cream/[0.06] flex items-center justify-between bg-cream/[0.02]">
                <span className="font-mono text-[9px] text-cream/20 uppercase tracking-widest">{t.ticker.footerLeft}</span>
                <span className="font-mono text-[9px] text-forest-300">{t.ticker.footerRight}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink/10">
            {stats.map(({ stat, suffix, label, note }) => (
              <div key={label} ref={stat.ref} className="px-10 py-14">
                <div className="font-display text-[4.5rem] font-light leading-none text-forest mb-3">
                  {stat.count.toLocaleString('fi-FI')}{suffix}
                </div>
                <div className="font-mono text-xs text-ink/50 uppercase tracking-wider mb-1">{label}</div>
                <div className="font-mono text-[10px] text-ink/25 uppercase tracking-wider">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-32 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-20 items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30 mb-5">{t.features.kicker}</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-tight">
                {t.features.heading[0]}<br />{t.features.heading[1]}
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-ink/45 leading-relaxed max-w-lg text-lg">
                {t.features.intro}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-ink/10">
            {t.features.cards.map((f, i) => (
              <div key={f.title} className="border-b border-r border-ink/10 p-9 group hover:bg-forest/[0.03] transition-colors cursor-default">
                <div className="font-mono text-xs text-ochre mb-7 tracking-widest">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display text-2xl font-light mb-4 group-hover:text-forest transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-ink/45 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6 sm:px-10 bg-ink/[0.025] border-y border-ink/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30 mb-5">{t.workflow.kicker}</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light">{t.workflow.heading[0]}<br />{t.workflow.heading[1]}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
            {t.workflow.steps.map((s, i) => (
              <div key={s.title} className="relative border-b border-r border-ink/10 p-9 overflow-hidden">
                <div className="font-display text-[8rem] font-light text-ink/[0.04] absolute -top-4 -right-2 leading-none select-none pointer-events-none">
                  {i + 1}
                </div>
                <div className="w-8 h-8 border border-forest text-forest font-mono text-xs flex items-center justify-center mb-8">
                  {i + 1}
                </div>
                <h3 className="font-display text-2xl font-light mb-3">{s.title}</h3>
                <p className="text-ink/45 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORDERING ── */}
      <section id="ordering" className="py-32 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 mb-20 items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30 mb-5">{t.ordering.kicker}</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-tight">
                {t.ordering.heading[0]}<br />{t.ordering.heading[1]}
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="text-ink/45 leading-relaxed max-w-lg text-lg">
                {t.ordering.intro}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
            {t.ordering.cards.map((a) => (
              <div key={a.name} className="border-b border-r border-ink/10 p-9 group hover:bg-forest/[0.03] transition-colors cursor-default">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ochre mb-7">{a.buffer}</div>
                <h3 className="font-display text-2xl font-light mb-4 group-hover:text-forest transition-colors duration-300">
                  {a.name}
                </h3>
                <p className="text-ink/45 text-sm leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section id="compliance" className="py-32 px-6 sm:px-10 bg-forest text-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/30 mb-5">{t.compliance.kicker}</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-tight mb-8 text-cream">
              {t.compliance.heading[0]}<br />{t.compliance.heading[1]}<br />{t.compliance.heading[2]}
            </h2>
            <p className="text-cream/50 leading-relaxed max-w-md text-lg">
              {t.compliance.paragraph}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {t.compliance.items.map((item) => (
              <div key={item} className="flex items-center gap-3 border border-cream/10 px-4 py-3.5 hover:border-cream/20 transition-colors">
                <span className="text-ochre font-mono text-sm flex-shrink-0">✓</span>
                <span className="font-mono text-[10px] text-cream/60 uppercase tracking-wider leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-32 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30 mb-5">{t.contact.kicker}</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light leading-tight mb-8">
              {t.contact.heading[0]}<br />{t.contact.heading[1]}
            </h2>
            <p className="text-ink/45 leading-relaxed max-w-sm text-lg mb-10">
              {t.contact.paragraph}
            </p>
            <div className="space-y-3">
              {t.contact.bullets.map(b => (
                <div key={b} className="flex items-center gap-3">
                  <span className="text-forest font-mono text-sm">—</span>
                  <span className="font-mono text-xs text-ink/50 uppercase tracking-wider">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {formStatus === 'sent' ? (
            <div className="border border-forest/30 bg-forest/[0.04] px-8 py-12 text-center">
              <p className="font-display text-3xl font-light text-forest mb-4">{t.contact.form.successTitle}</p>
              <p className="text-ink/50 leading-relaxed">
                {t.contact.form.successBody}
              </p>
            </div>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={handleDemoSubmit}>
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              {t.contact.form.fields.map(f => (
                <div key={f.name}>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink/35 mb-2.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="w-full border border-ink/15 bg-transparent px-4 py-3.5 font-mono text-sm placeholder-ink/20 focus:outline-none focus:border-forest transition-colors"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="font-mono text-[10px] uppercase tracking-[0.2em] bg-ink text-cream px-8 py-4 hover:bg-forest transition-colors mt-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {formStatus === 'sending' ? t.contact.form.sending : t.contact.form.submit}
              </button>
              {formStatus === 'error' && (
                <p className="font-mono text-xs text-ochre-400">
                  {t.contact.form.error}
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-ink/10 py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg tracking-[0.15em]">ENTAILU</span>
          <span className="font-mono text-[10px] text-ink/25 uppercase tracking-widest">
            © {new Date().getFullYear()} Entailu Oy · {t.footer.rights}
          </span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed with zero warnings.

- [ ] **Step 3: Run the Task 1 verification script**

Run (from the scratchpad directory, dev server up): `node i18n-verify.mjs`
Expected: every line `PASS`, final line `ALL PASS`, exit 0. If `FI hero by default` fails but everything else passes, a previous session's localStorage may linger — the script uses a fresh browser context, so that would indicate a real bug in `initialLang()`.

- [ ] **Step 4: Look at the screenshots**

Open `i18n-fi.png` and `i18n-en.png` (written by the script). Check: no overflowing headlines (Finnish words run long), the nav toggle renders cleanly next to the CTA, the hero renders as two lines in Finnish without an orphaned empty third line.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: bilingual page — FI default, EN toggle, persisted choice"
```

---

### Task 4: Finnish copy review gate + deploy

**Files:** none (process task)

**Interfaces:**
- Consumes: the running page and the two screenshots from Task 3.

- [ ] **Step 1: Send both full-page screenshots to the user for Finnish copy review**

The user reviews the Finnish copy (this cannot be self-verified to native standard). Do not deploy before their approval. Apply any copy edits they request to `src/translations.ts`, re-run `node i18n-verify.mjs`, and commit copy fixes as `fix: Finnish copy review edits`.

- [ ] **Step 2: After approval — push and deploy**

```bash
git push
gcloud builds submit --tag europe-north1-docker.pkg.dev/delimaster/entailu/app:latest /home/lappemikb/projects/entailu-landing
gcloud run deploy entailu --image europe-north1-docker.pkg.dev/delimaster/entailu/app:latest --region=europe-north1 --quiet
```

- [ ] **Step 3: Verify live**

Run the Task 1 script with the URL swapped to `https://entailu.fi` (sed a copy, as done for earlier live checks). Expected: `ALL PASS`. Note: the live check sends no form submissions, so no test emails this time.
