import { motion } from 'motion/react';

import { fadeUp, staggerContainer } from '@/lib/animations';

import { SectionHeader } from './SectionHeader';

import { Button } from './ui/button';

export const About = () => {
  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='about'
    >
      <SectionHeader
        subtitle='About'
        title='Tranforming Ideas into Reality Through Code'
      />

      <motion.p
        variants={fadeUp}
        className='mt-4 text-lg text-neutral-100'
      >
        I’m a full-stack developer who cares about building things that actually
        work in production. I use React, Next.js, TypeScript, Java and solid
        backend fundamentals, but tools aren’t the point — structure, clarity
        and maintainability are.
        <br /> <br />
        My focus is on the parts of engineering people usually skip: clean
        component architecture, predictable data flow, form logic that doesn’t
        fall apart, sane API integration, and the small details that decide
        whether a feature feels reliable or fragile. I’m comfortable taking
        responsibility for the whole path from idea to working feature,
        including the design and the debugging that happens when real users hit
        unexpected paths. <br /> <br />
        I built my foundation at LSEG and continue to sharpen it through real
        project work at X4 Digital Labs, backed by academic projects and
        published research. My instinct is to simplify messy problems, remove
        unnecessary complexity and raise the standard instead of aiming for
        “good enough.”
        <br /> <br /> I’m here to build software that lasts, not quick
        prototypes.
      </motion.p>
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <a
          href='https://www.linkedin.com/in/hafsa-aarifeen/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button className='mt-5'>Contact Me</Button>
        </a>
      </motion.div>
    </motion.section>
  );
};
