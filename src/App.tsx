import { useEffect } from 'react';
import Lenis from 'lenis';

import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Service } from './components/Service';
import { Resume } from './components/Resume';
import { Contact } from './components/Contact';
import { Acheivements } from './components/Acheivements';

export const App = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className='flex flex-col container mx-auto p-10 max-w-4xl lg:pr-10 lg:pl-0 lg:max-w-6xl'>
      <Hero />
      <Stats />
      <Projects />
      <About />
      <Service />
      <Resume />
      <Acheivements />
      <Contact />
    </main>
  );
};
