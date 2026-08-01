import type {
  EmailKind,
  EmailPreviewModel,
  EmailTemplateContent,
} from '../model/types';

import { mergeContent } from './mergeContent';
import { resolveSampleValues, substituteTokens } from './tokens';

/**
 * Build the fully-resolved preview for a kind: default content ← override, then `{{token}}`
 * substitution using either the supplied values or the fields' sample values.
 *
 * The CTA URL is resolved from `ctaUrlToken` against the same value map, so the previewed button
 * points at the sample/live URL rather than showing a raw token.
 */
export function renderPreview(
  kind: EmailKind,
  override?: Partial<EmailTemplateContent>,
  values?: Record<string, string | undefined>,
): EmailPreviewModel {
  const content = mergeContent(kind.defaultContent, override);
  const resolvedValues = values !== undefined ? values : resolveSampleValues(kind.fields);

  return {
    subject: substituteTokens(content.subject, resolvedValues),
    heading: substituteTokens(content.heading, resolvedValues),
    bodyBlocks: content.bodyBlocks.map((block) => substituteTokens(block, resolvedValues)),
    ctaLabel: content.ctaLabel !== undefined ? substituteTokens(content.ctaLabel, resolvedValues) : undefined,
    ctaUrl: resolveCtaUrl(content.ctaUrlToken, resolvedValues),
    footerNote:
      content.footerNote !== undefined ? substituteTokens(content.footerNote, resolvedValues) : undefined,
  };
}

function resolveCtaUrl(
  ctaUrlToken: string | undefined,
  values: Record<string, string | undefined>,
): string | undefined {
  if (ctaUrlToken === undefined) {
    return undefined;
  }
  const url = values[ctaUrlToken];
  return url !== undefined && url !== '' ? url : undefined;
}
