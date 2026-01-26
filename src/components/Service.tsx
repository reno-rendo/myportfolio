import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { SectionHeader } from './SectionHeader';
import { ServiceCard } from './ServiceCard';
import type { ServiceType } from '@/types';
import { services as defaultServices } from '@/constants';

export const Service = () => {
  const [services, setServices] = useState<any[]>(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map DB structure to UI structure
            // DB: title, description, projectCount, iconName
            // UI: title, desc, projects, icon (JSX)
            const mappedServices = data.map((item: any) => ({
              ...item,
              desc: item.description,
              projects: item.projectCount,
              // Note: We'll need a way to render icons dynamically if not handling it in ServiceCard
              // For now, since ServiceCard doesn't use the icon prop (commented out), we focus on desc.
            }));
            setServices(mappedServices);
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='services'
    >
      <SectionHeader
        subtitle='Services'
        title='Building with Quality and Precision'
      />

      <motion.div
        key={loading ? 'loading' : 'loaded'}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.5)}
        className='grid md:grid-cols-2 gap-10 mt-10'
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id || index}
            variants={fadeUp}
          >
            <ServiceCard service={service} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
