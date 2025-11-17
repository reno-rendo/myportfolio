import { motion } from 'motion/react';

import { fadeUp, staggerContainer } from '@/lib/animations';

import { SectionHeader } from './SectionHeader';

import { services } from '@/constants';

import { ServiceCard } from './ServiceCard';

export const Service = () => {
  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='services'
    >
      <SectionHeader
        subtitle='Services'
        title='Building with Quality and Precision'
      />

      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.5)}
        className='grid md:grid-cols-2 gap-10 mt-10'
      >
        {services.map((service) => (
          <motion.div
            key={service.title}
            variants={fadeUp}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
