"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";
import { DUR, EASE_OUT, SPRING_SOFT } from "@/lib/motion";
import { useMotionFlags } from "@/components/motion/MotionProfile";
import { useScrolledPast } from "@/lib/hooks";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocaleMenu } from "@/components/layout/LocaleMenu";
import { SiteSearch } from "@/components/layout/SiteSearch";
import { Logo } from "@/components/ui/Logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV, type NavGroup } from "@/lib/site";

const TRAINING_NAV = [
  { href: "/training#programmes", label: "Programmes" },
  { href: "/training#method", label: "Method" },
  { href: "/training#labs", label: "Labs" },
  { href: "/training#universities", label: "Universities" },
];

function Dropdown({
  group,
  open,
  onOpen,
  onClose,
}: {
  group: NavGroup;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { reduced } = useMotionFlags();

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as globalThis.Node | null))
          onClose();
      }}
    >
      <Link
        href={group.href}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center gap-1.5 px-3.5 py-2 text-[14px] transition-colors duration-200"
        style={{ color: open ? "var(--ink)" : "var(--muted)" }}
      >
        {group.label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          aria-hidden
        />
        {open ? (
          <motion.span
            layoutId="nav-indicator"
            className="absolute inset-x-2 -bottom-px h-px bg-signal"
            transition={reduced ? { duration: 0 } : SPRING_SOFT}
          />
        ) : null}
      </Link>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
            className={`absolute left-1/2 top-[calc(100%+10px)] z-50 -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-[rgb(var(--rgb-panel)/0.98)] shadow-[0_24px_60px_-24px_rgb(var(--rgb-hair)/0.4)] backdrop-blur-xl ${group.wide ? "w-[min(94vw,720px)]" : "w-[min(92vw,420px)]"}`}
          >
            <span
              className="block h-px w-full bg-[linear-gradient(90deg,var(--brand-orange),var(--brand-red))]"
              aria-hidden
            />
            <ul className={`p-2 ${group.wide ? "grid grid-cols-2 gap-x-1" : "flex flex-col"}`}>
              {group.items.map((it) => (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    onClick={onClose}
                    className="group/item flex flex-col gap-0.5 rounded-lg px-3.5 py-2.5 transition-colors duration-150 hover:bg-surface-2"
                  >
                    <span className="text-[13.5px] font-medium text-ink transition-colors duration-150 group-hover/item:text-signal">
                      {it.label}
                    </span>
                    {it.note ? (
                      <span className="text-[12px] text-muted-dim">
                        {it.note}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={group.href}
              onClick={onClose}
              className="group/all flex items-center justify-between border-t border-line px-5 py-3.5 transition-colors duration-150 hover:bg-surface-2"
            >
              <span className="text-[13px] font-medium text-signal">
                {group.viewAll}
              </span>
              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="text-signal transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/all:translate-x-1"
                aria-hidden
              />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const scrolled = useScrolledPast(24);
  const pathname = usePathname() ?? "/";
  const { reduced } = useMotionFlags();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const closeTimer = useRef(0);

  const onTraining = pathname.startsWith("/training");

  // A short close delay stops the panel flickering as the pointer crosses the
  // gap between the trigger and the panel.
  const openMenu = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const closeMenu = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: 0.05 }}
    >
      <motion.div
        className="border-b"
        animate={{
          backgroundColor:
            scrolled || menu
              ? "rgb(var(--rgb-panel) / 0.82)"
              : "rgb(var(--rgb-panel) / 0)",
          borderBottomColor:
            scrolled || menu
              ? "rgb(var(--rgb-hair) / 0.14)"
              : "rgb(var(--rgb-hair) / 0)",
          backdropFilter: scrolled || menu ? "blur(16px)" : "blur(0px)",
        }}
        transition={{ duration: DUR.normal, ease: EASE_OUT }}
      >
        <motion.nav
          className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 sm:px-10"
          animate={{ height: scrolled ? 62 : 80 }}
          transition={{ duration: DUR.normal, ease: EASE_OUT }}
          aria-label="Primary"
        >
          <Link
            href={onTraining ? "/training" : "/"}
            className="flex items-center gap-3"
            aria-label="Cybaethrex home"
          >
            <Logo height={scrolled ? 21 : 25} priority />
            {onTraining ? (
              <span className="mono hidden border-l border-line-strong pl-3 text-[10px] tracking-[0.18em] text-muted-dim sm:inline">
                TRAINING
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center lg:flex">
            {onTraining
              ? TRAINING_NAV.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3.5 py-2 text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))
              : NAV.map((g) => (
                  <Dropdown
                    key={g.label}
                    group={g}
                    open={menu === g.label}
                    onOpen={() => openMenu(g.label)}
                    onClose={closeMenu}
                  />
                ))}

            <span className="mx-3 h-4 w-px bg-line-strong" aria-hidden />
            <Link
              href={onTraining ? "/" : "/training"}
              className="group flex items-center gap-1.5 px-3.5 py-2 text-[14px] text-muted transition-colors duration-200 hover:text-signal"
            >
              {onTraining ? "Consulting" : "Training"}
              <ArrowRight
                size={13}
                strokeWidth={1.8}
                className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <SiteSearch />
            <div className="hidden lg:block">
              <LocaleMenu />
            </div>
            <ThemeToggle />
            <Link
              href="/contact"
              className="group relative ml-1.5 hidden overflow-hidden rounded-full bg-signal px-5 py-2 text-[13px] font-medium text-[var(--on-signal)] transition-colors duration-200 hover:bg-[var(--signal-hover)] sm:inline-flex"
            >
              Contact us
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open navigation"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-muted transition-colors duration-200 hover:border-signal hover:text-signal lg:hidden"
              >
                <Menu size={16} strokeWidth={1.5} aria-hidden />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[88vw] max-w-sm overflow-y-auto border-line bg-[rgb(var(--rgb-panel)/0.98)] backdrop-blur-xl"
              >
                <SheetHeader className="border-b border-line">
                  <SheetTitle className="eyebrow text-muted-dim">
                    {onTraining ? "Training" : "Navigate"}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col px-4 pb-4">
                  {onTraining
                    ? TRAINING_NAV.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="border-b border-line/60 py-3.5 text-[15px] text-muted transition-colors duration-200 hover:text-signal"
                        >
                          {l.label}
                        </Link>
                      ))
                    : NAV.map((g) => (
                        <div key={g.label} className="border-b border-line/60 py-4">
                          <p className="eyebrow mb-3">{g.label}</p>
                          <ul className="flex flex-col gap-2.5">
                            {g.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  href={it.href}
                                  onClick={() => setOpen(false)}
                                  className="text-[14px] text-muted transition-colors duration-200 hover:text-signal"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={g.href}
                            onClick={() => setOpen(false)}
                            className="group mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-signal"
                          >
                            {g.viewAll}
                            <ArrowRight
                              size={13}
                              strokeWidth={1.8}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                              aria-hidden
                            />
                          </Link>
                        </div>
                      ))}

                  <Link
                    href={onTraining ? "/" : "/training"}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-2 py-4 text-[15px] font-medium text-signal"
                  >
                    {onTraining ? "Cybaethrex Consulting" : "Cybaethrex Training"}
                    <ArrowRight
                      size={14}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </Link>
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-line p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                      className="inline-flex rounded-full bg-signal px-5 py-2.5 text-[13px] font-medium text-[var(--on-signal)]"
                    >
                      Contact us
                    </Link>
                    <ThemeToggle />
                  </div>
                  <LocaleMenu compact />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}
