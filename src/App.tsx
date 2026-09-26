import "./App.css";
import { useState } from "react";
import type { PickerKind } from "./types/menu";
import { dessertMenus } from "./data/dessertMenus";
import RestaurantPicker from "./components/RestaurantPicker";
import Hero from "./components/Hero";
import CategoryTabs from "./components/CategoryTabs";
import RandomResult from "./components/RandomResult";
import RestaurantSearch from "./components/RestaurantSearch";
import { initialMenus } from "./data/initialMenus";
import { useMenuPicker } from "./hooks/useMenuPicker";

// 기존 MenuForm/MenuList로 사용자가 메뉴를 추가하고 있다면,
// initialMenus 대신 [...initialMenus, ...userMenus] 형태로 합쳐서 useMenuPicker에 넘기면 됩니다.
function PickerPage({ kind }: { kind: PickerKind }) {
  const {
    category,
    setCategory,
    excludeSpicy,
    toggleSpicy,
    lightOnly,
    toggleLight,
    current,
    spinning,
    roll,
    poolSize,
  } = useMenuPicker(kind === "meal" ? initialMenus : dessertMenus);

  const hasRolled = current !== null;

  return (
    <>
      <Hero kind={kind} />

      <CategoryTabs
        kind={kind}
        selected={category}
        onSelect={setCategory}
        excludeSpicy={excludeSpicy}
        onToggleSpicy={toggleSpicy}
        lightOnly={lightOnly}
        onToggleLight={toggleLight}
      />

      {kind === "meal" && category === "레스토랑" ? <RestaurantPicker /> : <>
      <RandomResult
        kind={kind}
        current={current}
        spinning={spinning}
        hasRolled={hasRolled}
        poolSize={poolSize}
        onRoll={roll}
      />

      {hasRolled && !spinning && <RestaurantSearch kind={kind} menuName={current?.name ?? null} />}
      </>}

      
    </>
  );
}

export default function App() {
  const [kind, setKind] = useState<PickerKind>("meal");
  const tabs = [{ id: "meal", label: "🍚 식사" }, { id: "dessert", label: "🍰 디저트" }] as const;
  return <div className="app">
    <div className="sheet-tabs" role="tablist" aria-label="메뉴 종류">
      {tabs.map((tab, index) => <button key={tab.id} type="button" role="tab"
        id={tab.id + "-tab"} aria-controls={tab.id + "-panel"} aria-selected={kind === tab.id}
        tabIndex={kind === tab.id ? 0 : -1} onClick={() => setKind(tab.id)}
        onKeyDown={(event) => {
          const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[1] :
            ["ArrowLeft", "ArrowRight"].includes(event.key) ? tabs[1 - index] : null;
          if (next) { event.preventDefault(); setKind(next.id); document.getElementById(next.id + "-tab")?.focus(); }
        }}>{tab.label}</button>)}
    </div>
    {tabs.map(tab => <section key={tab.id} id={tab.id + "-panel"} role="tabpanel"
      aria-labelledby={tab.id + "-tab"} hidden={kind !== tab.id} tabIndex={0}>
      <PickerPage kind={tab.id} />
    </section>)}
    <footer>런치픽커 · 오늘의 식사와 디저트 추천</footer>
  </div>;
}
