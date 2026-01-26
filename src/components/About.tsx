import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { SectionHeader } from './SectionHeader';
import { Button } from './ui/button';

import { DEFAULTS } from '@/lib/defaults';

export const About = () => {
  const [aboutText, setAboutText] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profile = await res.json();
          setAboutText(profile?.about || '');
          setLinkedinUrl(profile?.linkedin || '');
        }
      } catch (error) {
        console.error('Failed to fetch about:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const defaultText = DEFAULTS.profile.about;

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='about'
    >
      <SectionHeader
        subtitle='About'
        title='Tranforming Ideas into Reality Through Code'
      />

      <motion.div
        variants={fadeUp}
        className='mt-4 text-xl text-neutral-100 whitespace-pre-line'
      >
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-zinc-800 rounded w-4/6" />
          </div>
        ) : (
          aboutText ? aboutText : defaultText
        )}
      </motion.div>
      <motion.div
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <a
          href={linkedinUrl || 'https://www.linkedin.com/'}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Button className='mt-5'>Contact Me</Button>
        </a>
      </motion.div>
    </motion.section>
  );
};
