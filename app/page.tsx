import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}