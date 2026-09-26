import { useMemo, useState } from "react";
import { filterRestaurantTypes, occasions, restaurantCategories } from "../data/restaurantTypes";
import type { Occasion, RestaurantCategory } from "../data/restaurantTypes";
import { useMenuPicker } from "../hooks/useMenuPicker";
import RandomResult from "./RandomResult";
import RestaurantSearch from "./RestaurantSearch";

export default function RestaurantPicker() {
  const [category, setCategory] = useState<RestaurantCategory | "전체">("전체");
  const [occasion, setOccasion] = useState<Occasion | "전체">("전체");
  const menus = useMemo(() => filterRestaurantTypes(category, occasion), [category, occasion]);
  const { current, spinning, roll, poolSize } = useMenuPicker(menus);

  return <>
    <fieldset className="restaurant-options">
      <legend>레스토랑 종류</legend>
      <div className="filters">
        {(["전체", ...restaurantCategories] as const).map(value => <button
          key={value} type="button" className={`chip${category === value ? " active" : ""}`}
          aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
      </div>
      <p className="restaurant-options-label">어떤 자리인가요?</p>
      <div className="filters">
        {(["전체", ...occasions] as const).map(value => <button
          key={value} type="button" className={`chip${occasion === value ? " active" : ""}`}
          aria-pressed={occasion === value} onClick={() => setOccasion(value)}>{value}</button>)}
      </div>
      <p className="restaurant-options-note">메뉴 대신 갈 곳의 종류를 추천해요. 모임 옵션은 유형 추천에만 반영돼요.</p>
    </fieldset>
    <RandomResult kind="restaurant" current={current} spinning={spinning}
      hasRolled={current !== null} poolSize={poolSize} onRoll={roll} />
    {current && !spinning && <RestaurantSearch kind="meal" menuName={current.name} />}
  </>;
}
