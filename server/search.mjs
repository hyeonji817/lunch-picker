export async function searchRestaurants(params, { apiKey, fetcher = fetch } = {}) {
  const menu = (params.get('menu') || '').trim();
  const area = (params.get('area') || '').trim();
  const hasCoordinates = params.has('lat') || params.has('lng');
  const lat = Number(params.get('lat'));
  const lng = Number(params.get('lng'));
  if (!menu || menu.length > 80 || area.length > 100 ||
      (hasCoordinates && (!params.get('lat') || !params.get('lng') || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)) ||
      (!hasCoordinates && !area)) {
    return { status: 400, body: { error: '메뉴와 현재 위치 또는 동네 이름을 확인해주세요.' } };
  }
  if (!apiKey || apiKey === 'your_rest_api_key') {
    return { status: 503, body: { error: '서버의 KAKAO_REST_API_KEY 설정이 필요합니다.' } };
  }
  const query = new URLSearchParams({ query: hasCoordinates ? menu : `${area} ${menu}`, category_group_code: 'FD6', size: '15' });
  if (hasCoordinates) {
    query.set('x', String(lng));
    query.set('y', String(lat));
    query.set('radius', '2000');
    query.set('sort', 'distance');
  }
  try {
    const response = await fetcher(`https://dapi.kakao.com/v2/local/search/keyword.json?${query}`, {
      headers: { Authorization: `KakaoAK ${apiKey}` }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { status: 502, body: { error: response.status === 429 ? '검색 요청이 많습니다. 잠시 후 다시 시도해주세요.' : '음식점 검색에 실패했습니다. 서버의 카카오 키와 API 이용 설정을 확인해주세요.' } };
    const data = await response.json();
    return { status: 200, body: { places: data.documents.map(place => ({
      id: place.id, name: place.place_name, address: place.road_address_name || place.address_name,
      phone: place.phone, distance: place.distance, url: `https://place.map.kakao.com/${encodeURIComponent(place.id)}`,
    })) } };
  } catch {
    return { status: 502, body: { error: '검색 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' } };
  }
}