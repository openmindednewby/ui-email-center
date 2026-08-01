/**
 * The shared, extensible data model for the Email Center.
 *
 * Every product REGISTERS its own {@link EmailCategory}s and {@link EmailKind}s; the shell, list,
 * preview and editor are shared. Copy defaults REFLECT the backend `Email.Templating` package —
 * the FE never invents new copy, it mirrors + lets a tenant/event override it.
 *
 * i18n: user-facing strings are referenced by KEY (`*I18nKey`). The consuming app owns the actual
 * translations (its `locales/en.json`) and passes a `t(key, ...)` via `@dloizides/ui-feedback`'s
 * `UiProvider`. Sender identity + reply channel are i18n keys too — CONFIGURABLE, never hardcoded.
 */
import type { EmailFieldKind } from './EmailFieldKind';

/** A dynamic `{{token}}` a template exposes, with a sample value used to render the preview. */
export interface EmailField {
  /** Token key as it appears in copy, e.g. `recipientName` → `{{recipientName}}`. */
  key: string;
  /** i18n key for the field's human label shown in the editor's "available fields" list. */
  labelI18nKey: string;
  kind: EmailFieldKind;
  /** Sample value substituted into the preview (never a real customer value). */
  sample: string;
}

/** The customizable copy of a single email — what an organizer edits. May contain `{{tokens}}`. */
export interface EmailTemplateContent {
  subject: string;
  heading: string;
  /** Ordered body paragraphs. Payment steps / instructions are just ordered blocks. */
  bodyBlocks: string[];
  /** Optional call-to-action button label. */
  ctaLabel?: string;
  /** Token key whose value is the CTA target URL, e.g. `ticketUrl`. */
  ctaUrlToken?: string;
  /** Optional footer note (e.g. "Replies go to WhatsApp"). */
  footerNote?: string;
}

/** A product-defined taxonomy bucket (transactional / lifecycle / approval / …). */
export interface EmailCategory {
  id: string;
  titleI18nKey: string;
  /** Sort order within the list (ascending). */
  order: number;
}

/** One email a product sends. Registered by the product; rendered by the shared surface. */
export interface EmailKind {
  /** Stable, product-namespaced id, e.g. `kefi.registration-confirmation`. */
  id: string;
  /** Id of the {@link EmailCategory} this kind belongs to. */
  category: string;
  titleI18nKey: string;
  descriptionI18nKey: string;
  /** Dynamic fields this template exposes for substitution + preview. */
  fields: EmailField[];
  /** Default copy — REFLECTS the backend `Email.Templating` template for this kind. */
  defaultContent: EmailTemplateContent;
  /** i18n key naming the sender identity (e.g. "noreply@…"). Configurable, not hardcoded. */
  senderIdentityI18nKey?: string;
  /** i18n key describing where human replies go (e.g. WhatsApp). Configurable, not hardcoded. */
  replyChannelI18nKey?: string;
}

/** A per-tenant / per-event override layered over a kind's default content. */
export interface EmailOverride {
  kindId: string;
  /** Only the fields the tenant changed — merged over the default via `mergeContent`. */
  content: Partial<EmailTemplateContent>;
  /** Per-event auto-send toggle (e.g. auto-send confirmation on registration). */
  autoSend?: boolean;
}

/** Aggregated delivery signal for a kind, sourced from the `email_sent`/`email_failed` log contract. */
export interface SendStatusSummary {
  sent: number;
  failed: number;
  /** ISO timestamp of the most recent send, or `undefined` if never sent. */
  lastSentAt?: string;
}

/** A category paired with its kinds — the output of taxonomy grouping. */
export interface EmailCategoryGroup {
  category: EmailCategory;
  kinds: EmailKind[];
}

/** The fully-resolved email shown in the preview (tokens substituted). */
export interface EmailPreviewModel {
  subject: string;
  heading: string;
  bodyBlocks: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}
