import { useMemo, useState } from "react";
import { initialMenus } from "../data/initialMenus";
import type { Category, Menu } from "../types/menu";

export function useMenuPicker() {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [pickedMenu, setPickedMenu] = useState<Menu | null>(null);
  const [recentMenuIds, setRecentMenuIds] = useState<number[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [message, setMessage] = useState("오늘 점심 후보를 골라볼까요?");

  // 선택한 카테고리에 해당하는 메뉴
  const filteredMenus = useMemo(() => {
    if (selectedCategory === "전체") {
      return menus;
    }

    return menus.filter((menu) => menu.category === selectedCategory);
  }, [menus, selectedCategory]);

  // 최근 추천 메뉴를 제외하되, 후보가 없으면 전체 후보 사용
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

  return {
    filteredMenus,
    selectedCategory,
    pickedMenu,
    isPicking,
    message,
    setSelectedCategory,
    setMessage,
    pickRandomMenu,
    addMenu,
    deleteMenu,
  };
}