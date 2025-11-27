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
        className='mt-4 text-xl text-neutral-100'
      >
        I’m a full-stack developer who builds simple, stable and easy-to-use
        features. I’m not great at everything, but I learn fast and I care about
        doing things properly.
        <br /> <br />
        Real projects taught me something important: good software comes from
        clear thinking and fixing one problem at a time. No shortcuts.
        <br />
        <br />
        What drives me is simple. When someone uses something I built and it
        “just works,” that’s enough. That’s what keeps me improving and aiming
        to build software that lasts.
        <br /> <br />
        I’m here to build software that lasts, not quick prototypes.
      </motion.p>
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <a
          href='https://www.linkedin.com/in/reno-rendo-073034304/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button className='mt-5'>Contact Me</Button>
        </a>
      </motion.div>
    </motion.section>
  );
};
