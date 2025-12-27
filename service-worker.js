// 缓存名称
const CACHE_NAME = 'chat-assistant-v1.0';

// 要缓存的文件列表 - 只缓存实际存在的文件
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  './wechat-guide.html',
  './icon.png'  // ✅ 改为你实际的文件名 icon.png
];

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('正在缓存应用文件...');
        // 使用 addAll 但捕获可能的失败
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('部分文件缓存失败，但继续安装:', err);
        });
      })
      .then(() => {
        console.log('Service Worker 安装完成');
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
      console.log('Service Worker 激活完成，已控制所有客户端');
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
  
  // 跳过 Service Worker 自身的请求
  if (event.request.url.includes('/service-worker.js')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，返回缓存
        if (response) {
          console.log('从缓存返回:', event.request.url);
          return response;
        }
        
        // 否则从网络获取
        console.log('从网络获取:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // 检查是否有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应（因为响应只能使用一次）
            const responseToCache = response.clone();
            
            // 将新资源加入缓存（不阻塞响应）
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('已缓存新资源:', event.request.url);
              })
              .catch(err => {
                console.warn('缓存失败:', err);
              });
            
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，返回离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            // 对于其他请求，返回默认响应
            return new Response('网络不可用，请检查连接', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
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

// 推送通知（如果需要） - 使用实际存在的图标
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '恋爱聊天助手有新消息',
    icon: './icon.png',  // ✅ 改为 icon.png
    badge: './icon.png', // ✅ 改为 icon.png
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'open', title: '打开应用' },
      { action: 'close', title: '关闭' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('恋爱聊天助手', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 同步数据函数
function syncData() {
  // 这里可以添加数据同步逻辑
  return Promise.resolve('数据同步完成');
}

// 处理消息
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
