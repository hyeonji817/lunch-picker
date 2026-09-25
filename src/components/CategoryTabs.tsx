import type { CategoryFilter } from "../hooks/useMenuPicker";

const CATEGORIES: CategoryFilter[] = ["전체", "한식", "중식", "일식", "양식", "분식", "건강식", "기타"];

interface Props {
  selected: CategoryFilter;
  onSelect: (c: CategoryFilter) => void;
  excludeSpicy: boolean;
  onToggleSpicy: () => void;
  lightOnly: boolean;
  onToggleLight: () => void;
}

export default function CategoryTabs({
  selected,
  onSelect,
  excludeSpicy,
  onToggleSpicy,
  lightOnly,
  onToggleLight,
}: Props) {
  return (
    <>
      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${c === selected ? " active" : ""}`}
            onClick={() => onSelect(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="filters filters--mood">
        <button
          type="button"
          className={`chip${excludeSpicy ? " active" : ""}`}
          onClick={onToggleSpicy}
        >
          🌶️ 매운맛 제외
        </button>
        <button
          type="button"
          className={`chip${lightOnly ? " active" : ""}`}
          onClick={onToggleLight}
        >
          🥗 가벼운 메뉴만
        </button>
      </div>
    </>
  );
}
