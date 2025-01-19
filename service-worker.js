const CACHE_NAME = "my-cache-v2"; // Update the version
const urlsToCache = [
    "/index.html",
    "/HTML/blog.html",
    "/HTML/courses.html",
    "/HTML/features.html",
    "/CSS/blog.css",
    "/CSS/courses.css",
    "/CSS/features.css",
    "/CSS/style.css",
    "/JAVASCRIPT/container.js",
    "/JAVASCRIPT/featured.js",
    "/JAVASCRIPT/header.js",
    "/JAVASCRIPT/popular.js",
    "/JAVASCRIPT/script.js",
    "/JAVASCRIPT/trending.js",
    "/JAVASCRIPT/video.js",
    "/MEDIA/avatar-01.webp",
    "/MEDIA/avatar-02.webp",
    "/MEDIA/avatar-03.webp",
    "/MEDIA/avatar-04.webp",
    "/MEDIA/background-image.jpg",
    "/MEDIA/blog-10.webp",
    "/MEDIA/blog-11.webp",
    "/MEDIA/blog-12.webp",
    "/MEDIA/clock.png",
    "/MEDIA/close_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg",
    "/MEDIA/community.png",
    "/MEDIA/counter-media-01.webp",
    "/MEDIA/counter-media-02.webp",
    "/MEDIA/counter-media-03.webp",
    "/MEDIA/counter-media-04.webp",
    "/MEDIA/course.png",
    "/MEDIA/facebook (2).png",
    "/MEDIA/gamification.png",
    "/MEDIA/girl1.webp",
    "/MEDIA/girl2.webp",
    "/MEDIA/girl3.webp",
    "/MEDIA/github.png",
    "/MEDIA/homePage.png",
    "/MEDIA/instagram.png",
    "/MEDIA/learning-paths.png",
    "/MEDIA/linkedIn.png",
    "/MEDIA/logo.png",
    "/MEDIA/logo1024.png",
    "/MEDIA/logo144.png",
    "/MEDIA/logo192.png",
    "/MEDIA/logo512.png",
    "/MEDIA/mail.png",
    "/MEDIA/menu.png",
    "/MEDIA/quiz.png",
    "/MEDIA/star.png",
    "/MEDIA/telephone.png",
    "/MEDIA/twitter.png",
    "/MEDIA/whatsapp-icon.EkoMrkNv.png",
    "/MEDIA/homePage2.png",
];
// Install event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event (Clear old caches)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
