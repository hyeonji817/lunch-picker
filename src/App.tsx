import "./App.css";
import Hero from "./components/Hero";
import CategoryTabs from "./components/CategoryTabs";
import RandomResult from "./components/RandomResult";
import RestaurantSearch from "./components/RestaurantSearch";
import { initialMenus } from "./data/initialMenus";
import { useMenuPicker } from "./hooks/useMenuPicker";

// 기존 MenuForm/MenuList로 사용자가 메뉴를 추가하고 있다면,
// initialMenus 대신 [...initialMenus, ...userMenus] 형태로 합쳐서 useMenuPicker에 넘기면 됩니다.
export default function App() {
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
  } = useMenuPicker(initialMenus);

  const hasRolled = current !== null;

  return (
    <div className="app">
      <Hero />

      <CategoryTabs
        selected={category}
        onSelect={setCategory}
        excludeSpicy={excludeSpicy}
        onToggleSpicy={toggleSpicy}
        lightOnly={lightOnly}
        onToggleLight={toggleLight}
      />

      <RandomResult
        current={current}
        spinning={spinning}
        hasRolled={hasRolled}
        poolSize={poolSize}
        onRoll={roll}
      />

      {hasRolled && !spinning && <RestaurantSearch menuName={current?.name ?? null} />}

      <footer>런치픽커 · 오늘의 메뉴 추천</footer>
    </div>
  );
}
