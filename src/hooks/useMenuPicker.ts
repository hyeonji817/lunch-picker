import { useCallback, useMemo, useRef, useState } from "react";
import type { Category, Menu } from "../types/menu";

const SPIN_TICKS = 14;
const SPIN_INTERVAL_MS = 80;

export type CategoryFilter = Category | "전체";

export function useMenuPicker(menus: Menu[]) {
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [excludeSpicy, setExcludeSpicy] = useState(false);
  const [lightOnly, setLightOnly] = useState(false);
  const [current, setCurrent] = useState<Menu | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const pool = useMemo(
    () =>
      menus.filter(
        (m) =>
          (category === "전체" || m.category === category) &&
          (!excludeSpicy || !m.spicy) &&
          (!lightOnly || m.light)
      ),
    [menus, category, excludeSpicy, lightOnly]
  );

  const roll = useCallback(() => {
    if (pool.length === 0) {
      setCurrent(null);
      return;
    }
    if (timerRef.current) window.clearInterval(timerRef.current);

    setSpinning(true);
    let ticks = 0;
    timerRef.current = window.setInterval(() => {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setCurrent(pick);
      ticks += 1;
      if (ticks >= SPIN_TICKS) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setSpinning(false);
        setCurrent(pool[Math.floor(Math.random() * pool.length)]);
      }
    }, SPIN_INTERVAL_MS);
  }, [pool]);

  const toggleSpicy = useCallback(() => setExcludeSpicy((v) => !v), []);
  const toggleLight = useCallback(() => setLightOnly((v) => !v), []);

  return {
    category,
    setCategory,
    excludeSpicy,
    toggleSpicy,
    lightOnly,
    toggleLight,
    current,
    spinning,
    roll,
    poolSize: pool.length,
  };
}