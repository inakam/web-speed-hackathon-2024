/// <reference types="@types/serviceworker" />

import { transformJpegXLToBmp } from './transformJpegXLToBmp';

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  ev.respondWith(onFetch(ev.request));
});

async function onFetch(request: Request): Promise<Response> {
  const res = await fetch(request);

  if (res.headers.get('Content-Type') === 'image/jxl') {
    // If the response is a JPEG XL image, transform it to BMP format.
    // JPEG XL は Chrome ではサポートされていないため、BMP に変換して返す。
    // wasm が使われているため、Viteに移行しようとするとこの処理がネックになる
    return transformJpegXLToBmp(res);
  } else {
    return res;
  }
}
