import { useState } from "react";
import "./RestaurantSearch.css";

interface RestaurantItem {
  title: string;
  category?: string;
  address?: string;
  roadAddress?: string;
  link?: string;
}

interface Props {
  menuName: string | null;
}

// 서버(server/search.mjs)가 네이버 지역 검색 API를 프록시한다고 가정하고 작성했어요.
// 실제 엔드포인트/응답 필드명이 다르면 아래 fetchRestaurants만 맞춰서 고치면 됩니다.
async function fetchRestaurants(query: string): Promise<RestaurantItem[]> {
  const res = await fetch(`/api/search?query=${encodeURIComponent(query + " 맛집")}`);
  if (!res.ok) throw new Error("검색에 실패했어요");
  const data = await res.json();
  return data.items ?? [];
}

export default function RestaurantSearch({ menuName }: Props) {
  const [items, setItems] = useState<RestaurantItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!menuName) return null;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRestaurants(menuName);
      setItems(result);
    } catch {
      setError("검색 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const stripTags = (s: string) => s.replace(/<[^>]*>/g, "");

  return (
    <div className="restaurant-search">
      <button type="button" className="action-btn map" onClick={handleSearch} disabled={loading}>
        {loading ? "찾는 중..." : `📍 ${menuName} 맛집 찾기`}
      </button>

      {error && <p className="empty-note">{error}</p>}

      {items && items.length === 0 && !loading && (
        <p className="empty-note">근처에서 결과를 찾지 못했어요.</p>
      )}

      {items && items.length > 0 && (
        <ul className="restaurant-list">
          {items.slice(0, 5).map((item, i) => (
            <li key={i} className="restaurant-item">
              <div className="restaurant-name">{stripTags(item.title)}</div>
              {item.category && <div className="restaurant-category">{item.category}</div>}
              {(item.roadAddress || item.address) && (
                <div className="restaurant-address">{item.roadAddress || item.address}</div>
              )}
              <a
                className="restaurant-link"
                href={
                  item.link ||
                  `https://map.naver.com/p/search/${encodeURIComponent(stripTags(item.title))}`
                }
                target="_blank"
                rel="noreferrer"
              >
                네이버 지도에서 보기 →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
