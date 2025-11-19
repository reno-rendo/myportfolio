import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import type { ProjectType } from '@/types';

export const ProjectCard = ({
  imgSrc,
  projectLink,
  desc,
  tags,
  title,
}: ProjectType) => {
  return (
    <motion.div
      variants={fadeUp}
      className='relative rounded-2xl overflow-hidden group cursor-pointer shadow-md scale-100'
    >
      {/* Background Image */}
      <img
        src={imgSrc}
        alt={title}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500'></div>

      {/* Text Content */}
      <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-6'>
        <h3 className='text-2xl font-bold text-white drop-shadow-md'>
          {title}
        </h3>

        <br />

        {desc && <p className='mt-2 text-white/90 text-md max-w-md'>{desc}</p>}
        <br />
        <div className='flex flex-wrap gap-2 mt-2'>
          {tags.map((tag, i) => (
            <span
              key={i}
              className='px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Icon Button */}
        <a
          href={projectLink}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium shadow hover:scale-105 transition'
        >
          Project Link
          <ExternalLink size={18} />
        </a>
      </div>
    </motion.div>
  );
};
