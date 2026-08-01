// Shared Email Center — a per-product registry of every transactional email, with an extensible
// business taxonomy, per-tenant/per-event copy customization, and dynamic-field ({{token}}) preview.

// Model
export { EmailFieldKind } from './model/EmailFieldKind';
export type {
  EmailField,
  EmailTemplateContent,
  EmailCategory,
  EmailKind,
  EmailOverride,
  SendStatusSummary,
  EmailCategoryGroup,
  EmailPreviewModel,
} from './model/types';

// Pure logic (framework-free — reusable in a backend preview endpoint too)
export { substituteTokens, resolveSampleValues, extractTokenKeys } from './logic/tokens';
export { mergeContent, findOverride } from './logic/mergeContent';
export { groupKindsByCategory, findOrphanKindIds } from './logic/grouping';
export { renderPreview } from './logic/preview';
export { initialDraft, diffOverride, buildOverride, isDraftDirty } from './logic/draft';
export { createEmailRegistry } from './logic/registry';
export type { EmailRegistry } from './logic/registry';

// Constants (test ids + i18n keys the consuming app must translate)
export {
  EMAIL_CENTER_TEST_IDS,
  EMAIL_CENTER_I18N,
  kindItemTestID,
  bodyBlockTestID,
} from './constants';

// Component surface
export { EmailCenter } from './EmailCenter/EmailCenter';
export type { EmailCenterProps } from './EmailCenter/EmailCenter';
export { useEmailCenterState } from './EmailCenter/hooks/useEmailCenterState';
export type {
  EmailCenterState,
  UseEmailCenterStateArgs,
} from './EmailCenter/hooks/useEmailCenterState';
