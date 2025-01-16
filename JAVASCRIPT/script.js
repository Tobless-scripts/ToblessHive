import { fetchVideos as fetchVideoData } from "./video.js";
import { fetchVideos as fetchTrendingVideos } from "./trending.js";
import { fetchVideos as fetchPopularVideos } from "./popular.js";
import { fetchVideos as fetchFeaturedVideos } from "./featured.js";

fetchVideoData();
fetchTrendingVideos();
fetchPopularVideos();
fetchFeaturedVideos();
