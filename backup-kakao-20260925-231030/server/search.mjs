export async function searchRestaurants(params, { clientId, clientSecret, fetcher = fetch } = {}) {
  const menu = (params.get('menu') || '').trim();
  const area = (params.get('area') || '').trim();
  if (!menu || !area || menu.length > 80 || area.length > 100) {
    return { status: 400, body: { error: '지역과 메뉴를 올바르게 입력해주세요.' } };
  }
  if (!clientId || !clientSecret) {
    return { status: 503, body: { error: '서버의 .env에 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해주세요.' } };
  }
  const query = `${area} ${menu}`;
  const searchParams = new URLSearchParams({ query, display: '5', start: '1', sort: 'random', format: 'json' });
  try {
    const response = await fetcher(`https://naverapihub.apigw.ntruss.com/search/v1/local?${searchParams}`, {
      headers: { 'X-NCP-APIGW-API-KEY-ID': clientId, 'X-NCP-APIGW-API-KEY': clientSecret },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return { status: response.status === 429 ? 429 : 502, body: { error: response.status === 429
        ? '검색 요청이 너무 많거나 이용 한도에 도달했습니다. 잠시 후 다시 시도하거나 콘솔의 한도를 확인해주세요.'
        : '네이버 검색에 실패했습니다. 서버 인증 정보와 검색 API 설정을 확인해주세요.' } };
    }
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Invalid response');
    const places = data.items.slice(0, 5).map((item, index) => {
      const name = String(item.title || '').replace(/<[^>]*>/g, '');
      const address = String(item.roadAddress || item.address || '');
      return {
        id: `${index}-${name}-${address}`, name, address, category: String(item.category || ''),
        mapUrl: `https://map.naver.com/p/search/${encodeURIComponent(`${address} ${name}`)}`,
      };
    });
    return { status: 200, body: { query, places } };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return { status: timedOut ? 504 : 502, body: { error: timedOut
      ? '검색 응답이 지연되고 있습니다. 다시 시도해주세요.'
      : '검색 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' } };
  }
}

