import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';
import { FormField, FormSwitch } from '@dloizides/ui-forms';

import { bodyBlockTestID, EMAIL_CENTER_I18N, EMAIL_CENTER_TEST_IDS } from '../../constants';
import type { EmailField, EmailTemplateContent } from '../../model/types';

const SECTION_GAP = 12;
const FIELDS_FONT = 12;
const CHIP_FONT = 12;
const CHIP_PADDING_V = 4;
const CHIP_PADDING_H = 8;
const CHIP_RADIUS = 6;
const CHIP_GAP = 6;
const ACTIONS_GAP = 8;

const styles = StyleSheet.create({
  container: { rowGap: SECTION_GAP },
  fieldsTitle: { fontSize: FIELDS_FONT, fontWeight: '700', marginBottom: CHIP_GAP },
  chips: { flexDirection: 'row', flexWrap: 'wrap', columnGap: CHIP_GAP, rowGap: CHIP_GAP },
  chip: {
    paddingVertical: CHIP_PADDING_V,
    paddingHorizontal: CHIP_PADDING_H,
    borderRadius: CHIP_RADIUS,
    borderWidth: 1,
  },
  chipText: { fontSize: CHIP_FONT, fontWeight: '600' },
  actions: { flexDirection: 'row', columnGap: ACTIONS_GAP, marginTop: SECTION_GAP },
});

export interface EmailEditorProps {
  fields: EmailField[];
  draft: EmailTemplateContent;
  autoSend: boolean;
  isDirty: boolean;
  isSaving: boolean;
  onSubjectChange: (value: string) => void;
  onHeadingChange: (value: string) => void;
  onBodyBlockChange: (index: number, value: string) => void;
  onAutoSendChange: (value: boolean) => void;
  onSave: () => void | Promise<unknown>;
  onReset: () => void;
}

/** The copy editor — subject / heading / body blocks + the per-event auto-send toggle + actions. */
export const EmailEditor = (props: EmailEditorProps): React.ReactElement => {
  const { theme, t } = useUi();
  const { colors } = theme;

  return (
    <View style={styles.container} testID={EMAIL_CENTER_TEST_IDS.editor}>
      <View>
        <Text style={[styles.fieldsTitle, { color: colors.textSecondary }]}>
          {t(EMAIL_CENTER_I18N.fieldsTitle)}
        </Text>
        <View style={styles.chips}>
          {props.fields.map((field) => (
            <View
              key={field.key}
              style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>{`{{${field.key}}}`}</Text>
            </View>
          ))}
        </View>
      </View>

      <FormField
        accessibilityHint={t(EMAIL_CENTER_I18N.subjectLabel)}
        label={t(EMAIL_CENTER_I18N.subjectLabel)}
        onChangeText={props.onSubjectChange}
        testID={EMAIL_CENTER_TEST_IDS.subjectField}
        value={props.draft.subject}
      />
      <FormField
        accessibilityHint={t(EMAIL_CENTER_I18N.headingLabel)}
        label={t(EMAIL_CENTER_I18N.headingLabel)}
        onChangeText={props.onHeadingChange}
        testID={EMAIL_CENTER_TEST_IDS.headingField}
        value={props.draft.heading}
      />
      {props.draft.bodyBlocks.map((block, index) => (
        <FormField
          accessibilityHint={t(EMAIL_CENTER_I18N.bodyLabel)}
          key={index}
          label={t(EMAIL_CENTER_I18N.bodyLabel)}
          multiline
          onChangeText={(value) => props.onBodyBlockChange(index, value)}
          testID={bodyBlockTestID(index)}
          value={block}
        />
      ))}

      <FormSwitch
        accessibilityHint={t(EMAIL_CENTER_I18N.autoSendLabel)}
        label={t(EMAIL_CENTER_I18N.autoSendLabel)}
        onValueChange={props.onAutoSendChange}
        testID={EMAIL_CENTER_TEST_IDS.autoSendSwitch}
        value={props.autoSend}
      />

      <View style={styles.actions}>
        <Button
          accessibilityHint={t(EMAIL_CENTER_I18N.saveHint)}
          accessibilityLabel={t(EMAIL_CENTER_I18N.save)}
          disabled={!props.isDirty || props.isSaving}
          label={t(EMAIL_CENTER_I18N.save)}
          loading={props.isSaving}
          onPress={props.onSave}
          testID={EMAIL_CENTER_TEST_IDS.saveButton}
          variant="primary"
        />
        <Button
          accessibilityHint={t(EMAIL_CENTER_I18N.resetHint)}
          accessibilityLabel={t(EMAIL_CENTER_I18N.reset)}
          disabled={!props.isDirty || props.isSaving}
          label={t(EMAIL_CENTER_I18N.reset)}
          onPress={props.onReset}
          testID={EMAIL_CENTER_TEST_IDS.resetButton}
          variant="secondary"
        />
      </View>
    </View>
  );
};
