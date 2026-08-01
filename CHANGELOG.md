# Changelog

## 0.1.0 — first slice (task #303)

Initial, unpublished slice of the shared Email Center.

- Extensible taxonomy model: `EmailCategory`, `EmailKind`, `EmailField`, `EmailTemplateContent`,
  `EmailOverride`, `SendStatusSummary`.
- Framework-free logic: `groupKindsByCategory`, `mergeContent`, `substituteTokens`, `renderPreview`,
  `diffOverride`/`buildOverride`/`isDraftDirty`, `createEmailRegistry`.
- Shared `<EmailCenter>` surface (list → preview → editor) built on `@dloizides/ui-feedback`,
  `@dloizides/ui-forms`, `@dloizides/ui-buttons`; theme colours only; injected `t()`; full a11y +
  testIDs; persistence + send-status as injected ports.
- `useEmailCenterState` hook (select / edit / dirty-track / reset / save).
- `src/examples/kefi.registry.ts` — first-adopter registry (registration-confirmation now quotes the
  payment reference + 3 payment steps; approval/ticket; verification; reset; invite).
