/**
 * Stable test ids + i18n keys for the shared Email Center chrome.
 *
 * The consuming app MUST provide translations for every `EMAIL_CENTER_I18N` key in its
 * `locales/en.json` (see ADOPTION.md). Product-specific strings (category/kind/field labels + copy)
 * are supplied through the registered {@link EmailKind}s and their own i18n keys.
 */
export const EMAIL_CENTER_TEST_IDS = {
  root: 'email-center',
  list: 'email-center-list',
  kindItem: 'email-center-kind',
  preview: 'email-center-preview',
  editor: 'email-center-editor',
  subjectField: 'email-center-subject',
  headingField: 'email-center-heading',
  bodyField: 'email-center-body',
  autoSendSwitch: 'email-center-auto-send',
  saveButton: 'email-center-save',
  resetButton: 'email-center-reset',
} as const;

export const EMAIL_CENTER_I18N = {
  title: 'emailCenter.title',
  listTitle: 'emailCenter.listTitle',
  emptyTitle: 'emailCenter.empty.title',
  emptyMessage: 'emailCenter.empty.message',
  previewTitle: 'emailCenter.preview.title',
  subjectLabel: 'emailCenter.editor.subjectLabel',
  headingLabel: 'emailCenter.editor.headingLabel',
  bodyLabel: 'emailCenter.editor.bodyLabel',
  autoSendLabel: 'emailCenter.editor.autoSendLabel',
  fieldsTitle: 'emailCenter.editor.fieldsTitle',
  save: 'emailCenter.action.save',
  saveHint: 'emailCenter.action.saveHint',
  reset: 'emailCenter.action.reset',
  resetHint: 'emailCenter.action.resetHint',
  selectHint: 'emailCenter.list.selectHint',
  senderLabel: 'emailCenter.meta.senderLabel',
  replyChannelLabel: 'emailCenter.meta.replyChannelLabel',
  sentSummary: 'emailCenter.status.sentSummary',
  neverSent: 'emailCenter.status.neverSent',
} as const;

/** Build the per-kind list item test id. */
export function kindItemTestID(kindId: string): string {
  return `${EMAIL_CENTER_TEST_IDS.kindItem}-${kindId}`;
}

/** Build the per-body-block editor field test id. */
export function bodyBlockTestID(index: number): string {
  return `${EMAIL_CENTER_TEST_IDS.bodyField}-${index}`;
}
