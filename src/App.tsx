import Preloader from "./components/Preloader";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TopicsTicker from "./components/TopicsTicker";
import Manifesto from "./components/Manifesto";
import EpisodesGrid from "./components/EpisodesGrid";
import TopicConstellation from "./components/TopicConstellation";
import WhereToListen from "./components/WhereToListen";
import About from "./components/About";
import SuggestTopic from "./components/SuggestTopic";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-black">
        <Preloader />
        <CustomCursor />
        <div className="grain-overlay" />
        <Nav />
        <main>
          <Hero />
          <TopicsTicker />
          <Manifesto />
          <EpisodesGrid />
          <TopicConstellation />
          <About />
          <WhereToListen />
          <SuggestTopic />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
