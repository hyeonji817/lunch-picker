export type PickerKind = "meal" | "dessert";
export type Category = "케이크" | "베이커리" | "아이스크림" | "빙수" | "쿠키·마카롱" | "음료" |
 "한식" | "중식" | "일식" | "양식" | "분식" | "건강식" | "기타";

export interface Menu {
  id: string;
  name: string;
  category: Category;
  kcal: number;
  spicy: boolean;
  light: boolean;
  emoji: string;
  desc: string;
}