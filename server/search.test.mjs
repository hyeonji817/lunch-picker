import test from 'node:test';
import assert from 'node:assert/strict';
import { searchRestaurants } from './search.mjs';
const params = () => new URLSearchParams({ area: '강남역', menu: '돈까스' });
const credentials = { clientId: 'test-id', clientSecret: 'test-secret' };
const mock = (body, status = 200) => async () => new Response(JSON.stringify(body), { status });

test('invalid input does not call upstream', async () => {
  let called = false;
  for (const input of [{ menu: '돈까스' }, { area: '서울', menu: ' ' }, { area: '서울', menu: 'x'.repeat(81) }]) {
    const result = await searchRestaurants(new URLSearchParams(input), {
      ...credentials, fetcher: () => { called = true; throw new Error('unexpected'); },
    });
    assert.equal(result.status, 400);
  }
  assert.equal(called, false);
});
test('missing credentials return configuration error', async () => {
  assert.equal((await searchRestaurants(params())).status, 503);
});
test('uses Naver authentication and maps results', async () => {
  let requestUrl;
  let requestOptions;
  const result = await searchRestaurants(params(), {
    ...credentials,
    fetcher: async (url, options) => {
      requestUrl = new URL(url);
      requestOptions = options;
      return new Response(JSON.stringify({ items: [
        { title: '<b>돈까스</b> 식당', address: '서울', roadAddress: '서울 강남대로', category: '음식점' },
        { title: '두 번째', address: '지번 주소' },
      ] }));
    },
  });
  assert.equal(result.status, 200);
  assert.equal(requestUrl.origin, 'https://openapi.naver.com');
  assert.equal(requestUrl.searchParams.get('query'), '강남역 돈까스');
  assert.equal(requestUrl.searchParams.get('display'), '5');
  assert.equal(requestUrl.searchParams.get('start'), '1');
  assert.equal(requestUrl.searchParams.get('sort'), 'random');
  assert.equal(requestOptions.headers['X-Naver-Client-Secret'], 'test-secret');
  assert.equal(requestOptions.headers['X-Naver-Client-Id'], 'test-id');
  assert.ok(requestOptions.signal);
  assert.equal(result.body.places[0].name, '돈까스 식당');
  assert.equal(result.body.places[0].address, '서울 강남대로');
  assert.equal(result.body.places[1].address, '지번 주소');
  assert.ok(result.body.places[0].mapUrl.startsWith('https://map.naver.com/p/search/'));
  assert.ok(!JSON.stringify(result.body).includes('test-secret'));
});
test('empty results succeed', async () => {
  const result = await searchRestaurants(params(), { ...credentials, fetcher: mock({ items: [] }) });
  assert.deepEqual(result.body.places, []);
});
test('upstream failures do not expose response bodies', async () => {
  for (const status of [401, 403, 429, 500]) {
    const result = await searchRestaurants(params(), { ...credentials, fetcher: mock({ error: 'sensitive' }, status) });
    assert.equal(result.status, status === 429 ? 429 : 502);
    assert.ok(!JSON.stringify(result.body).includes('sensitive'));
  }
});
test('invalid payload and network errors return 502', async () => {
  for (const fetcher of [mock({ unexpected: [] }), async () => { throw new Error('network'); }]) {
    assert.equal((await searchRestaurants(params(), { ...credentials, fetcher })).status, 502);
  }
});
test('timeout returns 504', async () => {
  const fetcher = async () => { throw new DOMException('timeout', 'TimeoutError'); };
  assert.equal((await searchRestaurants(params(), { ...credentials, fetcher })).status, 504);
});
