"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import {
  GROUP_ORDER,
  SEARCH_SUGGESTIONS,
  searchSite,
  type SearchEntry,
  type SearchGroup,
} from "@/lib/search";

/**
 * Sitewide search over the derived index: ten practices, every service in the
 * catalogue, the insights, the training programmes and the static pages.
 *
 * Entirely client-side. The corpus is a few hundred short strings, so shipping
 * it beats a round trip and results appear on the keystroke.
 */
export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchSite(q), [q]);

  // grouped for display, then flattened back so the keyboard walks what the
  // eye walks rather than the raw score order
  const groups = useMemo(() => {
    const byGroup = new Map<SearchGroup, SearchEntry[]>();
    for (const r of results) {
      const list = byGroup.get(r.group);
      if (list) list.push(r);
      else byGroup.set(r.group, [r]);
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
      group: g,
      items: byGroup.get(g) as SearchEntry[],
    }));
  }, [results]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // a new query invalidates the old cursor
  const [lastQ, setLastQ] = useState(q);
  if (lastQ !== q) {
    setLastQ(q);
    setActive(0);
  }

  // Opening always starts from a clean query, so the dialog is never restored
  // showing a stale result set. Reset on the transition, not in an effect.
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQ("");
      setActive(0);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) {
          setQ("");
          setActive(0);
        }
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    setOpen(false);
    router.push(entry.href);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[active]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        aria-label="Search Cybaethrex"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
      >
        <Search size={16} strokeWidth={1.8} aria-hidden />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-[rgb(var(--rgb-hair)/0.32)] backdrop-blur-[3px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-[12vh] z-[71] flex max-h-[74vh] w-[min(94vw,660px)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-line bg-[rgb(var(--rgb-panel)/0.98)] shadow-[0_40px_100px_-30px_rgb(var(--rgb-hair)/0.55)] backdrop-blur-2xl transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:opacity-0 data-starting-style:opacity-0">
          <span
            className="block h-px w-full shrink-0 bg-[linear-gradient(90deg,var(--brand-orange),var(--brand-red))]"
            aria-hidden
          />
          <Dialog.Title className="sr-only">Search Cybaethrex</Dialog.Title>

          <div className="flex shrink-0 items-center gap-3 border-b border-line px-5">
            <Search
              size={17}
              strokeWidth={1.8}
              className="shrink-0 text-muted-dim"
              aria-hidden
            />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search services, insights and training"
              aria-label="Search"
              autoComplete="off"
              spellCheck={false}
              className="search-field h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-dim"
            />
            <Dialog.Close
              aria-label="Close search"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-dim transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
            >
              <X size={15} strokeWidth={1.8} aria-hidden />
            </Dialog.Close>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
          >
            {!q.trim() ? (
              <div className="px-3 py-4">
                <p className="eyebrow mb-3 text-muted-dim">Try</p>
                <div className="flex flex-wrap gap-2">
                  {SEARCH_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setQ(s);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-muted transition-colors duration-200 hover:border-signal hover:text-signal"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : flat.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <p className="text-[14px] text-muted">
                  Nothing matched{" "}
                  <span className="text-ink">&ldquo;{q}&rdquo;</span>.
                </p>
                <p className="mt-2 text-[13px] text-muted-dim">
                  Describe the problem instead and we will point you at the
                  right practice.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/contact");
                  }}
                  className="group mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-signal"
                >
                  Talk to us
                  <ArrowRight
                    size={13}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden
                  />
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.group} className="mb-1">
                  <p className="eyebrow px-3.5 pb-1.5 pt-3 text-muted-dim">
                    {g.group}
                  </p>
                  <ul>
                    {g.items.map((item) => {
                      const i = flat.indexOf(item);
                      const isActive = i === active;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            data-active={isActive}
                            onMouseMove={() => setActive(i)}
                            onClick={() => go(item)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left transition-colors duration-100 ${
                              isActive ? "bg-surface-2" : ""
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-[13.5px] font-medium ${
                                  isActive ? "text-signal" : "text-ink"
                                }`}
                              >
                                {item.title}
                              </span>
                              <span className="mt-0.5 block truncate text-[12px] text-muted-dim">
                                {item.sub}
                              </span>
                            </span>
                            <ArrowRight
                              size={13}
                              strokeWidth={1.8}
                              className={`shrink-0 transition-all duration-200 ${
                                isActive
                                  ? "translate-x-0 text-signal opacity-100"
                                  : "-translate-x-1 opacity-0"
                              }`}
                              aria-hidden
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="hidden shrink-0 items-center justify-between gap-4 border-t border-line px-5 py-2.5 sm:flex">
            <span className="mono flex items-center gap-4 text-[10px] tracking-[0.14em] text-muted-dim">
              <span className="flex items-center gap-1.5">
                <Key>&uarr;</Key>
                <Key>&darr;</Key>
                NAVIGATE
              </span>
              <span className="flex items-center gap-1.5">
                <Key>
                  <CornerDownLeft size={9} strokeWidth={2.4} aria-hidden />
                </Key>
                OPEN
              </span>
              <span className="flex items-center gap-1.5">
                <Key>ESC</Key>
                CLOSE
              </span>
            </span>
            <span className="mono text-[10px] tracking-[0.14em] text-muted-dim">
              {q.trim() ? `${flat.length} RESULTS` : "⌘K"}
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flex h-[18px] min-w-[18px] items-center justify-center rounded border border-line-strong px-1 font-[inherit] text-[9px] text-muted">
      {children}
    </kbd>
  );
}
