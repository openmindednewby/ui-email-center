/**
 * The kind of a dynamic email field — governs how the value is treated in the preview.
 * `const enum` per the repo standard (no string-literal unions, one exported enum per file).
 */
export const enum EmailFieldKind {
  /** Plain text substituted inline, e.g. a recipient name or a payment reference. */
  Text = 'text',
  /** A URL — rendered as the target of a CTA button / link in the preview. */
  Url = 'url',
  /** A pre-rendered HTML fragment (e.g. an inline ticket) shown verbatim in the preview. */
  Html = 'html',
}
