import { createServer } from 'node:http';
import { searchRestaurants } from './search.mjs';

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (req.method !== 'GET' || url.pathname !== '/api/restaurants') {
      res.writeHead(404).end(JSON.stringify({ error: '요청한 API가 없습니다.' }));
      return;
    }
    const result = await searchRestaurants(url.searchParams, {
      clientId: process.env.NAVER_CLIENT_ID, clientSecret: process.env.NAVER_CLIENT_SECRET,
    });
    res.writeHead(result.status).end(JSON.stringify(result.body));
  } catch {
    res.writeHead(500).end(JSON.stringify({ error: '서버에서 오류가 발생했습니다.' }));
  }
}).listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () => {
  console.log('Restaurant API ready on port ' + (process.env.PORT || 3001));
});
