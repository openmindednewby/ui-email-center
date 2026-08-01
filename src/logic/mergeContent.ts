import type { EmailOverride, EmailTemplateContent } from '../model/types';

/**
 * Layer a partial override over a kind's default content.
 *
 * The default (which mirrors `Email.Templating`) is the base; only the keys the tenant actually
 * changed are taken from the override. `undefined` override values fall back to the base — an
 * override object is never required to be exhaustive, and clearing a key is expressed by an empty
 * string / empty array, not by `undefined`.
 */
export function mergeContent(
  base: EmailTemplateContent,
  override?: Partial<EmailTemplateContent>,
): EmailTemplateContent {
  if (override === undefined) {
    return { ...base, bodyBlocks: [...base.bodyBlocks] };
  }
  return {
    subject: pick(override.subject, base.subject),
    heading: pick(override.heading, base.heading),
    bodyBlocks: override.bodyBlocks !== undefined ? [...override.bodyBlocks] : [...base.bodyBlocks],
    ctaLabel: pick(override.ctaLabel, base.ctaLabel),
    ctaUrlToken: pick(override.ctaUrlToken, base.ctaUrlToken),
    footerNote: pick(override.footerNote, base.footerNote),
  };
}

/** Find the effective override for a kind id from a list (last one wins), or `undefined`. */
export function findOverride(
  overrides: EmailOverride[] | undefined,
  kindId: string,
): EmailOverride | undefined {
  if (overrides === undefined) {
    return undefined;
  }
  let found: EmailOverride | undefined;
  for (const override of overrides) {
    if (override.kindId === kindId) {
      found = override;
    }
  }
  return found;
}

function pick<T>(overrideValue: T | undefined, baseValue: T): T {
  return overrideValue !== undefined ? overrideValue : baseValue;
}
