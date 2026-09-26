import { useEffect, useRef, useState } from 'react';

export type MapPlace = { id: string; name: string; lat: number; lng: number };

type MapObject = { setBounds(bounds: unknown): void; relayout(): void };

type Maps = {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => unknown;
  LatLngBounds: new () => { extend(point: unknown): void };
  Map: new (element: HTMLElement, options: object) => MapObject;
  Marker: new (options: object) => { setMap(map: null): void };
};

declare global { interface Window { kakao?: { maps: Maps } } }

let sdkPromise: Promise<Maps> | undefined;

function loadKakao(key: string): Promise<Maps> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let finished = false;

    const fail = () => {
      if (finished) return;
      finished = true; clearTimeout(timer); script.remove(); sdkPromise = undefined;
      reject(new Error('지도를 불러오지 못했어요. JavaScript 키, 등록 도메인, 카카오맵 사용 설정을 확인해주세요.'));
    };

    const timer = window.setTimeout(fail, 15000);
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`;
    script.async = true;
    script.onerror = fail;
    script.onload = () => {
      const maps = window.kakao?.maps;
      if (!maps) { fail(); return; }
      maps.load(() => { if (finished) return; finished = true; clearTimeout(timer); resolve(maps); });
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export default function KakaoMap({ places }: { places: MapPlace[] }) {
  const element = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

  useEffect(() => {
    if (!key) return;
    let active = true;
    const markers: { setMap(map: null): void }[] = [];
    let observer: ResizeObserver | undefined;
    const container = element.current;
    setError('');

    loadKakao(key).then(maps => {
      if (!active || !container) return;
      const valid = places.filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180);
      const map = new maps.Map(container, { center: new maps.LatLng(valid[0]?.lat ?? 37.5665, valid[0]?.lng ?? 126.978), level: 4 });
      const bounds = new maps.LatLngBounds();
      valid.forEach(place => {
        const position = new maps.LatLng(place.lat, place.lng);
        markers.push(new maps.Marker({ map, position, title: place.name })); bounds.extend(position);
      });

      if (valid.length > 1) map.setBounds(bounds);
      observer = new ResizeObserver(() => { map.relayout(); if (valid.length > 1) map.setBounds(bounds); });
      observer.observe(container);
    }).catch(e => { if (active) setError(e.message); });

    return () => { active = false; observer?.disconnect(); markers.forEach(m => m.setMap(null)); container?.replaceChildren(); };
  }, [key, places]);
  
  return <div className="kakao-map-panel">
    <div ref={element} className="kakao-map" aria-label="검색된 음식점 카카오 지도" hidden={!key || !!error} />
    {(!key || error) && <p className="empty-note" role="status">{error || '지도 표시에는 VITE_KAKAO_JAVASCRIPT_KEY 설정이 필요해요. 아래 목록의 카카오맵 링크는 이용할 수 있어요.'}</p>}
  </div>;
}
