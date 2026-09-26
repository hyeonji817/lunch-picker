import type { CategoryFilter } from "../hooks/useMenuPicker";

const CATEGORIES: CategoryFilter[] = ["전체", "한식", "중식", "일식", "양식", "분식", "건강식", "기타"];

interface Props {
  kind: "meal" | "dessert";
  selected: CategoryFilter;
  onSelect: (c: CategoryFilter) => void;
  excludeSpicy: boolean;
  onToggleSpicy: () => void;
  lightOnly: boolean;
  onToggleLight: () => void;
}

export default function CategoryTabs({
  kind,
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
        {(kind === "meal" ? CATEGORIES : ["전체", "케이크", "베이커리", "아이스크림", "빙수", "쿠키&마카롱", "음료"] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${c === selected ? " active" : ""}`}
            aria-pressed={c === selected}
            onClick={() => onSelect(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {kind === "meal" && <div className="filters filters--mood">
        <button
          type="button"
          className={`chip${excludeSpicy ? " active" : ""}`}
          aria-pressed={excludeSpicy} onClick={onToggleSpicy}
        >
          🌶️ 매운맛 제외
        </button>
        <button
          type="button"
          className={`chip${lightOnly ? " active" : ""}`}
          aria-pressed={lightOnly} onClick={onToggleLight}
        >
          🥗 가벼운 메뉴만
        </button>
      </div>}
    </>
  );
}
