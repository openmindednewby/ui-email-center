import React, { useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { EMAIL_CENTER_I18N, EMAIL_CENTER_TEST_IDS } from '../constants';
import { groupKindsByCategory } from '../logic/grouping';
import type {
  EmailCategory,
  EmailKind,
  EmailOverride,
  SendStatusSummary,
} from '../model/types';

import { EmailEditor } from './components/EmailEditor';
import { EmailKindList } from './components/EmailKindList';
import { EmailPreview } from './components/EmailPreview';
import { useEmailCenterState } from './hooks/useEmailCenterState';

const LIST_BASIS = 260;
const CONTENT_MIN = 320;
const COLUMN_GAP = 24;
const PANEL_GAP = 20;
const TITLE_FONT = 20;
const HINT_FONT = 14;

const styles = StyleSheet.create({
  root: { flexDirection: 'row', columnGap: COLUMN_GAP, flexWrap: 'wrap' },
  list: { flexGrow: 1, flexShrink: 0, flexBasis: LIST_BASIS },
  content: { flexGrow: 3, flexShrink: 1, flexBasis: CONTENT_MIN, rowGap: PANEL_GAP },
  title: { fontSize: TITLE_FONT, fontWeight: '700', marginBottom: PANEL_GAP },
  empty: { fontSize: HINT_FONT },
});

export interface EmailCenterProps {
  /** The product's taxonomy buckets. */
  categories: EmailCategory[];
  /** The emails the product sends. */
  kinds: EmailKind[];
  /** Saved per-tenant / per-event overrides. */
  overrides?: EmailOverride[];
  /** PORT — persist an override. The package never talks to a backend directly. */
  onSaveOverride: (override: EmailOverride) => void | Promise<unknown>;
  /** PORT — delivery signal per kind id, sourced from the `email_sent`/`email_failed` log contract. */
  sendStatus?: Record<string, SendStatusSummary | undefined>;
  testID?: string;
}

/**
 * The shared Email Center: a product registers its categories + kinds, and this surface renders the
 * grouped list, a token-substituted preview, and a per-tenant/per-event copy editor. All colours
 * come from the active theme; all chrome text from the injected `t()`; persistence is a port.
 */
export const EmailCenter = ({
  categories,
  kinds,
  overrides,
  onSaveOverride,
  sendStatus,
  testID = EMAIL_CENTER_TEST_IDS.root,
}: EmailCenterProps): React.ReactElement => {
  const { theme, t } = useUi();
  const { colors } = theme;

  const groups = useMemo(() => groupKindsByCategory(categories, kinds), [categories, kinds]);
  const state = useEmailCenterState({ kinds, overrides, onSaveOverride });
  const status =
    state.selectedKind !== undefined && sendStatus !== undefined
      ? sendStatus[state.selectedKind.id]
      : undefined;

  return (
    <View style={styles.root} testID={testID}>
      <View style={styles.list}>
        <Text style={[styles.title, { color: colors.text }]}>{t(EMAIL_CENTER_I18N.listTitle)}</Text>
        <EmailKindList groups={groups} onSelect={state.select} selectedKindId={state.selectedKindId} />
      </View>
      <View style={styles.content}>
        {state.selectedKind !== undefined && state.draft !== undefined && state.preview !== undefined ? (
          <>
            <EmailPreview kind={state.selectedKind} preview={state.preview} sendStatus={status} />
            <EmailEditor
              autoSend={state.autoSend}
              draft={state.draft}
              fields={state.selectedKind.fields}
              isDirty={state.isDirty}
              isSaving={state.isSaving}
              onAutoSendChange={state.setAutoSend}
              onBodyBlockChange={state.setBodyBlock}
              onHeadingChange={state.setHeading}
              onReset={state.reset}
              onSave={state.save}
              onSubjectChange={state.setSubject}
            />
          </>
        ) : (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {t(EMAIL_CENTER_I18N.emptyMessage)}
          </Text>
        )}
      </View>
    </View>
  );
};
