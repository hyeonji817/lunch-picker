import { useMemo, useState } from "react";
import "./App.css";

import Hero from "./components/Hero";
import RandomResult from "./components/RandomResult";
import CategoryTabs from "./components/CategoryTabs";
import MenuForm from "./components/MenuForm";
import MenuList from "./components/MenuList";

import { initialMenus } from "./data/initialMenus";
import type { Category, Menu } from "./types/menu";

function App() {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [pickedMenu, setPickedMenu] = useState<Menu | null>(null);
  const [recentMenuIds, setRecentMenuIds] = useState<number[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [message, setMessage] = useState("오늘 점심 후보를 골라볼까요?");

  // 카테고리 선택에 따라 메뉴 리스트 조회 
  const filteredMenus = useMemo(() => {
    if (selectedCategory === "전체") {
      return menus;
    }

    return menus.filter((menu) => menu.category === selectedCategory);
  }, [menus, selectedCategory]);

  // 
  const availableMenus = useMemo(() => {
    const notRecentMenus = filteredMenus.filter(
      (menu) => !recentMenuIds.includes(menu.id)
    );

    return notRecentMenus.length > 0 ? notRecentMenus : filteredMenus;
  }, [filteredMenus, recentMenuIds]);

  const pickRandomMenu = () => {
    if (filteredMenus.length === 0) {
      setPickedMenu(null);
      setMessage("먼저 메뉴를 등록해주세요.");
      return;
    }

    setIsPicking(true);
    setMessage("고민 중...");

    window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableMenus.length);
      const selectedMenu = availableMenus[randomIndex];

      setPickedMenu(selectedMenu);
      setRecentMenuIds((prevIds) => [selectedMenu.id, ...prevIds].slice(0, 3));
      setMessage("오늘의 추천 메뉴는");
      setIsPicking(false);
    }, 700);
  };

  const addMenu = (newMenu: Menu) => {
    setMenus((prevMenus) => [...prevMenus, newMenu]);
  };

  const deleteMenu = (id: number) => {
    setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
    setRecentMenuIds((prevIds) => prevIds.filter((menuId) => menuId !== id));

    if (pickedMenu?.id === id) {
      setPickedMenu(null);
      setMessage("추천 메뉴가 삭제됐어요. 다시 추천받아보세요.");
    }
  };

  return (
    <main className="app">
      <Hero />

      <section className="picker">
        <RandomResult
          pickedMenu={pickedMenu}
          isPicking={isPicking}
          message={message}
        />

        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <button type="button" className="pickButton" onClick={pickRandomMenu}>
          점심 메뉴 추천받기
        </button>
      </section>

      <section className="contentGrid">
        <MenuForm onAddMenu={addMenu} onShowMessage={setMessage} />

        <MenuList menus={filteredMenus} onDeleteMenu={deleteMenu} />
      </section>
    </main>
  );
}

export default App;