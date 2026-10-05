import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Clock, Volume2 } from "lucide-react";
import GlassCard from "./GlassCard";
import { episodes, type Episode } from "../data/episodes";

function CoverArt({ ep, playing, onPlay }: { ep: Episode; playing: boolean; onPlay: () => void }) {
  return (
    <div className="episode-cover group/cover relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-black">
      <img
        src={ep.cover}
        alt={`${ep.title} cover`}
        className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover/cover:scale-[1.045] group-hover/cover:saturate-100"
        loading="lazy"
      />
      <div className="episode-cover-treatment absolute inset-0 transition-[opacity,filter] duration-700 ease-out group-hover/cover:opacity-0 group-hover/cover:blur-[1px]" />
      <div className="episode-cover-noise absolute inset-0 opacity-75 transition-opacity duration-500 group-hover/cover:opacity-0" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0">
          <span className="inline-flex max-w-full rounded-full border border-orange-hot/40 bg-black/45 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-orange-hot backdrop-blur-md">
            {ep.topic}
          </span>
          <div className="mt-2 max-w-[90%] text-base font-extrabold leading-[1.05] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg">
            {ep.title}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className="episode-play relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:scale-105 hover:border-orange-hot/70 hover:bg-orange-hot hover:text-black sm:h-12 sm:w-12"
          aria-label={playing ? `Pause ${ep.title}` : `Play ${ep.title}`}
        >
          {playing ? <Pause size={17} className="fill-current" /> : <Play size={17} className="ml-0.5 fill-current" />}
        </button>
      </div>

      <div className="pointer-events-none absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md sm:left-4 sm:top-4">
        <Volume2 size={10} /> Persian audio
      </div>
    </div>
  );
}

function EpisodeCard({ ep, playingId, onPlay, onOpen }: { ep: Episode; playingId: string | null; onPlay: (ep: Episode) => void; onOpen: (e: Episode) => void }) {
  const playing = playingId === ep.id;
  return (
    <GlassCard tilt className="group cursor-pointer p-3 sm:p-4">
      <button className="block h-full w-full text-left" onClick={() => onOpen(ep)} data-cursor="Open" aria-label={`Open episode ${ep.title}`}>
        <CoverArt ep={ep} playing={playing} onPlay={() => onPlay(ep)} />
        <div className="flex min-h-[178px] flex-col pt-4 sm:min-h-[190px] sm:pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-orange-hot/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-orange-hot">
              {ep.topic}
            </span>
            {ep.featured && <span className="rounded-full bg-orange-hot/20 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-orange-hot">Latest</span>}
          </div>
          <bdi dir="auto" className="mt-3 block font-sans text-xl font-bold leading-tight text-white sm:text-2xl">{ep.title}</bdi>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-light">{ep.summary}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs text-gray-mid">
            <span className="flex items-center gap-1"><Clock size={12} /> {ep.duration}</span>
            <span className="font-mono uppercase tracking-[0.12em] text-orange-hot/80">{playing ? "Playing now" : "Play episode"}</span>
          </div>
        </div>
      </button>
    </GlassCard>
  );
}

