import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { EMAIL_CENTER_I18N, EMAIL_CENTER_TEST_IDS, kindItemTestID } from '../../constants';
import type { EmailCategoryGroup } from '../../model/types';

const GROUP_GAP = 16;
const ITEM_PADDING_V = 10;
const ITEM_PADDING_H = 12;
const ITEM_RADIUS = 8;
const ITEM_BORDER = 1;
const HEADER_FONT = 12;
const TITLE_FONT = 15;
const DESC_FONT = 12;
const HEADER_SPACING = 6;

const styles = StyleSheet.create({
  group: { marginBottom: GROUP_GAP },
  header: {
    fontSize: HEADER_FONT,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: HEADER_SPACING,
  },
  item: {
    paddingVertical: ITEM_PADDING_V,
    paddingHorizontal: ITEM_PADDING_H,
    borderRadius: ITEM_RADIUS,
    borderWidth: ITEM_BORDER,
    marginBottom: HEADER_SPACING,
  },
  title: { fontSize: TITLE_FONT, fontWeight: '600' },
  desc: { fontSize: DESC_FONT, marginTop: 2 },
});

export interface EmailKindListProps {
  groups: EmailCategoryGroup[];
  selectedKindId: string | undefined;
  onSelect: (kindId: string) => void;
}

/** The grouped (taxonomy) list of email kinds — left column of the Email Center. */
export const EmailKindList = ({
  groups,
  selectedKindId,
  onSelect,
}: EmailKindListProps): React.ReactElement => {
  const { theme, t } = useUi();
  const { colors, palette } = theme;

  return (
    <View testID={EMAIL_CENTER_TEST_IDS.list}>
      {groups.map((group) => (
        <View key={group.category.id} style={styles.group}>
          <Text style={[styles.header, { color: colors.textSecondary }]}>
            {t(group.category.titleI18nKey)}
          </Text>
          {group.kinds.map((kind) => {
            const isSelected = kind.id === selectedKindId;
            return (
              <Pressable
                accessibilityHint={t(EMAIL_CENTER_I18N.selectHint)}
                accessibilityLabel={t(kind.titleI18nKey)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={kind.id}
                onPress={() => onSelect(kind.id)}
                style={[
                  styles.item,
                  {
                    backgroundColor: isSelected ? colors.surfaceElevated : colors.surface,
                    borderColor: isSelected ? palette.primary['500'] : colors.border,
                  },
                ]}
                testID={kindItemTestID(kind.id)}
              >
                <Text style={[styles.title, { color: colors.text }]}>{t(kind.titleI18nKey)}</Text>
                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                  {t(kind.descriptionI18nKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
