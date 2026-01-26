import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { Button } from './ui/button';
import { SparkleIcon, Download } from 'lucide-react';

interface HeroData {
  name: string;
  bio: string;
  resumeUrl: string;
}

import { DEFAULTS } from '@/lib/defaults';

export const Hero = () => {
  const [data, setData] = useState<HeroData>({
    name: DEFAULTS.profile.name,
    bio: DEFAULTS.profile.bio,
    resumeUrl: DEFAULTS.profile.resumeUrl,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profile = await res.json();
          if (profile) {
            setData({
              name: profile.name || DEFAULTS.profile.name,
              bio: profile.bio || DEFAULTS.profile.bio,
              resumeUrl: profile.resumeUrl || DEFAULTS.profile.resumeUrl,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0)}
      className='pt-20'
      id='hero'
      key={loading ? 'loading' : 'loaded'}
    >
      <motion.p
        variants={fadeUp}
        className='flex items-center justify-center py-1 gap-2 border border-neutral-600 rounded-sm w-32'
      >
        <SparkleIcon size={15} />
        <span>Introduction</span>
      </motion.p>

      {loading ? (
        <motion.div variants={fadeUp} className="mt-2 text-4xl md:text-5xl lg:text-6xl font-semibold capitalize max-w-3xl md:leading-16 space-y-4">
          <div className="h-16 bg-zinc-800 rounded w-1/2 animate-pulse" />
          <div className="h-12 bg-zinc-800 rounded w-3/4 animate-pulse" />
        </motion.div>
      ) : (
        <motion.h1
          variants={fadeUp}
          className='text-4xl md:text-5xl lg:text-6xl font-semibold capitalize mt-2 max-w-3xl md:leading-16'
        >
          I'm{' '}
          <u>
            <span className='text-primary'>{data.name}</span>
          </u>
          , {data.bio}
        </motion.h1>
      )}

      <motion.div
        variants={fadeUp}
        className='mt-5 flex gap-2'
      >
        <Button asChild>
          <a href='#projects'>My Projects</a>
        </Button>
        <Button
          variant='outline'
          asChild
        >
          <a
            href={data.resumeUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Download className="mr-2 h-4 w-4" /> Download Resume
          </a>
        </Button>
      </motion.div>
    </motion.section>
  );
};
