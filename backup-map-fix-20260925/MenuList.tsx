import type { Menu } from "../types/menu";

type MenuListProps = {
  menus: Menu[];
  onDeleteMenu: (id: number) => void;
};

function MenuList({ menus, onDeleteMenu }: MenuListProps) {
  return (
    <section className="menuList">
      <div className="listHeader">
        <h2>메뉴 목록</h2>
        <span>{menus.length}개</span>
      </div>

      {menus.length === 0 ? (
        <p className="empty">이 카테고리에 등록된 메뉴가 없습니다.</p>
      ) : (
        <ul>
          {menus.map((menu) => (
            <li key={menu.id}>
              <div>
                <strong>{menu.name}</strong>
                <span>{menu.category}</span>
              </div>

              <button type="button" onClick={() => onDeleteMenu(menu.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MenuList;