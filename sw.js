let CACHE_NAME = 'static-caches';

self.addEventListener('install', (event) => {
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>{
      return cache.addAll([
          '.',
          'index.html',
          'css/main.css',
          'css/uikit.min.css',
          'js/uikit.min.js',
          'js/uikit-icons.min.js',
          'images/pp.jpeg',
          'images/pb.png',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
          'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
          'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
          'https://stackpath.bootstrapcdn.com/bootswatch/4.1.2/cerulean/bootstrap.min.css'
        ]);
    })
  );

});



self.addEventListener('activate', (event) =>{
  event.waitUntil(
    caches.keys().then((cacheNames) =>{
      return Promise.all(
        cacheNames.filter((cacheName) =>{
          return cacheName.startsWith('static-') && cacheName != CACHE_NAME;
        }).map((cacheName) =>{
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // console.log(event.request);
  let requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then((response) =>{
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then((response) =>{
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(CACHE_NAME)
    .then((cache) =>{
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch((error) =>{
    console.log('Request failed:', error);
    // You could return a custom offline 404 page here

  });
}

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
