const apiKey = "AIzaSyANlcpM94oqiopnHzc2zpri4S9dCFPUH0Y";
const query = "Web development";
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(
    query
)}&part=snippet&type=video&maxResults=12`;

let currentIframe = null;
let currentThumbnail = null;

export async function fetchVideos() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayVideos(data.items);
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

export function displayVideos(videos) {
    const container = document.getElementById("popular-video");
    container.innerHTML = ""; // Clear previous results

    videos.forEach((video) => {
        const videoElement = document.createElement("div");
        videoElement.className = "video";
        videoElement.innerHTML = `
            <img src="${
                video.snippet.thumbnails.high.url
            }" class="thumbnail" alt="${video.snippet.title}">
            <iframe
                src="https://www.youtube.com/embed/${
                    video.id.videoId
                }?autoplay=1" <!-- No mute by default -->
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
  ${
      video.snippet.title.split(" ").slice(0, 10).join(" ") +
      (video.snippet.title.split(" ").length > 10 ? "..." : "")
  }
        `;

        // Add click event listener to replace the thumbnail with the iframe
        const thumbnail = videoElement.querySelector(".thumbnail");
        const iframe = videoElement.querySelector("iframe");

        thumbnail.addEventListener("click", () => {
            if (currentIframe) {
                // Stop the previous video by setting its src to about:blank
                currentIframe.src = "about:blank";
                // Show the previous thumbnail again
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
