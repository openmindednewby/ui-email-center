import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailField } from '../model/types';

import { extractTokenKeys, resolveSampleValues, substituteTokens } from './tokens';

describe('substituteTokens', () => {
  it('replaces a known token with its value', () => {
    expect(substituteTokens('Hi {{name}}', { name: 'Maria' })).toBe('Hi Maria');
  });

  it('tolerates inner whitespace in the token', () => {
    expect(substituteTokens('Ref {{ paymentReference }}', { paymentReference: 'AB-12' })).toBe(
      'Ref AB-12',
    );
  });

  it('replaces multiple + repeated tokens', () => {
    expect(substituteTokens('{{a}}-{{b}}-{{a}}', { a: '1', b: '2' })).toBe('1-2-1');
  });

  it('renders an empty string for a known-but-undefined value (never leaks the literal token)', () => {
    expect(substituteTokens('X{{maybe}}Y', { maybe: undefined })).toBe('XY');
  });

  it('leaves an UNKNOWN token verbatim so a missing registration is visible', () => {
    expect(substituteTokens('Hello {{unregistered}}', { name: 'Maria' })).toBe(
      'Hello {{unregistered}}',
    );
  });

  it('returns the input unchanged when there are no tokens', () => {
    expect(substituteTokens('no tokens here', { a: '1' })).toBe('no tokens here');
  });
});

describe('resolveSampleValues', () => {
  it('maps each field key to its sample', () => {
    const fields: EmailField[] = [
      { key: 'name', labelI18nKey: 'l.name', kind: EmailFieldKind.Text, sample: 'Maria' },
      { key: 'url', labelI18nKey: 'l.url', kind: EmailFieldKind.Url, sample: 'https://x' },
    ];
    expect(resolveSampleValues(fields)).toEqual({ name: 'Maria', url: 'https://x' });
  });

  it('returns an empty map for no fields', () => {
    expect(resolveSampleValues([])).toEqual({});
  });
});

describe('extractTokenKeys', () => {
  it('returns distinct keys across repeats', () => {
    expect(extractTokenKeys('{{a}} {{b}} {{a}}')).toEqual(['a', 'b']);
  });

  it('is repeatable (global-regex lastIndex is reset between calls)', () => {
    const text = '{{x}}';
    expect(extractTokenKeys(text)).toEqual(['x']);
    expect(extractTokenKeys(text)).toEqual(['x']);
  });

  it('returns an empty array when there are no tokens', () => {
    expect(extractTokenKeys('plain')).toEqual([]);
  });
});
