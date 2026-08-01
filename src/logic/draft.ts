import type { EmailKind, EmailOverride, EmailTemplateContent } from '../model/types';

import { mergeContent } from './mergeContent';

/** The effective content an editor starts from: the kind's default with any saved override applied. */
export function initialDraft(
  kind: EmailKind,
  override?: Partial<EmailTemplateContent>,
): EmailTemplateContent {
  return mergeContent(kind.defaultContent, override);
}

/**
 * Compute the minimal override: only the keys where the draft differs from the kind's DEFAULT
 * content. A field the tenant edited back to the default drops out of the override, so overrides
 * stay small and a later change to the shared `Email.Templating` default still flows through for
 * every field the tenant did not deliberately change.
 */
export function diffOverride(
  kind: EmailKind,
  draft: EmailTemplateContent,
): Partial<EmailTemplateContent> {
  const base = kind.defaultContent;
  const override: Partial<EmailTemplateContent> = {};

  if (draft.subject !== base.subject) {
    override.subject = draft.subject;
  }
  if (draft.heading !== base.heading) {
    override.heading = draft.heading;
  }
  if (!arraysEqual(draft.bodyBlocks, base.bodyBlocks)) {
    override.bodyBlocks = [...draft.bodyBlocks];
  }
  if (draft.ctaLabel !== base.ctaLabel) {
    override.ctaLabel = draft.ctaLabel;
  }
  if (draft.footerNote !== base.footerNote) {
    override.footerNote = draft.footerNote;
  }
  return override;
}

/** Build the {@link EmailOverride} to persist for a kind (minimal content diff + autoSend). */
export function buildOverride(
  kind: EmailKind,
  draft: EmailTemplateContent,
  autoSend: boolean,
): EmailOverride {
  return { kindId: kind.id, content: diffOverride(kind, draft), autoSend };
}

/** Whether the draft or the autoSend flag differ from what was last saved. */
export function isDraftDirty(
  kind: EmailKind,
  draft: EmailTemplateContent,
  autoSend: boolean,
  savedOverride?: EmailOverride,
): boolean {
  const savedContent = savedOverride?.content;
  const savedAutoSend = savedOverride?.autoSend === true;
  const savedDraft = mergeContent(kind.defaultContent, savedContent);
  return !contentEqual(draft, savedDraft) || autoSend !== savedAutoSend;
}

function contentEqual(a: EmailTemplateContent, b: EmailTemplateContent): boolean {
  return (
    a.subject === b.subject &&
    a.heading === b.heading &&
    a.ctaLabel === b.ctaLabel &&
    a.ctaUrlToken === b.ctaUrlToken &&
    a.footerNote === b.footerNote &&
    arraysEqual(a.bodyBlocks, b.bodyBlocks)
  );
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
}
