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
      className='mt-12 scroll-mt-10 px-2 sm:px-4'
      id='resume'
    >
      <SectionHeader
        subtitle='Resume'
        title='Education & Professional Journey'
      />

      <motion.p
        variants={fadeUp}
        className='mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed'
      >
        With a background in Information Technology and hands-on experience
        across frontend engineering, research, and real-world product
        development, I’ve worked on projects ranging from internal dashboards to
        full-stack applications.
      </motion.p>

      {/* Work Experience & Education */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 my-12'>
        {/* Experience */}
        <motion.div variants={fadeUp}>
          <h2 className='text-2xl sm:text-3xl font-semibold mb-6'>
            Work Experience
          </h2>

          <div className='space-y-8 border-l md:border-l border-neutral-700 pl-4 md:pl-6'>
            {experience.map((item, i) => (
              <ExpCard
                key={i}
                item={item}
              />
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div variants={fadeUp}>
          <h2 className='text-2xl sm:text-3xl font-semibold mb-6'>Education</h2>

          <div className='space-y-8 border-l md:border-l border-neutral-700 pl-4 md:pl-6'>
            {education.map((item, i) => (
              <ExpCard
                key={i}
                item={item}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tools */}
      <div className='my-16'>
        <motion.h2
          variants={fadeUp}
          className='text-2xl sm:text-3xl font-semibold mb-6 capitalize'
        >
          Tools & Technologies
        </motion.h2>

        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.5)}
          className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6'
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
