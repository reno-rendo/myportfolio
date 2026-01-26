import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { SectionHeader } from './SectionHeader';
import { ExpCard } from './ExpCard';
import { ToolsCard } from './ToolsCard';

// Fallback data
import { education as fallbackEducation, experience as fallbackExperience, tools as fallbackTools } from '@/constants';

interface ExperienceItem {
  id?: string;
  type?: string;
  year: string;
  title: string;
  institute: string;
  description?: string | null;
}

interface Tool {
  label: string;
  imgSrc?: string;
  imageUrl?: string;
}

export const Resume = () => {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<ExperienceItem[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/experience');
        if (res.ok) {
          const data: ExperienceItem[] = await res.json();
          if (Array.isArray(data)) {
            setExperience(data.filter(d => d.type === 'work'));
            setEducation(data.filter(d => d.type === 'education'));
          }
        } else {
          throw new Error('API error');
        }
      } catch {
        setExperience(fallbackExperience);
        setEducation(fallbackEducation);
      }

      // Tools
      try {
        const toolsRes = await fetch('/api/tools');
        if (toolsRes.ok) {
          const toolsData = await toolsRes.json();
          setTools(toolsData);
        } else {
          setTools(fallbackTools.map(t => ({ id: '', label: t.label, imageUrl: t.imgSrc, sortOrder: 0 })));
        }
      } catch {
        setTools(fallbackTools.map(t => ({ id: '', label: t.label, imageUrl: t.imgSrc, sortOrder: 0 })));
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
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
        development, I've worked on projects ranging from internal dashboards to
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
            {loading ? (
              <div className="h-32 bg-zinc-900 rounded-lg animate-pulse" />
            ) : experience.length > 0 ? (
              experience.map((item, i) => (
                <ExpCard
                  key={item.id || i}
                  item={{
                    year: item.year,
                    title: item.title,
                    institute: item.institute,
                    desc: item.description || '',
                  }}
                />
              ))
            ) : (
              <p className="text-zinc-500">No experience added yet</p>
            )}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div variants={fadeUp}>
          <h2 className='text-2xl sm:text-3xl font-semibold mb-6'>Education</h2>

          <div className='space-y-8 border-l md:border-l border-neutral-700 pl-4 md:pl-6'>
            {loading ? (
              <div className="h-32 bg-zinc-900 rounded-lg animate-pulse" />
            ) : education.length > 0 ? (
              education.map((item, i) => (
                <ExpCard
                  key={item.id || i}
                  item={{
                    year: item.year,
                    title: item.title,
                    institute: item.institute,
                    desc: item.description || '',
                  }}
                />
              ))
            ) : (
              <p className="text-zinc-500">No education added yet</p>
            )}
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
          key={loading ? 'loading-tools' : 'loaded-tools'}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.5)}
          className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6'
        >
          {tools.map((tool, i) => (
            <ToolsCard
              key={i}
              tool={{
                label: tool.label,
                imgSrc: tool.imageUrl || '',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
