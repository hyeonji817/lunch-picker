export default function Hero({ kind }: { kind: "meal" | "dessert" }) {
  return (
    <h1 className="hero">
      {kind === "meal" ? "오늘 식사 뭐 먹지?" : "오늘 디저트 뭐 먹지?"}
      <br />
      <span>버튼 한 번</span>이면 끝!
    </h1>
  );
}
