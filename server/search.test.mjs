import test from 'node:test';
import assert from 'node:assert/strict';
import { searchRestaurants } from './search.mjs';
import { createApp } from './index.mjs';

const params = () => new URLSearchParams({area:'신림역',menu:'우동'});
const mock = (data, status=200) => async () => new Response(JSON.stringify(data), {status});

test('missing key and invalid input are actionable', async()=>{
 assert.equal((await searchRestaurants(params())).status,503);
 assert.equal((await searchRestaurants(new URLSearchParams({menu:'우동'}))).status,400);
});

test('Kakao authorization, restaurant filter, coordinates and safe links',async()=>{
 const result=await searchRestaurants(params(),{apiKey:'secret',fetcher:async(url,init)=>{
  const u=new URL(url);assert.equal(u.hostname,'dapi.kakao.com');assert.equal(u.searchParams.get('query'),'신림역 우동');assert.equal(u.searchParams.get('category_group_code'),'FD6');assert.equal(init.headers.Authorization,'KakaoAK secret');
  return new Response(JSON.stringify({documents:[{id:'123',place_name:'우동집',category_name:'음식점',road_address_name:'서울 관악구',x:'126.93',y:'37.48',phone:'02-000-0000'}]}));
 }});
 assert.equal(result.status,200);assert.equal(result.body.places[0].lat,37.48);assert.equal(result.body.places[0].lng,126.93);assert.equal(result.body.places[0].mapUrl,'https://place.map.kakao.com/123');
});

test('empty results',async()=>assert.deepEqual((await searchRestaurants(params(),{apiKey:'key',fetcher:mock({documents:[]})})).body.places,[]));

test('authentication and quota errors do not expose upstream secrets',async()=>{
 for(const status of [401,403,429,500]) { const r=await searchRestaurants(params(),{apiKey:'key',fetcher:mock({error:'secret'},status)});assert.equal(r.status,status===429?429:502);assert.ok(!r.body.error.includes('secret')); }
});

test('timeout and invalid response',async()=>{
 assert.equal((await searchRestaurants(params(),{apiKey:'key',fetcher:mock({})})).status,502);
 assert.equal((await searchRestaurants(params(),{apiKey:'key',fetcher:async()=>{throw Object.assign(new Error(),{name:'TimeoutError'});}})).status,504);
});

test('HTTP route and frontend response contract',async(t)=>{
 const app=createApp({apiKey:'key',fetcher:mock({documents:[]})});await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>app.close(resolve)));
 const base=`http://127.0.0.1:${app.address().port}`;
 const response=await fetch(`${base}/api/restaurants?${params()}`);assert.equal(response.status,200);assert.deepEqual((await response.json()).places,[]);
 assert.equal((await fetch(`${base}/api/search`)).status,404);
});
