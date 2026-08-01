import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { EMAIL_CENTER_I18N, EMAIL_CENTER_TEST_IDS } from '../../constants';
import type { EmailKind, EmailPreviewModel, SendStatusSummary } from '../../model/types';

const CARD_PADDING = 16;
const CARD_RADIUS = 12;
const CARD_BORDER = 1;
const SUBJECT_FONT = 13;
const HEADING_FONT = 22;
const BODY_FONT = 15;
const BODY_LINE = 22;
const META_FONT = 12;
const BLOCK_GAP = 10;
const CTA_PADDING_V = 10;
const CTA_PADDING_H = 16;
const CTA_RADIUS = 8;

const styles = StyleSheet.create({
  card: { padding: CARD_PADDING, borderRadius: CARD_RADIUS, borderWidth: CARD_BORDER },
  subject: { fontSize: SUBJECT_FONT, fontWeight: '600', marginBottom: BLOCK_GAP },
  heading: { fontSize: HEADING_FONT, fontWeight: '700', marginBottom: BLOCK_GAP },
  body: { fontSize: BODY_FONT, lineHeight: BODY_LINE, marginBottom: BLOCK_GAP },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: CTA_PADDING_V,
    paddingHorizontal: CTA_PADDING_H,
    borderRadius: CTA_RADIUS,
    marginTop: BLOCK_GAP,
  },
  ctaLabel: { fontSize: BODY_FONT, fontWeight: '700' },
  footer: { fontSize: META_FONT, marginTop: BLOCK_GAP },
  meta: { fontSize: META_FONT, marginTop: 4 },
});

export interface EmailPreviewProps {
  kind: EmailKind;
  preview: EmailPreviewModel;
  sendStatus?: SendStatusSummary;
}

/** Renders the resolved (tokens-substituted) email as a customer would see it, plus meta + status. */
export const EmailPreview = ({
  kind,
  preview,
  sendStatus,
}: EmailPreviewProps): React.ReactElement => {
  const { theme, t } = useUi();
  const { colors, palette } = theme;

  return (
    <View testID={EMAIL_CENTER_TEST_IDS.preview}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.subject, { color: colors.textSecondary }]}>{preview.subject}</Text>
        <Text style={[styles.heading, { color: colors.text }]}>{preview.heading}</Text>
        {preview.bodyBlocks.map((block, index) => (
          <Text key={index} style={[styles.body, { color: colors.text }]}>
            {block}
          </Text>
        ))}
        {preview.ctaLabel !== undefined ? (
          <View style={[styles.cta, { backgroundColor: palette.primary['500'] }]}>
            <Text style={[styles.ctaLabel, { color: colors.surfaceElevated }]}>
              {preview.ctaLabel}
            </Text>
          </View>
        ) : null}
        {preview.footerNote !== undefined ? (
          <Text style={[styles.footer, { color: colors.textSecondary }]}>{preview.footerNote}</Text>
        ) : null}
      </View>
      {kind.senderIdentityI18nKey !== undefined ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {t(EMAIL_CENTER_I18N.senderLabel, t(kind.senderIdentityI18nKey))}
        </Text>
      ) : null}
      {kind.replyChannelI18nKey !== undefined ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {t(EMAIL_CENTER_I18N.replyChannelLabel, t(kind.replyChannelI18nKey))}
        </Text>
      ) : null}
      <Text style={[styles.meta, { color: colors.textSecondary }]}>{renderStatus(sendStatus, t)}</Text>
    </View>
  );
};

function renderStatus(
  status: SendStatusSummary | undefined,
  t: (key: string, p1?: string, p2?: string) => string,
): string {
  if (status === undefined || (status.sent === 0 && status.failed === 0)) {
    return t(EMAIL_CENTER_I18N.neverSent);
  }
  return t(EMAIL_CENTER_I18N.sentSummary, String(status.sent), String(status.failed));
}
