const apiKey = "AIzaSyBNNfpEqDrThXLfd3D7GxywEZJ6oAZuPjw";
const query = "Web development";
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

    videos.forEach((video) => {
        let videoData = {
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
        };
        store.put(videoData);
    });

    console.log("Videos saved to IndexedDB.");
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
            const data = await response.json();
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
    const container = document.getElementById("featured-video");
    container.innerHTML = ""; // Clear previous results

    videos.forEach((video) => {
        const videoElement = document.createElement("div");
        videoElement.className = "video";
        videoElement.innerHTML = `
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}">
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
                currentIframe.src = currentIframe.src; // Stop previous video
                currentThumbnail.style.display = "block";
                currentIframe.style.display = "none";
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
