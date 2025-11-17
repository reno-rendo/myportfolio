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
        className='mt-2 text-neutral-300'
      >
        Hello! I'm Hafsa Aarifeen, Full-stack developer focused on practical,
        production-ready solutions — not demo-level code. Experienced with
        React, Next.js, TypeScript, Java, and backend fundamentals (APIs, DB
        design, SQL/PostgreSQL). <br /> <br />
        Currently sharpening engineering depth through real-world frontend work:
        UI architecture, form systems, validation, and API integration.
        Comfortable working end-to-end: designing components, building scalable
        logic, debugging edge cases, and tightening performance. Prior
        experience includes a six-month internship at LSEG and ongoing work at
        X4 Digital Labs, plus academic projects and published research.
        Interested in building clean, maintainable systems and pushing beyond
        “just making it work” toward reliable engineering.
      </motion.p>
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <Button className='mt-5'>Contact Me</Button>
      </motion.div>
    </motion.section>
  );
};
