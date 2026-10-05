const CHANNELS = {
  persian: "@daymipodcast",
  english: "@daymipodcast.English",
};

// These channels publish full episodes longer than three minutes.
// The Data API does not expose a Shorts flag; exclude their short clips by duration.
export function isFullEpisode(duration) {
  const match = duration?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return false;
  const seconds = Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  return seconds > 180;
}

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function youtube(resource, params, key) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    headers: { "X-Goog-Api-Key": key },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("YouTube request failed");
  return response.json();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname !== "/api/episodes") return json({ error: "Not found" }, 404);
    if (request.method !== "GET") {
      return new Response(null, { status: 405, headers: { Allow: "GET" } });
    }
    const language = url.searchParams.get("language") || "persian";
    if (!Object.hasOwn(CHANNELS, language)) return json({ error: "Invalid language" }, 400);
    const pageToken = url.searchParams.get("pageToken") || "";
    if (pageToken.length > 512) return json({ error: "Invalid page token" }, 400);
    if (!env.YOUTUBE_API_KEY) return json({ error: "YouTube integration is not configured" }, 503);

    // Canonical cache URLs avoid extra API calls from arbitrary query parameters.
    const cacheUrl = new URL("/api/episodes", url.origin);
    cacheUrl.searchParams.set("language", language);
    cacheUrl.searchParams.set("filter", "full-episodes-v2-12h");
    if (pageToken) cacheUrl.searchParams.set("pageToken", pageToken);
    const cacheKey = new Request(cacheUrl);
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;

    try {
      const channel = await youtube("channels", {
        part: "contentDetails", forHandle: CHANNELS[language],
      }, env.YOUTUBE_API_KEY);
      const playlistId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!playlistId) throw new Error("Channel unavailable");
      const playlist = await youtube("playlistItems", {
        part: "snippet", playlistId, maxResults: "50", ...(pageToken ? { pageToken } : {}),
      }, env.YOUTUBE_API_KEY);
      const ids = (playlist.items || []).map(item => item.snippet?.resourceId?.videoId).filter(Boolean);
      const videos = ids.length ? await youtube("videos", {
        part: "snippet,contentDetails,status", id: ids.join(","),
      }, env.YOUTUBE_API_KEY) : { items: [] };
      const episodes = (videos.items || [])
        .filter(video => video.status?.privacyStatus === "public" && video.status?.embeddable && isFullEpisode(video.contentDetails?.duration))
        .map(video => ({
          id: `youtube-${video.id}`,
          youtubeId: video.id,
          language,
          title: video.snippet.title,
          summary: video.snippet.description,
          date: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          cover: (video.snippet.thumbnails.maxres || video.snippet.thumbnails.high || video.snippet.thumbnails.default)?.url,
        }));
      const response = Response.json({ episodes, nextPageToken: playlist.nextPageToken || null }, {
        // Cache on Cloudflare for 12 hours; browsers revalidate through the Worker.
        headers: { "Cache-Control": "public, max-age=0, s-maxage=43200" },
      });
      ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
      return response;
    } catch {
      // Do not expose credentials or Google's error payload to the browser.
      return json({ error: "YouTube episodes are temporarily unavailable" }, 502);
    }
  },
};
