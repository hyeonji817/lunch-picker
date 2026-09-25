export type Category = "한식" | "중식" | "일식" | "양식" | "분식" | "건강식" | "기타";

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