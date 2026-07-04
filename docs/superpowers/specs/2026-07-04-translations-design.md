# Translations (FI/EN) for entailu-landing — Design

**Date:** 2026-07-04
**Status:** Approved (design discussion in session)

## Goal

Make the landing page bilingual: Finnish as the default language, English as the alternative, switched by a nav toggle. No routing changes, no new dependencies.

## Decisions

- **Languages:** Finnish + English. Finnish is the default for first-time visitors.
- **Mechanism:** toggle only — no URL paths, no browser-language detection. The chosen language persists in `localStorage` (key: `entailu-lang`).
- **Pattern:** the `matami-mottonen` house pattern — a single typed `translations.ts` and React state. Rejected alternatives: react-i18next (needless indirection for one static page), duplicated per-language page components (drift risk).

## Structure

### `src/translations.ts` (new)

- `export type Lang = 'fi' | 'en'`
- A `Translation` interface covering every user-visible string:
  - nav link labels + CTA
  - hero: kicker, headline segments (three lines, middle one italicised — stored as separate fields so JSX styling is preserved), sub-paragraph, both CTA buttons
  - stats: three `{label, note}` pairs (numbers stay in `App.tsx`)
  - features: section kicker, heading, intro paragraph, six `{title, body}` cards (numbers `01`–`06` stay in `App.tsx`)
  - ordering: section kicker, heading, intro paragraph, four `{name, buffer, body}` algorithm cards
  - workflow: kicker, heading, four `{title, body}` steps
  - compliance: kicker, heading (line-broken), paragraph, eight checklist items
  - contact: kicker, heading, paragraph, four bullet points, form field labels + placeholders, submit/sending button labels, success panel (title + body), error message
  - footer rights text; document `<title>` per language
- `export const translations: Record<Lang, Translation>` — TypeScript enforces key parity between FI and EN; a missing translation is a compile error.
- English copy moves verbatim from `App.tsx`. Finnish copy is drafted new, in native-quality business Finnish; hero headline is an idiomatic equivalent, not a literal translation. **Decided (user):** the Finnish hero headline is **"Kalan tarkkuudella."** Because the FI and EN headlines break across different numbers of lines, the headline is stored as `{pre, em, post}` segments (each possibly empty; `em` renders italic) rather than three fixed lines — EN: `{pre: 'Every gram,', em: 'accounted', post: 'for.'}`, FI: `{pre: 'Kalan', em: 'tarkkuudella.', post: ''}`.

### `src/App.tsx` (modified)

- `const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('entailu-lang') as Lang) ?? 'fi')`
- `const t = translations[lang]`; every hardcoded string becomes a `t.…` lookup. The `FEATURES`/`ALGOS`/`STEPS`/`COMPLIANCE` module-level arrays move into `translations.ts`.
- Nav gains a `FI / EN` toggle styled like the existing font-mono nav links (active language emphasised).
- A `useEffect` on `lang` writes `localStorage`, sets `document.title = t.pageTitle`, and sets `document.documentElement.lang`.

### Untouched

- Stock-ticker fish names (already Finnish product names), all layout/styling/animation, Web3Forms submission logic (only its visible labels translate), Dockerfile/nginx/deploy.

## Error handling

- Corrupt/unknown `localStorage` value → treat as `'fi'` (validate against the two known values on read).
- No network or async paths involved; everything is compile-time checked.

## Testing / verification

1. `npm run lint` and `npm run build` (type parity between languages is enforced by the build).
2. Playwright: load the page → assert Finnish renders by default; click the toggle → assert English; reload → assert persisted choice; screenshot both languages for visual review.
3. User reviews the Finnish copy — the one step that cannot be self-verified to native standard.
4. Deploy to Cloud Run only after the copy review.
