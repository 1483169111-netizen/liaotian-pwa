// 缓存名称（版本号，更新时修改）
const CACHE_NAME = 'chat-app-v1.0';
// 需要缓存的核心资源
const CACHE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './icon.png',
  './manifest.json',
  './wechat-guide.html'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting()) // 立即激活新SW
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // 接管所有客户端
  );
});

// 请求拦截：优先使用缓存，无缓存则请求网络
self.addEventListener('fetch', (event) => {
  // 忽略跨域请求（如API），仅缓存本地资源
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // 缓存有则返回，无则请求网络并缓存
          return cachedResponse || fetch(event.request).then(networkResponse => {
            // 仅缓存成功的响应
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          });
        })
    );
  }
});
