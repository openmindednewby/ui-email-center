import type { EmailOverride, EmailTemplateContent } from '../model/types';

import { findOverride, mergeContent } from './mergeContent';

const base: EmailTemplateContent = {
  subject: 'Base subject',
  heading: 'Base heading',
  bodyBlocks: ['b1', 'b2'],
  ctaLabel: 'Pay',
  ctaUrlToken: 'payUrl',
  footerNote: 'Base footer',
};

describe('mergeContent', () => {
  it('returns a copy of the base when no override is given', () => {
    const result = mergeContent(base);
    expect(result).toEqual(base);
    expect(result.bodyBlocks).not.toBe(base.bodyBlocks);
  });

  it('overrides only the provided keys', () => {
    const result = mergeContent(base, { subject: 'New subject' });
    expect(result.subject).toBe('New subject');
    expect(result.heading).toBe('Base heading');
    expect(result.bodyBlocks).toEqual(['b1', 'b2']);
  });

  it('replaces bodyBlocks wholesale when provided', () => {
    const result = mergeContent(base, { bodyBlocks: ['only'] });
    expect(result.bodyBlocks).toEqual(['only']);
  });

  it('treats an empty string as an intentional clear (distinct from undefined)', () => {
    const result = mergeContent(base, { footerNote: '' });
    expect(result.footerNote).toBe('');
  });

  it('falls back to base for undefined override values', () => {
    const result = mergeContent(base, { subject: undefined });
    expect(result.subject).toBe('Base subject');
  });

  it('does not mutate the base bodyBlocks array', () => {
    const result = mergeContent(base, { bodyBlocks: ['x'] });
    result.bodyBlocks.push('y');
    expect(base.bodyBlocks).toEqual(['b1', 'b2']);
  });
});

describe('findOverride', () => {
  const overrides: EmailOverride[] = [
    { kindId: 'a', content: { subject: 'first-a' } },
    { kindId: 'b', content: { subject: 'b' } },
    { kindId: 'a', content: { subject: 'second-a' } },
  ];

  it('returns undefined when list is undefined', () => {
    expect(findOverride(undefined, 'a')).toBeUndefined();
  });

  it('returns undefined when no override matches', () => {
    expect(findOverride(overrides, 'missing')).toBeUndefined();
  });

  it('returns the LAST matching override (last write wins)', () => {
    expect(findOverride(overrides, 'a')?.content.subject).toBe('second-a');
  });
});
