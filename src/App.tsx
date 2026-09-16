import "./App.css";

import Hero from "./components/Hero";
import RandomResult from "./components/RandomResult";
import CategoryTabs from "./components/CategoryTabs";
import MenuForm from "./components/MenuForm";
import MenuList from "./components/MenuList";

import { useMenuPicker } from "./hooks/useMenuPicker";

function App() {
  const {
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
  } = useMenuPicker();

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