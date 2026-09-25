import { searchRestaurants } from '../server/search.mjs';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET 요청만 지원합니다.' });
  try {
    const url = new URL(req.url, 'http://localhost');
    const result = await searchRestaurants(url.searchParams, { apiKey: process.env.KAKAO_REST_API_KEY });
    return res.status(result.status).json(result.body);
  } catch { return res.status(500).json({ error: '검색 서버 처리에 실패했습니다.' }); }
}
