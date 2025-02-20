const apiKey = "AIzaSyANlcpM94oqiopnHzc2zpri4S9dCFPUH0Y";
const query = "AI/ML";
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(
    query
)}&part=snippet&type=video&maxResults=12`;

let currentIframe = null;
let currentThumbnail = null;

// Open IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("VideoDB", 1);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("videos")) {
                db.createObjectStore("videos", { keyPath: "id" });
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject("Error opening IndexedDB");
        };
    });
}

// Save videos to IndexedDB
async function saveVideosToDB(videos) {
    let db = await openDatabase();
    let transaction = db.transaction("videos", "readwrite");
    let store = transaction.objectStore("videos");

    // Clear old videos before saving new ones
    store.clear().onsuccess = () => {
        videos.forEach((video) => {
            let videoData = {
                id: video.id.videoId,
                title: video.snippet.title,
                thumbnail: video.snippet.thumbnails.high.url,
            };
            store.put(videoData);
        });
        console.log("Videos saved to IndexedDB.");
    };
}

// Load videos from IndexedDB
async function loadVideosFromDB() {
    let db = await openDatabase();
    return new Promise((resolve) => {
        let transaction = db.transaction("videos", "readonly");
        let store = transaction.objectStore("videos");

        let request = store.getAll();
        request.onsuccess = function () {
            resolve(request.result);
        };
    });
}

// Fetch videos (online or offline)
async function fetchVideos() {
    try {
        if (navigator.onLine) {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (!data.items) {
                throw new Error("No videos found.");
            }

            await saveVideosToDB(data.items);
            displayVideos(data.items);
        } else {
            console.log("Offline: Loading videos from IndexedDB...");
            let videos = await loadVideosFromDB();
            displayVideos(videos);
        }
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

// Display videos
function displayVideos(videos) {
    const container = document.getElementById("trending-video");
    container.innerHTML = ""; // Clear previous results

    console.log("Videos to be displayed:", videos);

    videos.forEach((video) => {
        const videoElement = document.createElement("div");
        videoElement.className = "video";
        videoElement.innerHTML = `
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" loading="lazy">
            <iframe
                src="https://www.youtube.com/embed/${video.id}?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="display: none;">
            </iframe>
        `;

        const thumbnail = videoElement.querySelector(".thumbnail");
        const iframe = videoElement.querySelector("iframe");

        thumbnail.addEventListener("click", () => {
            if (currentIframe) {
                currentIframe.remove();
                currentThumbnail.style.display = "block";
            }

            thumbnail.style.display = "none";
            iframe.style.display = "block";
            currentIframe = iframe;
            currentThumbnail = thumbnail;
        });

        container.appendChild(videoElement);
    });
}

export { fetchVideos };
