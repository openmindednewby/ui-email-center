# Adopting `@dloizides/ui-email-center`

Per-app checklist. kefi is the first adopter; `src/examples/kefi.registry.ts` is the reference.

## 1. Install

```bash
npm i @dloizides/ui-email-center
```

Ensure the app already has `@dloizides/ui-feedback`, `@dloizides/ui-forms`, `@dloizides/ui-buttons`
(peer deps) and mounts a `UiProvider`/`FeedbackUiProvider` supplying `theme` + `t` (it does if it
uses the shared kit).

## 2. Register your taxonomy + kinds

Create `src/emails/<product>.registry.ts` exporting `PRODUCT_EMAIL_CATEGORIES: EmailCategory[]` and
`PRODUCT_EMAIL_KINDS: EmailKind[]`. `defaultContent` values are i18n KEYS whose copy MIRRORS the
backend `Email.Templating` template for that kind — do not invent new copy.

## 3. Mount the surface

On an admin/organizer route:

```tsx
<EmailCenter
  categories={PRODUCT_EMAIL_CATEGORIES}
  kinds={PRODUCT_EMAIL_KINDS}
  overrides={overridesQuery.data}
  onSaveOverride={saveOverride}          // PUT /email-center/overrides
  sendStatus={sendStatusQuery.data}      // GET /email-center/send-status (email_sent/_failed contract)
  testID="organizer-emails"
/>
```

## 4. Add the shared chrome i18n keys to `locales/en.json`

The package references these `EMAIL_CENTER_I18N` keys (the app owns the translations):

```
emailCenter.title
emailCenter.listTitle
emailCenter.empty.title
emailCenter.empty.message
emailCenter.preview.title
emailCenter.editor.subjectLabel
emailCenter.editor.headingLabel
emailCenter.editor.bodyLabel
emailCenter.editor.autoSendLabel
emailCenter.editor.fieldsTitle
emailCenter.action.save
emailCenter.action.saveHint
emailCenter.action.reset
emailCenter.action.resetHint
emailCenter.list.selectHint
emailCenter.meta.senderLabel        // e.g. "From: {{p1}}"
emailCenter.meta.replyChannelLabel  // e.g. "Replies: {{p1}}"
emailCenter.status.sentSummary      // e.g. "Sent {{p1}} · failed {{p2}}"
emailCenter.status.neverSent
```

Plus every `*I18nKey` your registered categories / kinds / fields reference.

## 5. Wire the two ports (backend — task #303 §5)

- `onSaveOverride` → `PUT /email-center/overrides` `{ kindId, content, autoSend, eventId? }`.
- `sendStatus` ← `GET /email-center/send-status` which reads the existing `email_sent`/`email_failed`
  structured-log contract (#170) aggregated per kind. Do NOT add a new emitter; read the contract.

Until the endpoints ship, pass a mocked `onSaveOverride` and omit `sendStatus` (it degrades to
"never sent").
