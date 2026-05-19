export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-cyan-400">Entailu</span>
          <a
            href="#contact"
            className="text-sm font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors text-white px-4 py-2 rounded-lg"
          >
            Get a demo
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-28 px-6 text-center max-w-4xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">Fish inventory management</p>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          From delivery to sale,<br className="hidden sm:block" /> every gram accounted for.
        </h1>
        <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Entailu helps fish counter teams track stock, manage near-expiry decisions, automate compliance checklists, and import sales — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-semibold px-8 py-3 rounded-xl text-base"
          >
            Book a demo
          </a>
          <a
            href="#features"
            className="bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 font-semibold px-8 py-3 rounded-xl text-base"
          >
            See features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything a fish counter needs</h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Built specifically for EU fish retail — covering stock, compliance, and sales in one workflow.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="flex flex-col gap-12">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance callout */}
      <section className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">EU compliance</p>
          <h2 className="text-3xl font-bold mb-6">Built for 852/2004, 853/2004 and HACCP</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            The morning checklist captures the legally required daily records — temperature monitoring, cleaning & sanitation, equipment checks — and stores them with a timestamp. No more paper logs.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {compliance.map(c => (
              <div key={c} className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                <span className="text-cyan-400 font-bold text-lg">✓</span>
                <span className="text-sm text-slate-300">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to see it in action?</h2>
          <p className="text-slate-400 mb-10">We'll walk you through the system with your own product catalogue and data.</p>
          <form
            className="flex flex-col gap-4 text-left"
            onSubmit={e => { e.preventDefault(); alert("Thanks! We'll be in touch shortly."); }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400 font-medium">Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400 font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-400 font-medium">Company</label>
              <input
                type="text"
                placeholder="Your company (optional)"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-semibold py-3 rounded-xl text-base"
            >
              Book a demo
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} Entailu Oy. All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🐟",
    title: "Real-time stock tracking",
    description: "Track every piece of fish from delivery through sale or discard. Weight, expiry, and lifecycle status always up to date.",
  },
  {
    icon: "⚖️",
    title: "FIFO selling",
    description: "Sales automatically deduct from the oldest stock first. Near-expiry pieces are flagged and discounted before they're wasted.",
  },
  {
    icon: "📋",
    title: "Morning checklist",
    description: "8-item daily compliance checklist: discard expired stock, handle near-expiry fish, confirm deliveries, and log required safety checks.",
  },
  {
    icon: "🤖",
    title: "AI-powered receiving",
    description: "Photograph a delivery note and let Claude Vision extract the line items. No manual data entry for incoming stock.",
  },
  {
    icon: "📊",
    title: "Sales import",
    description: "Upload your POS sales export and the system fuzzy-matches products and records sales in bulk. One step, every morning.",
  },
  {
    icon: "📦",
    title: "Order planning",
    description: "See projected stock coverage by day based on 30-day sales velocity. Know what to order before you run out.",
  },
];

const steps = [
  {
    title: "Receive stock",
    description: "Scan or photograph your delivery note. Claude Vision reads the line items and matches them to your product catalogue. Confirm and import in seconds.",
  },
  {
    title: "Run the morning checklist",
    description: "Each morning, the system auto-discards expired stock, surfaces near-expiry fish for a decision (discount, process, or leave), and guides the team through safety checks.",
  },
  {
    title: "Sell and record",
    description: "Sell manually from the counter or import your POS sales file. FIFO is enforced automatically — oldest stock goes first.",
  },
  {
    title: "Plan orders",
    description: "Review your stock coverage calendar and projected run-out dates. Place orders directly through the supplier portal.",
  },
];

const compliance = [
  "Temperature monitoring logs",
  "Cleaning & sanitation records",
  "Near-expiry decision audit trail",
  "FIFO enforcement",
  "Discard tracking",
  "Daily note archive",
];
