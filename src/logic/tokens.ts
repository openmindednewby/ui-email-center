import type { EmailField } from '../model/types';

/** Matches `{{token}}` with optional inner whitespace: `{{ recipientName }}`. */
const TOKEN_PATTERN = /\{\{\s*([\w.-]+)\s*\}\}/g;

/**
 * Substitute `{{token}}` occurrences in `text` using `values`.
 *
 * - A known token → its value (empty string if the value is `undefined`, so a template never
 *   leaks a literal `{{token}}` for a field the app forgot to supply a value for).
 * - An UNKNOWN token (no entry in `values`) is left verbatim, so a missing registration is visible
 *   in the preview rather than silently blanked.
 */
export function substituteTokens(
  text: string,
  values: Record<string, string | undefined>,
): string {
  return text.replace(TOKEN_PATTERN, (whole, key: string) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      return whole;
    }
    const value = values[key];
    return value !== undefined ? value : '';
  });
}

/** Build the sample value map for a set of fields (used to render the preview). */
export function resolveSampleValues(fields: EmailField[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    values[field.key] = field.sample;
  }
  return values;
}

/** Extract the distinct token keys referenced anywhere in a block of text. */
export function extractTokenKeys(text: string): string[] {
  const keys: string[] = [];
  let match: RegExpExecArray | null = TOKEN_PATTERN.exec(text);
  while (match !== null) {
    const key = match[1];
    if (key !== undefined && !keys.includes(key)) {
      keys.push(key);
    }
    match = TOKEN_PATTERN.exec(text);
  }
  TOKEN_PATTERN.lastIndex = 0;
  return keys;
}
