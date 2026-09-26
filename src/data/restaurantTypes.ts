import type { Menu } from "../types/menu";

export const restaurantCategories = ["스테이크집", "파스타 전문점", "씨푸드 뷔페", "패밀리 레스토랑"] as const;
export const occasions = ["혼밥", "데이트", "가족 외식"] as const;
export type RestaurantCategory = typeof restaurantCategories[number];
export type Occasion = typeof occasions[number];
export interface RestaurantType extends Menu {
  restaurantCategory: RestaurantCategory;
  occasions: Occasion[];
}

export const restaurantTypes: RestaurantType[] = [
  { id: "steakhouse", name: "스테이크집", restaurantCategory: "스테이크집", emoji: "🥩", desc: "맛있게 구운 스테이크로 즐기는 특별한 식사", occasions: ["데이트", "가족 외식"] },
  { id: "pasta-place", name: "파스타 전문점", restaurantCategory: "파스타 전문점", emoji: "🍝", desc: "좋아하는 소스의 파스타로 채우는 한 끼", occasions: ["혼밥", "데이트", "가족 외식"] },
  { id: "seafood-buffet", name: "씨푸드 뷔페", restaurantCategory: "씨푸드 뷔페", emoji: "🦐", desc: "다양한 해산물을 취향대로 골라 즐겨요", occasions: ["데이트", "가족 외식"] },
  { id: "family-restaurant", name: "패밀리 레스토랑", restaurantCategory: "패밀리 레스토랑", emoji: "🍽️", desc: "여럿이 함께 다양한 메뉴를 나누기 좋은 선택", occasions: ["데이트", "가족 외식"] },
].map(item => ({ ...item, category: "레스토랑", kcal: 0, spicy: false, light: false })) as RestaurantType[];

export function filterRestaurantTypes(category: RestaurantCategory | "전체", occasion: Occasion | "전체") {
  return restaurantTypes.filter(item =>
    (category === "전체" || item.restaurantCategory === category) &&
    (occasion === "전체" || item.occasions.includes(occasion))
  );
}
