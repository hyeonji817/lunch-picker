export async function searchRestaurants(params, { apiKey, fetcher = fetch } = {}) {
  const menu = (params.get('menu') || '').trim();
  const area = (params.get('area') || '').trim();
  const fail = (status, error) => ({ status, body: { error } });

  if (!menu || !area || menu.length > 80 || area.length > 100) return fail(400, '지역과 메뉴를 입력해주세요.');
  if (!apiKey || apiKey === 'your_rest_api_key') return fail(503, '서버의 KAKAO_REST_API_KEY 설정이 필요합니다. .env 저장 후 API 서버를 재시작해주세요.');

  const query = `${area} ${menu}`;
  const searchParams = new URLSearchParams({ query, size: '15' });

  // 디저트는 카페와 제과점도 검색할 수 있도록 음식점 제한을 적용하지 않습니다.
  if (params.get('kind') !== 'dessert') searchParams.set('category_group_code', 'FD6');

  try {
    const response = await fetcher(`https://dapi.kakao.com/v2/local/search/keyword.json?${searchParams}`, {
      headers: { Authorization: `KakaoAK ${apiKey}` }, signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return fail(502, '카카오 인증에 실패했어요. REST API 키와 카카오맵 사용 설정을 확인해주세요.');
      if (response.status === 429) return fail(429, '카카오 API 사용 한도에 도달했어요. 잠시 후 다시 시도해주세요.');
      return fail(502, '카카오 검색 서버가 응답하지 않아요. 잠시 후 다시 시도해주세요.');
    }

    const data = await response.json();

    if (!Array.isArray(data.documents)) return fail(502, '카카오 검색 응답 형식이 올바르지 않습니다.');

    const places = data.documents.map(p => ({
      id: String(p.id), name: p.place_name, category: p.category_name,
      address: p.road_address_name || p.address_name, phone: p.phone,
      lat: Number(p.y), lng: Number(p.x),
      mapUrl: `https://place.map.kakao.com/${encodeURIComponent(p.id)}`,
    }));
    
    return { status: 200, body: { query, places } };
  } catch (error) {
    return fail(error.name === 'TimeoutError' ? 504 : 502, error.name === 'TimeoutError'
      ? '검색 시간이 초과됐어요. 다시 시도해주세요.' : '카카오 검색에 연결하지 못했어요. 서버 네트워크를 확인해주세요.');
  }
}
