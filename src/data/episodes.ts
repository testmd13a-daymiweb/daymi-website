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
