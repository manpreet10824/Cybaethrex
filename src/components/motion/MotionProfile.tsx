"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

/**
 * Resolve the profile before the first paint on the client, so sections that
 * swap layout (sticky vs stacked) never flash the wrong variant.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type MotionProfile = {
  /** prefers-reduced-motion: reduce */
  reduced: boolean;
  /** small screen / coarse pointer: fewer particles, no parallax, no cursor work */
  lite: boolean;
  /** hover-capable fine pointer, gate every cursor-driven effect on this */
  fine: boolean;
  /** true after first client effect; keeps SSR and hydration identical */
  ready: boolean;
};

const DEFAULT: MotionProfile = {
  reduced: false,
  lite: false,
  fine: false,
  ready: false,
};

const Ctx = createContext<MotionProfile>(DEFAULT);

export function MotionProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<MotionProfile>(DEFAULT);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 900px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");

    const sync = () =>
      setState({
        reduced: reduce.matches,
        lite: small.matches || coarse.matches,
        fine: hover.matches,
        ready: true,
      });

    sync();
    const all = [reduce, small, coarse, hover];
    all.forEach((m) => m.addEventListener("change", sync));
    return () => all.forEach((m) => m.removeEventListener("change", sync));
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useMotionProfile() {
  return useContext(Ctx);
}

/**
 * Convenience flags for the three questions components actually ask.
 */
export function useMotionFlags() {
  const p = useMotionProfile();
  return useMemo(
    () => ({
      ...p,
      /** ambient loops: particles, orbits, continuous flows */
      ambient: p.ready && !p.reduced,
      /** cursor-reactive effects, desktop only */
      cursor: p.ready && !p.reduced && p.fine && !p.lite,
      /** parallax and long scroll-driven travel */
      parallax: p.ready && !p.reduced && !p.lite,
    }),
    [p],
  );
}
