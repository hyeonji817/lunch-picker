import { useEffect, useRef, useState, type FormEvent } from 'react';
import './RestaurantSearch.css';

type Place = { id: string; name: string; address: string; category: string; mapUrl: string };
type SearchResponse = { query?: string; places?: Place[]; error?: string };

export default function RestaurantSearch() {
  const [area, setArea] = useState('');
  const [menu, setMenu] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedQuery, setCompletedQuery] = useState('');
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => () => activeRequest.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedArea = area.trim();
    const trimmedMenu = menu.trim();
    if (!trimmedArea || !trimmedMenu) {
      setError('지역과 메뉴를 모두 입력해주세요.');
      return;
    }
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError('');
    setCompletedQuery('');
    setPlaces([]);
    try {
      const params = new URLSearchParams({ area: trimmedArea, menu: trimmedMenu });
      const response = await fetch(`/api/restaurants?${params}`, {
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]),
      });
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('검색 API에 연결할 수 없습니다. API 서버 실행 상태를 확인해주세요.');
      }
      const data: SearchResponse = await response.json();
      if (!response.ok) throw new Error(data.error || '음식점 검색에 실패했습니다.');
      if (!Array.isArray(data.places)) throw new Error('검색 응답 형식이 올바르지 않습니다.');
      if (activeRequest.current !== controller) return;
      setPlaces(data.places);
      setCompletedQuery(data.query || `${trimmedArea} ${trimmedMenu}`);
    } catch (error) {
      if (controller.signal.aborted || activeRequest.current !== controller) return;
      setError(error instanceof Error && error.name === 'TimeoutError'
        ? '검색 시간이 초과되었습니다. 다시 시도해주세요.'
        : error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }

  return (
    <section className="restaurantSearch" aria-labelledby="restaurant-title">
      <h2 id="restaurant-title">먹고 싶은 메뉴로 음식점 찾기</h2>
      <p>지역과 메뉴를 입력하면 네이버 지역 검색 결과를 보여드려요.</p>
      <form onSubmit={handleSubmit} className="restaurantSearchForm">
        <label>지역
          <input value={area} onChange={(event) => setArea(event.target.value)}
            placeholder="예: 강남역, 성수동" maxLength={100} required />
        </label>
        <label>메뉴
          <input value={menu} onChange={(event) => setMenu(event.target.value)}
            placeholder="예: 돈까스" maxLength={80} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? '검색 중…' : '음식점 검색'}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <div aria-live="polite" aria-busy={loading}>
        {loading && <p>음식점을 검색하고 있어요.</p>}
        {completedQuery && <p>“{completedQuery}” 검색 결과 {places.length}개
          {places.length === 0 && ' — 지역이나 메뉴를 바꿔보세요.'}</p>}
        <ul className="restaurantResults">
          {places.map((place) => (
            <li key={place.id}>
              <h3>{place.name}</h3><p>{place.category}</p>
              <p>{place.address || '주소 정보 없음'}</p>
              <a href={place.mapUrl} target="_blank" rel="noopener noreferrer">네이버 지도에서 검색</a>
            </li>
          ))}
        </ul>
      </div>
      <small>네이버 지역 검색 결과는 최대 5개까지 표시됩니다.</small>
    </section>
  );
}
