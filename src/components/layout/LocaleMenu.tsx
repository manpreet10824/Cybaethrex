"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  STORAGE_KEY,
  getLocale,
  type LocaleCode,
} from "@/lib/locales";

/**
 * Language selector, in the pattern the reference uses: globe, current
 * language, chevron.
 *
 * English is the default and is the only language the site is currently
 * written in, so the rest are listed but not selectable. Offering a language
 * that silently returns English would be worse than showing it as pending.
 * When translated content exists, flip `available` in the registry and the
 * row becomes live: nothing here needs changing.
 */
/**
 * localStorage as an external store. The server snapshot is null so the first
 * client render matches the server exactly, and the preference resolves on the
 * subscribe pass rather than through a second render triggered from an effect.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // another tab changing the preference should update this one
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // private mode, or storage blocked
  }
}

function writeStored(value: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // the preference simply does not persist
  }
  listeners.forEach((l) => l());
}

export function LocaleMenu({ compact = false }: { compact?: boolean }) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);

  // an unavailable or unknown stored code falls back rather than stranding the
  // reader on a language the site cannot serve
  const code: LocaleCode =
    LOCALES.find((l) => l.code === stored && l.available)?.code ??
    DEFAULT_LOCALE;
  const current = getLocale(code);

  // Push the selection out to the platform API screen readers and translation
  // tooling actually read.
  useEffect(() => {
    document.documentElement.lang = code;
  }, [code]);

  const choose = (next: LocaleCode) => writeStored(next);

  return (
    <Menu.Root modal={false}>
      <Menu.Trigger
        aria-label={`Language: ${current.english}`}
        className={`group flex items-center gap-2 rounded-full text-[13.5px] text-muted transition-colors duration-200 hover:text-ink ${
          compact
            ? "border border-line-strong px-3 py-1.5"
            : "px-2.5 py-2 hover:bg-surface-2"
        }`}
      >
        <Globe size={15} strokeWidth={1.8} className="shrink-0" aria-hidden />
        <span className={compact ? "" : "hidden xl:inline"}>
          {current.label}
        </span>
        <ChevronDown
          size={13}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-popup-open:rotate-180"
          aria-hidden
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="end"
          sideOffset={10}
          className="z-[60]"
        >
          <Menu.Popup className="w-[min(92vw,272px)] origin-top overflow-hidden rounded-xl border border-line bg-[rgb(var(--rgb-panel)/0.98)] shadow-[0_24px_60px_-24px_rgb(var(--rgb-hair)/0.4)] backdrop-blur-xl transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0">
            <span
              className="block h-px w-full bg-[linear-gradient(90deg,var(--brand-orange),var(--brand-red))]"
              aria-hidden
            />

            <p className="eyebrow px-4 pb-1 pt-3.5 text-muted-dim">Language</p>

            <div className="p-1.5 pt-1">
              {LOCALES.map((l) => {
                const selected = l.code === code;
                return (
                  <Menu.Item
                    key={l.code}
                    disabled={!l.available}
                    onClick={() => choose(l.code)}
                    className={`flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2 outline-none transition-colors duration-150 ${
                      l.available
                        ? "cursor-pointer data-highlighted:bg-surface-2"
                        : "opacity-45"
                    }`}
                  >
                    <span className="flex w-4 shrink-0 justify-center">
                      {selected ? (
                        <Check
                          size={14}
                          strokeWidth={2.2}
                          className="text-signal"
                          aria-hidden
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13.5px] font-medium ${
                          selected ? "text-signal" : "text-ink"
                        }`}
                      >
                        {l.label}
                      </span>
                      {/* the exonym only earns a line when it differs */}
                      {l.english !== l.label ? (
                        <span className="block truncate text-[11.5px] text-muted-dim">
                          {l.english}
                        </span>
                      ) : null}
                    </span>
                    {!l.available ? (
                      <span className="mono shrink-0 rounded-full border border-line px-2 py-0.5 text-[9px] tracking-[0.14em] text-muted-dim">
                        SOON
                      </span>
                    ) : null}
                  </Menu.Item>
                );
              })}
            </div>

            <p className="border-t border-line px-4 py-3 text-[11.5px] leading-relaxed text-muted-dim">
              Further languages are in progress. Engagements are delivered in
              English.
            </p>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
