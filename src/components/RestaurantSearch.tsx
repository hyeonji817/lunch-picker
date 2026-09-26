import { useEffect, useRef, useState, type FormEvent } from "react";
import "./RestaurantSearch.css";
import KakaoMap from "./KakaoMap";

interface Place { 
  id: string; 
  name: string; 
  category: string; 
  address: string; 
  mapUrl: string; 
  lat: number; 
  lng: number; 
  phone: string
}

export default function RestaurantSearch({ menuName, kind }: { menuName: string | null; kind: "meal" | "dessert" }) {
  const [area, setArea] = useState("");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    sequence.current++;
    controller.current?.abort();
    setPlaces(null); setError(""); setLoading(false);
    return () => { sequence.current++; controller.current?.abort(); };
  }, [menuName]);

  if (!menuName) return null;

  async function search(event: FormEvent) {
    event.preventDefault();

    if (!area.trim() || !menuName) return;

    controller.current?.abort();
    const abort = new AbortController(); controller.current = abort;
    const request = ++sequence.current;
    setLoading(true); setError(""); setPlaces(null);

    try {
      const params = new URLSearchParams({ area: area.trim(), menu: menuName, kind });
      const response = await fetch(`${(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")}/api/restaurants?${params}`, {
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(12000)]),
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('검색 서버에 연결하지 못했어요. API 서버 실행과 /api 프록시 설정을 확인해주세요.');
      }

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || `음식점 검색 실패 (${response.status})`);
      if (!Array.isArray(data.places)) throw new Error('검색 응답 형식이 맞지 않아요. 프런트와 서버 버전을 확인해주세요.');
      if (request === sequence.current) setPlaces(data.places);

    } catch (err) {
      if (request !== sequence.current || abort.signal.aborted) return;
      setError(err instanceof Error && err.name === 'TimeoutError'
        ? '검색 응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.'
        : err instanceof TypeError ? '검색 서버에 연결하지 못했어요. 네트워크와 API 서버를 확인해주세요.'
        : err instanceof Error ? err.message : '검색하지 못했어요. 다시 시도해주세요.');
    } finally {
       if (request === sequence.current) setLoading(false);
    }
  }

  return <section className="restaurant-search" aria-label="음식점 검색">
    <form onSubmit={search}>
      <label htmlFor="restaurant-area">어느 동네에서 드실 건가요?</label>
      <input id="restaurant-area" className="restaurant-area" required maxLength={100} value={area}
        onChange={e => { sequence.current++; controller.current?.abort(); setLoading(false); setArea(e.target.value); setPlaces(null); setError(''); }} placeholder="예: 강남역, 성수동" />
      <button type="submit" className="action-btn map" disabled={loading || !area.trim()}>
        {loading ? '찾는 중…' : `📍 ${menuName} 맛집 찾기`}
      </button>
    </form>

    {error && <p className="empty-note" role="alert">{error}</p>}
    <div role="status">{places && <p className="empty-note">{places.length ? `카카오 검색 결과 ${places.length}곳` : '검색 결과가 없어요. 다른 동네 이름으로 검색해보세요.'}</p>}</div>
    {places && places.length > 0 && <KakaoMap places={places}/>}
    {places && places.length > 0 && <ul className="restaurant-list">{places.map(place => <li key={place.id} className="restaurant-item">
      <div className="restaurant-name">{place.name}</div>
      <div className="restaurant-category">{place.category}</div>
      <div className="restaurant-address">{place.address}</div>
      {place.phone && <div className="restaurant-address">{place.phone}</div>}
      <a className="restaurant-link" href={place.mapUrl} target="_blank" rel="noreferrer">카카오 지도에서 보기 →</a>
    </li>)}
    </ul>
    }
    <a className="restaurant-link" href={`https://map.kakao.com/link/search/${encodeURIComponent(`${area.trim()} ${menuName}`.trim())}`} target="_blank" rel="noreferrer">
      카카오 지도에서 직접 검색 →
    </a>
  </section>;
}

