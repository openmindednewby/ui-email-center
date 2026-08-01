import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailKind } from '../model/types';

import { renderPreview } from './preview';

const kind: EmailKind = {
  id: 'k',
  category: 'c',
  titleI18nKey: 't',
  descriptionI18nKey: 'd',
  fields: [
    { key: 'name', labelI18nKey: 'l.name', kind: EmailFieldKind.Text, sample: 'Maria' },
    { key: 'ref', labelI18nKey: 'l.ref', kind: EmailFieldKind.Text, sample: 'MARIA-A-14' },
    { key: 'payUrl', labelI18nKey: 'l.url', kind: EmailFieldKind.Url, sample: 'https://pay/14' },
  ],
  defaultContent: {
    subject: 'Hi {{name}}',
    heading: 'Welcome {{name}}',
    bodyBlocks: ['Your reference is {{ref}}', 'Step 1'],
    ctaLabel: 'Pay now',
    ctaUrlToken: 'payUrl',
    footerNote: 'Thanks {{name}}',
  },
};

describe('renderPreview', () => {
  it('substitutes tokens using sample values by default', () => {
    const preview = renderPreview(kind);
    expect(preview.subject).toBe('Hi Maria');
    expect(preview.heading).toBe('Welcome Maria');
    expect(preview.bodyBlocks).toEqual(['Your reference is MARIA-A-14', 'Step 1']);
    expect(preview.footerNote).toBe('Thanks Maria');
  });

  it('resolves the CTA url from the ctaUrlToken', () => {
    const preview = renderPreview(kind);
    expect(preview.ctaLabel).toBe('Pay now');
    expect(preview.ctaUrl).toBe('https://pay/14');
  });

  it('applies an override before substitution', () => {
    const preview = renderPreview(kind, { subject: 'Confirmed, {{name}}!' });
    expect(preview.subject).toBe('Confirmed, Maria!');
  });

  it('uses explicit values over samples when supplied', () => {
    const preview = renderPreview(kind, undefined, { name: 'Nikos', ref: 'NIKOS-B-7', payUrl: '' });
    expect(preview.heading).toBe('Welcome Nikos');
    expect(preview.bodyBlocks[0]).toBe('Your reference is NIKOS-B-7');
  });

  it('leaves ctaUrl undefined when the token resolves to empty', () => {
    const preview = renderPreview(kind, undefined, { name: 'N', ref: 'R', payUrl: '' });
    expect(preview.ctaUrl).toBeUndefined();
  });
});
