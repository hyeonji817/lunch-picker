import type { Menu } from "../types/menu";

type RandomResultProps = {
  pickedMenu: Menu | null; 
  isPicking: boolean; 
  message: string;
};

function RandomResult({ pickedMenu, isPicking, message }: RandomResultProps) {
  return (
    <div className={`resultBox ${isPicking ? "shuffling" : ""}`}>
      <span>{message}</span>
      <strong>{pickedMenu ? pickedMenu.name : "?"}</strong>
      <small>{pickedMenu ? pickedMenu.category : "추천 대기 중"}</small>
    </div>
  );
}

export default RandomResult;