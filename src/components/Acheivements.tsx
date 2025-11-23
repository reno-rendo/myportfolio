import { motion } from 'motion/react';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { SectionHeader } from './SectionHeader';
import { publications, certifications } from '@/constants';
import { PublicationCard } from './PublicationCard';
import { CertificationCard } from './CertificationCard';

export const Acheivements = () => {
  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0)}
      className='mt-12 scroll-mt-10 px-2 sm:px-4'
      id='achievements'
    >
      <SectionHeader
        subtitle='Acheivements'
        title='Research Publications'
      />

      {/* Publications Grid */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.4)}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8'
      >
        {publications.map((publication) => (
          <motion.div
            key={publication.title}
            variants={fadeUp}
            className='w-full'
          >
            <PublicationCard publication={publication} />
          </motion.div>
        ))}
      </motion.div>

      {/* Certifications */}
      <motion.div
        variants={fadeUp}
        className='mt-16'
      >
        <motion.h2
          variants={fadeUp}
          className='text-2xl sm:text-3xl font-semibold mb-6 capitalize'
        >
          Certifications
        </motion.h2>

        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.5)}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 auto-rows-fr'
        >
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className='w-full'
            >
              <CertificationCard cert={cert} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
