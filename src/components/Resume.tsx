import { motion } from 'motion/react';

import { fadeUp, staggerContainer } from '@/lib/animations';

import { SectionHeader } from './SectionHeader';

import { ExpCard } from './ExpCard';

import { education, experience, tools } from '@/constants';
import { ToolsCard } from './ToolsCard';

export const Resume = () => {
  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='resume'
    >
      <SectionHeader
        subtitle='Resume'
        title='Education & Professional Journey'
      />

      <motion.p
        variants={fadeUp}
        className='mt-4 text-neutral-300'
      >
        With a background in Information Technology and hands-on experience
        across frontend engineering, research, and real-world product
        development, I’ve worked on projects ranging from internal dashboards to
        full-stack applications.
        {/* My roles—whether at LSEG, X4 Digital Labs, or
        in academic research—have pushed me to build interfaces that are
        reliable, scalable, and genuinely useful. Every project has sharpened my
        focus on writing clean code, understanding system behavior, and
        delivering user-centered solutions that actually solve problems. */}
      </motion.p>
      <div className='grid gap-x-10 my-16 md:grid-cols-2'>
        <motion.div
          variants={fadeUp}
          className='mb-16 md:mb-0'
        >
          <h2 className='text-3xl font-semibold mb-8'>Work Experience</h2>

          <div className='space-y-8 border-l border-border pl-6'>
            {experience.map((item, i) => (
              <ExpCard
                key={i}
                item={item}
              />
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className='mb-16 md:mb-0'
        >
          <h2 className='text-3xl font-semibold mb-8'>Education</h2>

          <div className='space-y-8 border-l border-neutral-700 pl-6'>
            {education.map((item, i) => (
              <ExpCard
                key={i}
                item={item}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className='my-16'>
        <motion.h2
          variants={fadeUp}
          className='text-3xl font-semibold mb-8 capitalize'
        >
          Tools & Technologies
        </motion.h2>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.5)}
          className='grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5'
        >
          {tools.map((tool, i) => (
            <ToolsCard
              key={i}
              tool={tool}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
