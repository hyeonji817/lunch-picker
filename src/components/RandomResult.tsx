import type { Menu } from "../types/menu";

interface Props {
  current: Menu | null;
  spinning: boolean;
  hasRolled: boolean;
  poolSize: number;
  onRoll: () => void;
}

export default function RandomResult({ current, spinning, hasRolled, poolSize, onRoll }: Props) {
  if (poolSize === 0) {
    return (
      <div className="stage">
        <p className="empty-note">
          조건에 맞는 메뉴가 없어요.
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
              <span className="tag">{current.kcal}kcal</span>
              <span className={`tag${current.spicy ? " spicy" : ""}`}>
                {current.spicy ? "🌶️ 매콤" : "😌 안 매움"}
              </span>
              <span className="tag">{current.category}</span>
            </div>
          </>
        ) : (
          <>
            <div className="emoji-wrap">🍚</div>
            <p className="hint">아래 버튼을 눌러 오늘의 점심을 뽑아보세요</p>
          </>
        )}
      </div>

      <button
        type="button"
        className={`btn-roll${hasRolled ? " reroll" : ""}`}
        onClick={onRoll}
        disabled={spinning}
      >
        {hasRolled ? "처음부터 다시 뽑기" : "오늘의 점심 뽑기!"}
      </button>
    </>
  );
}
