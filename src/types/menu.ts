export type Category =
  | "전체"
  | "한식"
  | "일식"
  | "양식"
  | "중식"
  | "분식"
  | "기타";

export type MenuCategory = Exclude<Category, "전체">;

export type Menu = {
  id: number; 
  name: string; 
  category: MenuCategory; 
};

export const categories: Category[] = [
  "전체",
  "한식",
  "일식",
  "양식",
  "중식",
  "분식",
  "기타",
];
