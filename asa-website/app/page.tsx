import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Events from "@/components/Events";
import Officers from "@/components/Officers";
import Gallery from "@/components/Gallery";
import Donate from "@/components/Donate";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
    <Navbar />
    <main>
      <Hero />
      <About />
      <Events />
      <Officers />
      <Gallery />
      <Donate />
      <Contact />
    </main>
    <Footer />
    </div>
  );
}