export default function EpisodesGrid() {
  const [language, setLanguage] = useState<"persian" | "english">("persian");
  const [videoEpisodes, setVideoEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    const params = new URLSearchParams({ language });
    if (pageToken) params.set("pageToken", pageToken);
    fetch(`/api/episodes?${params}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        if (!Array.isArray(data.episodes)) throw new Error("Invalid response");
        const incoming: Episode[] = data.episodes.map((video: Episode) => {
          const match = video.duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
          const seconds = match ? Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0) : 0;
          return { ...video, audio: "", topic: "YouTube", duration: seconds ? `${Math.floor(seconds / 60)} min ${seconds % 60} sec` : "YouTube" };
        });
        setVideoEpisodes(previous => pageToken
          ? [...previous, ...incoming.filter(video => !previous.some(item => item.id === video.id))]
          : incoming);
        setNextPageToken(data.nextPageToken || null);
      })
      .catch(() => { if (!controller.signal.aborted) setLoadError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [language, pageToken]);

  const visibleEpisodes = videoEpisodes.length ? videoEpisodes : language === "persian" && loadError ? episodes : [];
  const [active, setActive] = useState<Episode | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const ended = () => setPlayingId(null);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);
    return () => { audio.removeEventListener("timeupdate", update); audio.removeEventListener("ended", ended); };
  }, [active]);

  function playEpisode(ep: Episode) {
    const audio = audioRef.current;
    if (!audio) return;
    if (ep.youtubeId) {
      audio.pause();
      setPlayingId(null);
      setActive(ep);
      return;
    }
    if (playingId === ep.id) { audio.pause(); setPlayingId(null); return; }
    audio.src = ep.audio;
    audio.currentTime = 0;
    void audio.play();
    setPlayingId(ep.id);
    setActive(ep);
  }

  function closeModal() {
    audioRef.current?.pause();
    setPlayingId(null);
    setActive(null);
    setProgress(0);
  }

  return (
    <section id="episodes" className="relative z-10 bg-black px-5 py-24 sm:px-10">
      <audio ref={audioRef} preload="none" aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-orange-hot">[ Episodes ]</p>
            <h2 className="mt-3 text-balance font-sans text-[clamp(32px,5vw,64px)] font-extrabold leading-[0.98] tracking-tight text-white">Real stories. Real voices.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-gray-light">Daymi episodes, in Persian and English, with original artwork and playback built directly into the experience.</p>
        </div>

        <div className="mb-6 flex gap-3" aria-label="Episode language">
          {(["persian", "english"] as const).map(value => (
            <button key={value} aria-pressed={language === value} onClick={() => {
              if (language === value) return;
              closeModal(); setLanguage(value); setVideoEpisodes([]); setPageToken(null); setNextPageToken(null);
            }} className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${language === value ? "border-orange-hot bg-orange-hot/15 text-cream" : "border-white/15 text-gray-light hover:text-cream"}`}>
              {value === "persian" ? "Persian" : "English"}
            </button>
          ))}
        </div>
        {loading && <p role="status" className="mb-6 text-sm text-gray-light">Loading episodes…</p>}
        {loadError && <p role="status" className="mb-6 text-sm text-gray-light">YouTube is temporarily unavailable.{language === "persian" && !videoEpisodes.length ? " You can still listen to the saved episodes below." : " Please try again later."}</p>}
        {!loading && !loadError && !visibleEpisodes.length && <p className="mb-6 text-sm text-gray-light">No episodes available yet.</p>}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleEpisodes.map((ep) => <EpisodeCard key={ep.id} ep={ep} playingId={playingId} onPlay={playEpisode} onOpen={setActive} />)}
        </div>

        {nextPageToken && (
          <div className="mt-10 flex justify-center">
            <button disabled={loading} onClick={() => setPageToken(nextPageToken)} className="rounded-full border border-white/15 px-6 py-3 text-sm text-cream hover:border-orange-hot/60 disabled:opacity-50">Load more episodes</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="glass relative max-h-[90dvh] overflow-y-auto w-full max-w-3xl rounded-[28px] p-4 sm:p-6">
              <button onClick={closeModal} aria-label="Close" className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-cream backdrop-blur-md"><X size={16} /></button>
              {active.youtubeId ? (
                <iframe key={active.youtubeId} src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`} title={active.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="aspect-video min-h-[200px] w-full rounded-[20px]" />
              ) : <img src={active.cover} alt="" className="aspect-[16/9] w-full rounded-[20px] object-cover" />}
              <div className="px-2 pb-2 pt-5 sm:px-4 sm:pt-6">
                <span className="rounded-full border border-orange-hot/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-orange-hot">{active.topic}</span>
                <bdi dir="auto" className="mt-4 block text-balance font-sans text-3xl font-extrabold text-white sm:text-4xl">{active.title}</bdi>
                <p dir="auto" className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-6 text-gray-light">{active.summary}</p>
                {!active.youtubeId && <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => playEpisode(active)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-core to-orange-hot text-black" aria-label={playingId === active.id ? "Pause" : "Play"}>{playingId === active.id ? <Pause size={18} className="fill-black" /> : <Play size={18} className="fill-black" />}</button>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-orange-core to-orange-hot" style={{ width: `${progress * 100}%` }} /></div>
                    <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-wider text-gray-mid"><span>Persian audio</span><span>{active.duration}</span></div>
                  </div>
                </div>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
