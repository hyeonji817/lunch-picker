import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { searchRestaurants } from './search.mjs';

export function createApp({ apiKey = process.env.KAKAO_REST_API_KEY, fetcher = fetch } = {}) {
  const requests = new Map();

  return createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    try {
      const url = new URL(req.url || '/', 'http://localhost');
      if (req.method !== 'GET' || url.pathname !== '/api/restaurants') {
        res.writeHead(404).end(JSON.stringify({ error: '요청한 API가 없습니다.' })); return;
      }
      const now = Date.now();
      for (const [key, value] of requests) if (value.until <= now) requests.delete(key);
      const key = req.socket.remoteAddress;
      const limit = requests.get(key) || { count: 0, until: now + 60000 };
      requests.set(key, limit);
      if (++limit.count > 30) { res.writeHead(429).end(JSON.stringify({error:'검색 요청이 많아요. 잠시 후 다시 시도해주세요.'})); return; }
      const result = await searchRestaurants(url.searchParams, { apiKey, fetcher });
      res.writeHead(result.status).end(JSON.stringify(result.body));
    } catch { res.writeHead(500).end(JSON.stringify({ error: '검색 서버에서 오류가 발생했습니다.' })); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(Number(process.env.LOCAL_API_PORT || 3007), process.env.HOST || '127.0.0.1', () => console.log('Kakao Restaurant API ready'));
}

