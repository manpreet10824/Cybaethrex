"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Privacy consent, kept as a small external store over localStorage in the
 * same pattern as the locale preference.
 *
 * The site sets no cookies and runs no analytics or advertising scripts, so
 * today the only things it stores are the theme and language preferences,
 * which are strictly necessary and exempt from consent. The banner exists so
 * that visitors are told this plainly and can record a choice, and so that if
 * analytics are ever added they are gated on `optional` being true rather than
 * loaded first and asked about later.
 *
 * The record carries a version: bump CONSENT_VERSION when what the site stores
 * changes materially, and every visitor is asked again.
 */

export const CONSENT_KEY = "cyb-consent";
export const CONSENT_VERSION = 1;

export type Consent = {
  /** false = essential only */
  optional: boolean;
  version: number;
  at: string;
};

const listeners = new Set<() => void>();

/** Reopen requests: a footer link can ask the banner to show again. */
let reopened = false;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (
      typeof parsed.optional !== "boolean" ||
      parsed.version !== CONSENT_VERSION
    ) {
      return null; // an older or malformed record counts as no answer
    }
    return parsed as Consent;
  } catch {
    return null; // private mode, or storage blocked
  }
}

export function writeConsent(optional: boolean) {
  const record: Consent = {
    optional,
    version: CONSENT_VERSION,
    at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // the choice simply does not persist past this page
  }
  reopened = false;
  emit();
}

/** Shows the banner again, for a "Privacy settings" link. */
export function reopenConsent() {
  reopened = true;
  emit();
}

/**
 * Snapshot has to be a stable primitive for useSyncExternalStore, so the
 * state is encoded as a string: "pending" (not yet answered or reopened),
 * "all", or "essential".
 */
type Snapshot = "pending" | "all" | "essential";

function snapshot(): Snapshot {
  if (reopened) return "pending";
  const c = readConsent();
  if (!c) return "pending";
  return c.optional ? "all" : "essential";
}

// The server has no answer, and neither does the first client render: the
// banner only appears once hydration has read storage, so there is no flash
// of a banner for a visitor who already answered.
const serverSnapshot = (): Snapshot | null => null;

export function useConsent() {
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const accept = useCallback(() => writeConsent(true), []);
  const decline = useCallback(() => writeConsent(false), []);
  return {
    /** null while rendering on the server or before hydration */
    state,
    /** true when the visitor has allowed optional storage */
    optional: state === "all",
    accept,
    decline,
    reopen: reopenConsent,
  };
}
