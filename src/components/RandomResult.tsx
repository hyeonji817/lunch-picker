import type { Menu } from "../types/menu";

interface Props {
  kind: "meal" | "dessert" | "restaurant";
  current: Menu | null;
  spinning: boolean;
  hasRolled: boolean;
  poolSize: number;
  onRoll: () => void;
}

export default function RandomResult({ kind, current, spinning, hasRolled, poolSize, onRoll }: Props) {
  const label = kind === "restaurant" ? "레스토랑" : kind === "meal" ? "식사" : "디저트";
  if (poolSize === 0) {
    return (
      <div className="stage">
        <p className="empty-note">
          조건에 맞는 {kind === "restaurant" ? "레스토랑 유형이" : "메뉴가"} 없어요.
          <br />
          필터를 조금 풀어볼까요?
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`stage${!hasRolled ? " idle" : ""}`}>
        {current ? (
          <>
            <div className={`emoji-wrap${spinning ? " spin" : ""}`}>{current.emoji}</div>
            <div className="result-name">{current.name}</div>
            <div className="result-desc">{current.desc}</div>
            <div className="tags">
              {kind !== "restaurant" && <span className="tag">{current.kcal}kcal</span>}
              {kind === "meal" && <span className={`tag${current.spicy ? " spicy" : ""}`}>
                {current.spicy ? "🌶️ 매콤" : "😌 안 매움"}
              </span>}
              <span className="tag">{current.category}</span>
            </div>
          </>
        ) : (
          <>
            <div className="emoji-wrap">{kind === "restaurant" ? "🍽️" : kind === "meal" ? "🍚" : "🍰"}</div>
            <p className="hint">아래 버튼을 눌러 오늘의 {label} 추천을 받아보세요</p>
          </>
        )}
      </div>

      <button
        type="button"
        className={`btn-roll${hasRolled ? " reroll" : ""}`}
        onClick={onRoll}
        disabled={spinning}
      >
        {hasRolled ? "처음부터 다시 뽑기" : `오늘의 ${label} 뽑기!`}
      </button>
    </>
  );
}
