import { Music2, Video, Headphones } from "lucide-react";

export const LISTEN_GROUPS = [
  {
    language: "Persian",
    label: "Listen in Persian",
    platforms: [
      { name: "Spotify", href: "https://open.spotify.com/show/033DB8S1K07tu9PWWDsM2e", icon: Music2, blurb: "Follow and get notified on Spotify." },
      { name: "YouTube", href: "https://www.youtube.com/@daymipodcast", icon: Video, blurb: "Watch episodes with cover visuals." },
      { name: "Castbox", href: "https://castbox.fm/channel/daymipodcast-id7286246?country=us", icon: Headphones, blurb: "Listen on Castbox." },
    ],
  },
  {
    language: "English",
    label: "Listen in English",
    platforms: [
      { name: "Spotify", href: "https://open.spotify.com/show/033PzJGd1a4JAtnOW6MY1w", icon: Music2, blurb: "Follow and get notified on Spotify." },
      { name: "YouTube", href: "https://www.youtube.com/@daymipodcast.English", icon: Video, blurb: "Watch episodes with cover visuals." },
      { name: "Castbox", href: "https://castbox.fm/channel/daymipodcast.English-id7319170?country=us", icon: Headphones, blurb: "Listen on Castbox." },
    ],
  },
];
