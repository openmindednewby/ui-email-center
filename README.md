# @dloizides/ui-email-center

Shared, brand-agnostic React Native (RN-web) **Email Center** for the dloizides.com portfolio: a
per-product registry of every transactional email a product sends, organized by an **extensible
business taxonomy**, with **per-tenant/per-event copy customization** and **dynamic-field
(`{{token}}`) preview**.

Built on `@dloizides/ui-feedback` (theme + `t`), `@dloizides/ui-forms` (`FormField`, `FormSwitch`)
and `@dloizides/ui-buttons` (`Button`). No raw colour literals; every interactive element carries
`testID` + `accessibilityLabel` + `accessibilityHint`; every string is an injected i18n key.

## The idea

Each product **registers** its own `EmailCategory[]` (the taxonomy) and `EmailKind[]` (the emails it
sends). The package owns the shared shell: a grouped list → a token-substituted preview → a copy
editor. Persistence and delivery-status are **ports** the app injects — the package never talks to a
backend.

```tsx
import { EmailCenter } from '@dloizides/ui-email-center';

<EmailCenter
  categories={PRODUCT_EMAIL_CATEGORIES}
  kinds={PRODUCT_EMAIL_KINDS}
  overrides={savedOverrides}
  onSaveOverride={(o) => api.put('/email-center/overrides', o)}
  sendStatus={sendStatusByKindId}
  testID="organizer-emails"
/>
```

## Model

| Type | Purpose |
|---|---|
| `EmailCategory` | a taxonomy bucket (`transactional` / `lifecycle` / `approval` / …), with `order` |
| `EmailField` | a dynamic `{{token}}` a template exposes, with a `sample` for the preview |
| `EmailTemplateContent` | the editable copy: `subject`, `heading`, `bodyBlocks[]`, `ctaLabel?`, `ctaUrlToken?`, `footerNote?` |
| `EmailKind` | one email; carries `defaultContent` (mirrors backend `Email.Templating`), `fields`, and configurable `senderIdentityI18nKey` / `replyChannelI18nKey` |
| `EmailOverride` | a per-tenant/per-event partial override + `autoSend` toggle |

## Pure logic (framework-free — also usable in a backend preview endpoint)

- `groupKindsByCategory(categories, kinds)` — the ordered, empty-omitted taxonomy view.
- `mergeContent(base, override)` — layer a partial override over the default.
- `substituteTokens(text, values)` — resolve `{{token}}` (unknown tokens stay visible).
- `renderPreview(kind, override?, values?)` — the fully-resolved preview model.
- `diffOverride` / `buildOverride` / `isDraftDirty` — minimal-override + dirty tracking for the editor.
- `createEmailRegistry(categories, kinds)` — a read model (`groups()`, `kind(id)`, `orphanKindIds()`).

## Adoption

See [`ADOPTION.md`](ADOPTION.md) for the per-app checklist (register kinds, mount the surface, add the
`EMAIL_CENTER_I18N` keys, wire the two ports). `src/examples/kefi.registry.ts` is a complete, typed,
tested first-adopter example.

## Development

```bash
npm install
npm run build     # tsup → dist (cjs + esm + d.ts)
npm test          # jest — logic + hook unit tests
npm run lint
npm run typecheck
```
