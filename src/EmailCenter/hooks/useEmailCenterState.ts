import { useCallback, useMemo, useState } from 'react';

import { findOverride } from '../../logic/mergeContent';
import { renderPreview } from '../../logic/preview';
import {
  buildOverride,
  initialDraft,
  isDraftDirty,
} from '../../logic/draft';
import type {
  EmailKind,
  EmailOverride,
  EmailPreviewModel,
  EmailTemplateContent,
} from '../../model/types';

export interface UseEmailCenterStateArgs {
  kinds: EmailKind[];
  overrides?: EmailOverride[];
  onSaveOverride: (override: EmailOverride) => void | Promise<unknown>;
}

export interface EmailCenterState {
  selectedKindId: string | undefined;
  selectedKind: EmailKind | undefined;
  draft: EmailTemplateContent | undefined;
  autoSend: boolean;
  isDirty: boolean;
  isSaving: boolean;
  preview: EmailPreviewModel | undefined;
  select: (kindId: string) => void;
  setSubject: (value: string) => void;
  setHeading: (value: string) => void;
  setBodyBlock: (index: number, value: string) => void;
  setAutoSend: (value: boolean) => void;
  reset: () => void;
  save: () => Promise<void>;
}

/**
 * All list→select→edit→save state for `<EmailCenter>`, kept out of the view so the reducer-ish
 * logic is unit-testable without rendering. Selecting a kind seeds the draft from its default +
 * saved override; edits are local until `save` calls the injected `onSaveOverride` port.
 */
export function useEmailCenterState(args: UseEmailCenterStateArgs): EmailCenterState {
  const { kinds, overrides, onSaveOverride } = args;

  const [selectedKindId, setSelectedKindId] = useState<string | undefined>(undefined);
  const [draft, setDraft] = useState<EmailTemplateContent | undefined>(undefined);
  const [autoSend, setAutoSendState] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedKind = useMemo(
    () => kinds.find((kind) => kind.id === selectedKindId),
    [kinds, selectedKindId],
  );

  const select = useCallback(
    (kindId: string) => {
      const kind = kinds.find((candidate) => candidate.id === kindId);
      if (kind === undefined) {
        return;
      }
      const saved = findOverride(overrides, kindId);
      setSelectedKindId(kindId);
      setDraft(initialDraft(kind, saved?.content));
      setAutoSendState(saved?.autoSend === true);
    },
    [kinds, overrides],
  );

  const setSubject = useCallback((value: string) => {
    setDraft((current) => (current !== undefined ? { ...current, subject: value } : current));
  }, []);

  const setHeading = useCallback((value: string) => {
    setDraft((current) => (current !== undefined ? { ...current, heading: value } : current));
  }, []);

  const setBodyBlock = useCallback((index: number, value: string) => {
    setDraft((current) => {
      if (current === undefined) {
        return current;
      }
      const bodyBlocks = current.bodyBlocks.map((block, blockIndex) =>
        blockIndex === index ? value : block,
      );
      return { ...current, bodyBlocks };
    });
  }, []);

  const setAutoSend = useCallback((value: boolean) => {
    setAutoSendState(value);
  }, []);

  const reset = useCallback(() => {
    if (selectedKind === undefined) {
      return;
    }
    const saved = findOverride(overrides, selectedKind.id);
    setDraft(initialDraft(selectedKind, saved?.content));
    setAutoSendState(saved?.autoSend === true);
  }, [selectedKind, overrides]);

  const isDirty = useMemo(() => {
    if (selectedKind === undefined || draft === undefined) {
      return false;
    }
    return isDraftDirty(selectedKind, draft, autoSend, findOverride(overrides, selectedKind.id));
  }, [selectedKind, draft, autoSend, overrides]);

  const preview = useMemo(() => {
    if (selectedKind === undefined || draft === undefined) {
      return undefined;
    }
    return renderPreview(selectedKind, draft);
  }, [selectedKind, draft]);

  const save = useCallback(async () => {
    if (selectedKind === undefined || draft === undefined) {
      return;
    }
    setIsSaving(true);
    try {
      await onSaveOverride(buildOverride(selectedKind, draft, autoSend));
    } finally {
      setIsSaving(false);
    }
  }, [selectedKind, draft, autoSend, onSaveOverride]);

  return {
    selectedKindId,
    selectedKind,
    draft,
    autoSend,
    isDirty,
    isSaving,
    preview,
    select,
    setSubject,
    setHeading,
    setBodyBlock,
    setAutoSend,
    reset,
    save,
  };
}
