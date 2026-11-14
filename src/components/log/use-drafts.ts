"use client";
/**
 * Draft cards waiting for the caregiver's confirmation. Owner: Olzhas.
 * Nothing is saved until confirmAll() — i.e. until she clicks.
 */
import { useCallback, useState } from "react";
import type { WorkspaceApi } from "@/lib/api/client";
import type { DraftEntry, EntrySource, NewEntry } from "@/shared/domain";
import { logCopy, type LogCopy } from "./copy";
import { draftToForm, emptyForm, formToNewEntry, localToday, type DraftForm, type EntryKind, type FormErrors } from "./draft-form";

export type Notice = { tone: "info" | "success" | "warn"; text: string } | null;

export function useDrafts(api: WorkspaceApi, caregiverId: string, onSaved: () => Promise<void>, t: LogCopy = logCopy("en")) {
  const [forms, setForms] = useState<DraftForm[]>([]);
  const [errors, setErrors] = useState<Record<string, FormErrors>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const defaults = useCallback(
    (source: EntrySource) => ({ today: localToday(), caregiverId, source }),
    [caregiverId],
  );

  const addDrafts = useCallback(
    (drafts: DraftEntry[], source: EntrySource) => {
      setForms((prev) => [...prev, ...drafts.map((d) => draftToForm(d, defaults(source)))]);
    },
    [defaults],
  );

  const addEmpty = useCallback(
    (kind: EntryKind, prefillNote = "") => {
      setForms((prev) => [...prev, { ...emptyForm(kind, defaults("manual")), note: prefillNote.slice(0, 280) }]);
    },
    [defaults],
  );

  const update = useCallback((next: DraftForm) => {
    setForms((prev) => prev.map((f) => (f.key === next.key ? next : f)));
  }, []);

  const discard = useCallback((key: string) => {
    setForms((prev) => prev.filter((f) => f.key !== key));
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key)));
  }, []);

  const discardAll = useCallback(() => {
    setForms([]);
    setErrors({});
  }, []);

  const confirmAll = useCallback(async () => {
    if (forms.length === 0) return;
    const results = forms.map((f) => [f.key, formToNewEntry(f, t.errors)] as const);
    const failed = Object.fromEntries(results.flatMap(([k, r]) => (r.ok ? [] : [[k, r.errors]])));
    setErrors(failed);
    if (Object.keys(failed).length > 0) {
      setNotice({ tone: "warn", text: t.notice.missing });
      return;
    }
    const entries = results.flatMap(([, r]) => (r.ok ? [r.entry] : [])) satisfies NewEntry[];
    setSaving(true);
    try {
      await api.createEntries(entries);
      setForms([]);
      setNotice({ tone: "success", text: t.notice.saved(entries.length) });
      await onSaved();
    } catch {
      setNotice({ tone: "warn", text: t.notice.saveFailed });
    } finally {
      setSaving(false);
    }
  }, [api, forms, onSaved, t]);

  return { forms, errors, saving, notice, setNotice, addDrafts, addEmpty, update, discard, discardAll, confirmAll };
}

export type DraftsState = ReturnType<typeof useDrafts>;
