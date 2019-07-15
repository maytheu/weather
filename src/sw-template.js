if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
  ); /* global workbox */

  if (workbox) {
    workbox.core.skipWaiting();
    console.log("Workbox is loaded");

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    workbox.routing.registerNavigationRoute(
      // Assuming '/single-page-app.html' has been precached,
      // look up its corresponding cache key.
      workbox.precaching.getCacheKeyForURL("/index.html")
    );

    workbox.routing.registerRoute(
      new RegExp(".css$"),
      workbox.strategies.cacheFirst({
        cacheName: "stylesheets",
        plugins: [
          new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
            maxEntries: 20, // only cache 20 request
            purgeOnQuotaError: true
          })
        ]
      })
    );

    workbox.routing.registerRoute(
      new RegExp("https://api.openweathermap.org/data/2.5/weather"),
      workbox.strategies.staleWhileRevalidate({
        cacheName: "forecast",
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60 //cache the news content for 30mn
        }
      })
    );

    workbox.routing.registerRoute(
      new RegExp("https://openweathermap.org/img"),
      workbox.strategies.staleWhileRevalidate({
        cacheName: "forecast-icon",
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60 //cache the news content for 30mn
        }
      })
    );

    // workbox.routing.registerRoute(
    //   new RegExp(/\.(?:png|gif|jpg|jpeg)$/),
    //   workbox.strategies.cacheFirst({
    //     cacheName: "images",
    //     plugins: [
    //       new workbox.expiration.Plugin({
    //         maxEntries: 60,
    //         maxAgeSeconds: 180 * 24 * 60 * 60 // 180 Days
    //       })
    //     ]
    //   })
    // );
  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}
