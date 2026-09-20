import { createServer } from 'node:http';
import { searchRestaurants } from './search.mjs';

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const url = new URL(req.url, 'http://localhost');
  if (req.method !== 'GET' || url.pathname !== '/api/restaurants') {
    res.writeHead(404).end(JSON.stringify({ error: '요청한 API가 없습니다.' }));
    return;
  }
  const result = await searchRestaurants(url.searchParams, { apiKey: process.env.KAKAO_REST_API_KEY });
  res.writeHead(result.status).end(JSON.stringify(result.body));
}).listen(Number(process.env.PORT || 3001), '127.0.0.1', () => {
  console.log('Restaurant API ready on localhost');
});