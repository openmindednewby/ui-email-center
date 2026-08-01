import { createEmailRegistry } from '../logic/registry';
import { renderPreview } from '../logic/preview';

import { KEFI_EMAIL_CATEGORIES, KEFI_EMAIL_KINDS } from './kefi.registry';

describe('kefi email registry (first-adopter proof)', () => {
  const registry = createEmailRegistry(KEFI_EMAIL_CATEGORIES, KEFI_EMAIL_KINDS);

  it('registers with no orphan kinds and no duplicate ids', () => {
    expect(registry.orphanKindIds()).toEqual([]);
    expect(registry.kinds()).toHaveLength(5);
  });

  it('groups kefi kinds into its 5 ordered categories', () => {
    expect(registry.groups().map((group) => group.category.id)).toEqual([
      'transactional',
      'approval',
      'verification',
      'access',
    ]);
  });

  it('registration-confirmation exposes name + payment reference + payment url fields', () => {
    const confirmation = registry.kind('kefi.registration-confirmation');
    const fieldKeys = confirmation?.fields.map((field) => field.key);
    expect(fieldKeys).toEqual(['recipientName', 'paymentReference', 'paymentUrl']);
  });

  it('registration-confirmation quotes the reference token + the 3 payment steps (#303 gap)', () => {
    const confirmation = registry.kind('kefi.registration-confirmation');
    const body = confirmation?.defaultContent.bodyBlocks ?? [];
    expect(body).toContain('kefi.emails.confirmation.body.reference');
    expect(body).toContain('kefi.emails.confirmation.body.step1');
    expect(body).toContain('kefi.emails.confirmation.body.step2');
    expect(body).toContain('kefi.emails.confirmation.body.step3');
  });

  it('previews the confirmation email with sample values (reference resolves, cta url resolves)', () => {
    const confirmation = registry.kind('kefi.registration-confirmation');
    if (confirmation === undefined) {
      throw new Error('confirmation kind missing');
    }
    // With no app-level translations, i18n keys pass through; the token substitution is what we assert.
    const preview = renderPreview(confirmation, undefined, {
      recipientName: 'Maria Papadopoulou',
      paymentReference: 'MARIA-PAPADOPOULOU-0147',
      paymentUrl: 'https://pay/0147',
    });
    expect(preview.ctaUrl).toBe('https://pay/0147');
    expect(preview.bodyBlocks).toHaveLength(5);
  });

  it('sender identity + reply channel are configurable i18n keys, not hardcoded', () => {
    const confirmation = registry.kind('kefi.registration-confirmation');
    expect(confirmation?.senderIdentityI18nKey).toBe('kefi.emails.sender.noreply');
    expect(confirmation?.replyChannelI18nKey).toBe('kefi.emails.reply.whatsapp');
  });
});
