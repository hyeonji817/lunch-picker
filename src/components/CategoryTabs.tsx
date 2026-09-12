import { categories, type Category } from "../types/menu";

type CategoryTabsProps = {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
};

function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="categoryTabs">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={selectedCategory === category ? "active" : ""}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;