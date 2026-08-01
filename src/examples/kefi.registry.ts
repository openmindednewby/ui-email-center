/**
 * kefi — the FIRST adopter of the Email Center, expressed against the real package types.
 *
 * This lives inside the package as a typed, tested EXAMPLE so we can prove the shared API fits
 * kefi's real emails WITHOUT importing an unpublished package into kefi-web (kefi installs
 * `@dloizides/*` from the npm registry). On adoption, copy this file into
 * `kefi-web/src/emails/kefi.registry.ts`, add the referenced i18n keys to kefi's `locales/en.json`,
 * and mount `<EmailCenter categories={KEFI_EMAIL_CATEGORIES} kinds={KEFI_EMAIL_KINDS} … />` on an
 * organizer route.
 *
 * The `defaultContent` mirrors the backend `Email.Templating` copy for each kind. The
 * registration-confirmation email now quotes `{{paymentReference}}` (the
 * `FULL-NAME-SURNAME-<pass#>` value already in the register response + organizer tables) and the
 * three payment steps — closing the #303 gap.
 */
import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailCategory, EmailKind } from '../model/types';

export const KEFI_EMAIL_CATEGORIES: EmailCategory[] = [
  { id: 'transactional', titleI18nKey: 'kefi.emails.category.transactional', order: 1 },
  { id: 'lifecycle', titleI18nKey: 'kefi.emails.category.lifecycle', order: 2 },
  { id: 'approval', titleI18nKey: 'kefi.emails.category.approval', order: 3 },
  { id: 'verification', titleI18nKey: 'kefi.emails.category.verification', order: 4 },
  { id: 'access', titleI18nKey: 'kefi.emails.category.access', order: 5 },
];

export const KEFI_EMAIL_KINDS: EmailKind[] = [
  {
    id: 'kefi.registration-confirmation',
    category: 'transactional',
    titleI18nKey: 'kefi.emails.confirmation.title',
    descriptionI18nKey: 'kefi.emails.confirmation.desc',
    senderIdentityI18nKey: 'kefi.emails.sender.noreply',
    replyChannelI18nKey: 'kefi.emails.reply.whatsapp',
    fields: [
      {
        key: 'recipientName',
        labelI18nKey: 'kefi.emails.field.recipientName',
        kind: EmailFieldKind.Text,
        sample: 'Maria Papadopoulou',
      },
      {
        key: 'paymentReference',
        labelI18nKey: 'kefi.emails.field.paymentReference',
        kind: EmailFieldKind.Text,
        sample: 'MARIA-PAPADOPOULOU-0147',
      },
      {
        key: 'paymentUrl',
        labelI18nKey: 'kefi.emails.field.paymentUrl',
        kind: EmailFieldKind.Url,
        sample: 'https://app.kefi.dloizides.com/pay/0147',
      },
    ],
    defaultContent: {
      subject: 'kefi.emails.confirmation.subject',
      heading: 'kefi.emails.confirmation.heading',
      bodyBlocks: [
        'kefi.emails.confirmation.body.intro',
        'kefi.emails.confirmation.body.reference',
        'kefi.emails.confirmation.body.step1',
        'kefi.emails.confirmation.body.step2',
        'kefi.emails.confirmation.body.step3',
      ],
      ctaLabel: 'kefi.emails.confirmation.cta',
      ctaUrlToken: 'paymentUrl',
      footerNote: 'kefi.emails.confirmation.footer',
    },
  },
  {
    id: 'kefi.registration-approved',
    category: 'approval',
    titleI18nKey: 'kefi.emails.approved.title',
    descriptionI18nKey: 'kefi.emails.approved.desc',
    senderIdentityI18nKey: 'kefi.emails.sender.noreply',
    replyChannelI18nKey: 'kefi.emails.reply.whatsapp',
    fields: [
      {
        key: 'recipientName',
        labelI18nKey: 'kefi.emails.field.recipientName',
        kind: EmailFieldKind.Text,
        sample: 'Maria Papadopoulou',
      },
      {
        key: 'ticketUrl',
        labelI18nKey: 'kefi.emails.field.ticketUrl',
        kind: EmailFieldKind.Url,
        sample: 'https://app.kefi.dloizides.com/ticket/0147',
      },
    ],
    defaultContent: {
      subject: 'kefi.emails.approved.subject',
      heading: 'kefi.emails.approved.heading',
      bodyBlocks: ['kefi.emails.approved.body.intro', 'kefi.emails.approved.body.ticket'],
      ctaLabel: 'kefi.emails.approved.cta',
      ctaUrlToken: 'ticketUrl',
      footerNote: 'kefi.emails.approved.footer',
    },
  },
  {
    id: 'kefi.email-verification',
    category: 'verification',
    titleI18nKey: 'kefi.emails.verify.title',
    descriptionI18nKey: 'kefi.emails.verify.desc',
    senderIdentityI18nKey: 'kefi.emails.sender.noreply',
    fields: [
      {
        key: 'verificationUrl',
        labelI18nKey: 'kefi.emails.field.verificationUrl',
        kind: EmailFieldKind.Url,
        sample: 'https://app.kefi.dloizides.com/verify?token=sample',
      },
    ],
    defaultContent: {
      subject: 'kefi.emails.verify.subject',
      heading: 'kefi.emails.verify.heading',
      bodyBlocks: ['kefi.emails.verify.body'],
      ctaLabel: 'kefi.emails.verify.cta',
      ctaUrlToken: 'verificationUrl',
    },
  },
  {
    id: 'kefi.password-reset',
    category: 'access',
    titleI18nKey: 'kefi.emails.reset.title',
    descriptionI18nKey: 'kefi.emails.reset.desc',
    senderIdentityI18nKey: 'kefi.emails.sender.noreply',
    fields: [
      {
        key: 'actionUrl',
        labelI18nKey: 'kefi.emails.field.actionUrl',
        kind: EmailFieldKind.Url,
        sample: 'https://app.kefi.dloizides.com/reset?token=sample',
      },
    ],
    defaultContent: {
      subject: 'kefi.emails.reset.subject',
      heading: 'kefi.emails.reset.heading',
      bodyBlocks: ['kefi.emails.reset.body'],
      ctaLabel: 'kefi.emails.reset.cta',
      ctaUrlToken: 'actionUrl',
    },
  },
  {
    id: 'kefi.organizer-invite',
    category: 'access',
    titleI18nKey: 'kefi.emails.invite.title',
    descriptionI18nKey: 'kefi.emails.invite.desc',
    senderIdentityI18nKey: 'kefi.emails.sender.noreply',
    fields: [
      {
        key: 'actionUrl',
        labelI18nKey: 'kefi.emails.field.actionUrl',
        kind: EmailFieldKind.Url,
        sample: 'https://app.kefi.dloizides.com/invite?token=sample',
      },
    ],
    defaultContent: {
      subject: 'kefi.emails.invite.subject',
      heading: 'kefi.emails.invite.heading',
      bodyBlocks: ['kefi.emails.invite.body'],
      ctaLabel: 'kefi.emails.invite.cta',
      ctaUrlToken: 'actionUrl',
    },
  },
];
