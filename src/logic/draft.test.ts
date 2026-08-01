import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailKind } from '../model/types';

import { buildOverride, diffOverride, initialDraft, isDraftDirty } from './draft';

const kind: EmailKind = {
  id: 'k',
  category: 'c',
  titleI18nKey: 't',
  descriptionI18nKey: 'd',
  fields: [{ key: 'name', labelI18nKey: 'l', kind: EmailFieldKind.Text, sample: 's' }],
  defaultContent: {
    subject: 'Default subject',
    heading: 'Default heading',
    bodyBlocks: ['b1', 'b2'],
    ctaLabel: 'Pay',
    ctaUrlToken: 'payUrl',
    footerNote: 'Footer',
  },
};

describe('initialDraft', () => {
  it('returns the default content when no override', () => {
    expect(initialDraft(kind)).toEqual(kind.defaultContent);
  });

  it('applies a saved override', () => {
    expect(initialDraft(kind, { subject: 'Saved' }).subject).toBe('Saved');
  });
});

describe('diffOverride', () => {
  it('is empty when the draft equals the default', () => {
    expect(diffOverride(kind, { ...kind.defaultContent })).toEqual({});
  });

  it('includes only the changed scalar keys', () => {
    const draft = { ...kind.defaultContent, subject: 'New' };
    expect(diffOverride(kind, draft)).toEqual({ subject: 'New' });
  });

  it('includes bodyBlocks only when they differ', () => {
    const draft = { ...kind.defaultContent, bodyBlocks: ['b1', 'changed'] };
    expect(diffOverride(kind, draft)).toEqual({ bodyBlocks: ['b1', 'changed'] });
  });

  it('drops a field edited back to the default', () => {
    const draft = { ...kind.defaultContent, heading: 'x' };
    const backToDefault = { ...draft, heading: kind.defaultContent.heading };
    expect(diffOverride(kind, backToDefault)).toEqual({});
  });
});

describe('buildOverride', () => {
  it('wraps the minimal diff with the kind id and autoSend', () => {
    const draft = { ...kind.defaultContent, subject: 'New' };
    expect(buildOverride(kind, draft, true)).toEqual({
      kindId: 'k',
      content: { subject: 'New' },
      autoSend: true,
    });
  });
});

describe('isDraftDirty', () => {
  it('is false when draft matches default and no saved override', () => {
    expect(isDraftDirty(kind, { ...kind.defaultContent }, false)).toBe(false);
  });

  it('is true when a scalar changed', () => {
    const draft = { ...kind.defaultContent, subject: 'New' };
    expect(isDraftDirty(kind, draft, false)).toBe(true);
  });

  it('is false when draft matches the saved override', () => {
    const draft = { ...kind.defaultContent, subject: 'Saved' };
    const saved = { kindId: 'k', content: { subject: 'Saved' }, autoSend: false };
    expect(isDraftDirty(kind, draft, false, saved)).toBe(false);
  });

  it('is true when only autoSend differs from saved', () => {
    const draft = { ...kind.defaultContent };
    const saved = { kindId: 'k', content: {}, autoSend: false };
    expect(isDraftDirty(kind, draft, true, saved)).toBe(true);
  });
});
