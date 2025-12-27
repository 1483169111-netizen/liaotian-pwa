// 缓存名称
const CACHE_NAME = 'chat-assistant-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  './wechat-guide.html',
  './icon-192.png',
  './icon-512.png'
];

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('正在缓存应用文件...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('所有文件缓存完成');
        return self.skipWaiting();
      })
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker 激活');
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  // 只处理同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，返回缓存
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request)
          .then(response => {
            // 检查是否有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应（因为响应只能使用一次）
            const responseToCache = response.clone();
            
            // 将新资源加入缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，可以返回自定义离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// 后台同步（如果需要）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    console.log('后台同步开始...');
    event.waitUntil(syncData());
  }
});

// 推送通知（如果需要）
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '恋爱聊天助手有新消息',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('恋爱聊天助手', options)
  );
});

// 同步数据函数
function syncData() {
  // 这里可以添加数据同步逻辑
  return Promise.resolve();
}