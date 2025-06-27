import { createMiddleware } from 'hono/factory';

export const cacheControlMiddleware = createMiddleware(async (c, next) => {
  await next();

  // 画像アセットの場合は長期間キャッシュ
  const isImageAsset = c.req.path.startsWith('/images/') || c.res.headers.get('Content-Type')?.startsWith('image/');

  if (isImageAsset) {
    // 画像は1年間キャッシュ（immutable content）
    c.res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    // その他のコンテンツは従来通りキャッシュ無効
    c.res.headers.append('Cache-Control', 'private');
    c.res.headers.append('Cache-Control', 'no-store');
  }
});
