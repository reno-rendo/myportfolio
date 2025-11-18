import { useEffect } from 'react';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Service } from './components/Service';
import { Resume } from './components/Resume';

export const App = () => {
  return (
    <main className='flex flex-col container mx-auto p-10 max-w-4xl lg:pr-10 lg:pl-0 lg:max-w-6xl'>
      <Hero />
      <Stats />
      <Projects />
      <About />
      <Service />
      <Resume />
    </main>
  );
};
