import { act, renderHook } from '@testing-library/react';

import { EmailFieldKind } from '../../model/EmailFieldKind';
import type { EmailKind } from '../../model/types';

import { useEmailCenterState } from './useEmailCenterState';

const kinds: EmailKind[] = [
  {
    id: 'confirm',
    category: 'transactional',
    titleI18nKey: 't',
    descriptionI18nKey: 'd',
    fields: [{ key: 'name', labelI18nKey: 'l', kind: EmailFieldKind.Text, sample: 'Maria' }],
    defaultContent: {
      subject: 'Hi {{name}}',
      heading: 'Welcome',
      bodyBlocks: ['Step 1', 'Step 2'],
    },
  },
];

describe('useEmailCenterState', () => {
  it('starts with nothing selected', () => {
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, onSaveOverride: jest.fn() }),
    );
    expect(result.current.selectedKind).toBeUndefined();
    expect(result.current.preview).toBeUndefined();
    expect(result.current.isDirty).toBe(false);
  });

  it('seeds the draft + preview on select', () => {
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, onSaveOverride: jest.fn() }),
    );
    act(() => result.current.select('confirm'));
    expect(result.current.draft?.subject).toBe('Hi {{name}}');
    expect(result.current.preview?.subject).toBe('Hi Maria');
    expect(result.current.isDirty).toBe(false);
  });

  it('marks dirty after an edit and updates the live preview', () => {
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, onSaveOverride: jest.fn() }),
    );
    act(() => result.current.select('confirm'));
    act(() => result.current.setSubject('Confirmed {{name}}'));
    expect(result.current.isDirty).toBe(true);
    expect(result.current.preview?.subject).toBe('Confirmed Maria');
  });

  it('edits a single body block by index', () => {
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, onSaveOverride: jest.fn() }),
    );
    act(() => result.current.select('confirm'));
    act(() => result.current.setBodyBlock(1, 'Changed step'));
    expect(result.current.draft?.bodyBlocks).toEqual(['Step 1', 'Changed step']);
  });

  it('reset restores the seeded draft and clears dirty', () => {
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, onSaveOverride: jest.fn() }),
    );
    act(() => result.current.select('confirm'));
    act(() => result.current.setSubject('x'));
    act(() => result.current.reset());
    expect(result.current.draft?.subject).toBe('Hi {{name}}');
    expect(result.current.isDirty).toBe(false);
  });

  it('save calls the port with the minimal override', async () => {
    const onSaveOverride = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useEmailCenterState({ kinds, onSaveOverride }));
    act(() => result.current.select('confirm'));
    act(() => result.current.setSubject('New subject'));
    await act(async () => {
      await result.current.save();
    });
    expect(onSaveOverride).toHaveBeenCalledWith({
      kindId: 'confirm',
      content: { subject: 'New subject' },
      autoSend: false,
    });
  });

  it('seeds autoSend + draft from an existing override', () => {
    const overrides = [{ kindId: 'confirm', content: { heading: 'Saved' }, autoSend: true }];
    const { result } = renderHook(() =>
      useEmailCenterState({ kinds, overrides, onSaveOverride: jest.fn() }),
    );
    act(() => result.current.select('confirm'));
    expect(result.current.draft?.heading).toBe('Saved');
    expect(result.current.autoSend).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });
});
