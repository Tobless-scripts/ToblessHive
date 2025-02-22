const API_KEY = "3226f1b2c9mshf6dd783f21d8e63p1fac5ejsn92f2fb60dd03";
let searchQuery = "Web development";
const API_HOST = "youtube138.p.rapidapi.com";

const DB_NAME = "youtubeCacheDB";
const STORE_NAME = "videos";

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "query" });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) =>
            reject("IndexedDB Error: " + event.target.error);
    });
}

async function saveToDB(query, data) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.put({ query, data, timestamp: Date.now() });
    tx.oncomplete = () => console.log("Data saved to IndexedDB");
    tx.onerror = (event) =>
        console.error("IndexedDB Save Error:", event.target.error);
}

async function getFromDB(query, maxAge = 300000) {
    // 5 mins cache
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve) => {
        const request = store.get(query);
        request.onsuccess = () => {
            const result = request.result;
            if (result && Date.now() - result.timestamp < maxAge) {
                console.log("Data loaded from IndexedDB");
                resolve(result.data);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => resolve(null);
    });
}

async function fetchVideos() {
    // Check IndexedDB cache first
    const cachedData = await getFromDB(searchQuery);
    if (cachedData) return displayVideos(cachedData);

    const url = `https://${API_HOST}/search/?q=${searchQuery}&type=video&hl=en&gl=US`;

    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log(data);
        saveToDB(searchQuery, data); // ✅ Corrected
        displayVideos(data);
    } catch (error) {
        console.error("Error fetching videos:", error);
        alert(
            "Failed to load videos. Please check your API key or internet connection."
        );
    }
}

function displayVideos(data) {
    const videoContainer = document.getElementById("videoContainer");
    let currentPlayingVideo = null;

    data.contents.forEach((video) => {
        const videoEl = document.createElement("div");
        videoEl.className = "vid-cont";

        // Create thumbnail
        const imgEl = document.createElement("img");
        imgEl.src = video.video.thumbnails[0].url;
        imgEl.alt = "Video thumbnail";

        // Create iframe for video
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${video.videoId}`;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        iframe.className = "vid-player";
        iframe.style.display = "none"; // Initially hidden

        let previousThumbnail = null;

        // Click event for thumbnail
        imgEl.addEventListener("click", () => {
            if (currentPlayingVideo) {
                currentPlayingVideo.remove(); // Remove previous video
                previousThumbnail.style.display = "block"; // Show previous thumbnail
            }

            imgEl.style.display = "none"; // Hide thumbnail
            imgEl.parentElement.appendChild(iframe); // Show video

            currentPlayingVideo = iframe;
            previousThumbnail = imgEl;
        });

        videoEl.appendChild(imgEl);
        videoEl.appendChild(iframe);

        videoContainer.appendChild(videoEl);
    });
}

export { fetchVideos };
