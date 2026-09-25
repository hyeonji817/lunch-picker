import { useState, type FormEvent } from "react";
import { categories, type Menu, type MenuCategory } from "../types/menu";

type MenuFormProps = {
  onAddMenu: (menu: Menu) => void;
  onShowMessage: (message: string) => void;
};

function MenuForm({ onAddMenu, onShowMessage }: MenuFormProps) {
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState<MenuCategory>("한식");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = menuName.trim();

    if (!trimmedName) {
      onShowMessage("메뉴 이름을 입력해주세요.");
      return;
    }

    const newMenu: Menu = {
      id: Date.now(),
      name: trimmedName,
      category: menuCategory,
    };

    onAddMenu(newMenu);
    onShowMessage(`${trimmedName} 메뉴를 추가했어요.`);
    setMenuName("");
    setMenuCategory("한식");
  };

  return (
    <form className="menuForm" onSubmit={handleSubmit}>
      <h2>메뉴 추가</h2>

      <label>
        메뉴 이름
        <input
          value={menuName}
          onChange={(event) => setMenuName(event.target.value)}
          placeholder="예: 돈까스"
        />
      </label>

      <label>
        카테고리
        <select
          value={menuCategory}
          onChange={(event) =>
            setMenuCategory(event.target.value as MenuCategory)
          }
        >
          {categories
            .filter((category) => category !== "전체")
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </label>

      <button type="submit">추가하기</button>
    </form>
  );
}

export default MenuForm;