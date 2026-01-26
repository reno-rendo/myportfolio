import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/animations';


interface StatItem {
  number: string;
  label: string;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    fetch(`/api/stats?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        console.log('Stats loaded:', data);
        if (Array.isArray(data)) {
          setStats(data);
        }
      })
      .catch((e) => {
        console.error('Stats fetch error:', e);
        // Do not fallback to defaults on error to avoid confusion
        // setStats([]); 
      });
  }, []);

  return (
    <motion.section
      initial='visible'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0.6)}
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 mt-20'
    >
      {stats.map((stat: any, i) => (
        <motion.div
          key={stat.id || i}
          variants={fadeUp}
          className='border border-neutral-700 rounded-xl flex justify-center items-center flex-col py-6'
        >
          <p className='text-4xl capitalize font-bold lining-nums'>
            {stat.number}
          </p>
          <p className='text-neutral-300'>{stat.label}</p>
        </motion.div>
      ))}
    </motion.section>
  );
};

