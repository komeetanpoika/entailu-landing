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
  try {
    return localStorage.getItem('entailu-lang') === 'en' ? 'en' : 'fi';
  } catch {
    return 'fi';
  }
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
    try {
      localStorage.setItem('entailu-lang', lang);
    } catch {
      // storage unavailable (e.g. cookies blocked) — language still works for the session
    }
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
