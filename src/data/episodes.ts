export type Episode = {
  id: string;
  title: string;
  titleFa?: string;
  topic: string;
  date?: string;
  duration: string;
  summary: string;
  cover: string;
  audio: string;
  featured?: boolean;
  youtubeId?: string;
  language?: "persian" | "english";
};

export const episodes: Episode[] = [
  {
    id: "ep-01",
    title: "Lipstick Syndrome",
    topic: "Psychology · Money",
    duration: "6 min 31 sec",
    summary: "Why do small luxuries suddenly become more tempting when money gets tight? A curious look at the psychology behind the lipstick effect.",
    cover: "/episodes/covers/lipstick-syndrome.webp",
    audio: "/episodes/audio/lipstick-syndrome.mp3",
    featured: true,
  },
  {
    id: "ep-02",
    title: "The Story of Money",
    topic: "History · Economics",
    duration: "5 min 31 sec",
    summary: "From ancient trade routes to digital currencies: how humans turned trust, objects and promises into money.",
    cover: "/episodes/covers/story-of-money.webp",
    audio: "/episodes/audio/story-of-money.mp3",
  },
  {
    id: "ep-03",
    title: "The Story of the Internet",
    topic: "Technology · History",
    duration: "7 min 24 sec",
    summary: "Before feeds, clouds and smartphones, there were cables, terminals and a strange idea: computers could talk to each other.",
    cover: "/episodes/covers/story-of-internet.webp",
    audio: "/episodes/audio/story-of-internet.mp3",
  },
  {
    id: "ep-04",
    title: "The Last Seconds of History",
    topic: "History · Future",
    duration: "8 min 33 sec",
    summary: "A journey across the strange boundary between what history has already recorded and what the next seconds might change.",
    cover: "/episodes/covers/last-seconds-of-history.webp",
    audio: "/episodes/audio/last-seconds-of-history.mp3",
  },
    {
    id: "ep-05",
    title: "White Gold",
    topic: "History · Money",
    duration: "7 min 13 sec",
    summary: "How did a simple seasoning on your kitchen table once fund empires, spark revolutions, and hold the power of life and death?",
    cover: "/episodes/covers/White-Gold.webp",
    audio: "/episodes/audio/White-Gold.mp3",
  },
    {
    id: "ep-06",
    title: "Who Ruled the Four-Year Timer?",
    topic: "Politics · Psychology",
    duration: "8 min 39 sec",
    summary: "What if the most powerful number in human history isn't a currency, but a hidden clock on our calendars?",
    cover: "/episodes/covers/Who-Ruled-the-Four-Year-Timer.png",
    audio: "/episodes/audio/Who-Ruled-the-Four-Year-Timer.mp3",
  },
  {
    id: "ep-07",
    title: "Fermi Paradox: Where Is Everybody?",
    topic: "Space · Science",
    duration: "7 min 27 sec",
    summary: "In a universe filled with billions of stars and planets, why haven't we found anyone else? A curious journey into the Fermi paradox and the silence of the cosmos.",
    cover: "/episodes/covers/fermi-paradox.png",
    audio: "/episodes/audio/fermi-paradox.mp3",
  },
];


export const sampleTopics: string[] = [
  "Why we get déjà vu",
  "The history of elevator music",
  "How maps lie to us",
  "Why cats purr",
  "The science of boredom",
  "Who invented small talk",
  "Why we yawn in groups",
  "The last blockbuster on earth",
  "Why time feels faster as you age",
  "The secret life of street signs",
  "Why we talk to our pets",
  "The myth of multitasking",
];
