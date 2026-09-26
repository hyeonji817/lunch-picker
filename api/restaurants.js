import { searchRestaurants } from '../server/search.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  const allowedOrigins = new Set([
    'https://localhost',
    'http://localhost',
    'http://localhost:5173',
    'https://lunch-picker-zeta.vercel.app',
  ]);
  const origin = req.headers?.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    return res.status(origin && allowedOrigins.has(origin) ? 204 : 403).end();
  }

  if (req.method !== 'GET') return res.status(405).json({ error: 'GET 요청만 지원합니다.' });
  
  try {
    const url = new URL(req.url, 'http://localhost');
    const result = await searchRestaurants(url.searchParams, { apiKey: process.env.KAKAO_REST_API_KEY });
    return res.status(result.status).json(result.body);
  } catch {
    return res.status(500).json({ error: '검색 서버 처리에 실패했습니다.' }); 
  }
}
