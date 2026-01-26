import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
interface ProjectCardProps {
  imgSrc: string;
  projectLink: string;
  tags: string[];
  title: string;
  toolIcons?: Record<string, string>;
}

export const ProjectCard = ({
  imgSrc,
  projectLink,
  tags,
  title,
  toolIcons,
}: ProjectCardProps) => {
  return (
    <motion.div
      variants={fadeUp}
      className='relative rounded-2xl overflow-hidden group cursor-pointer shadow-md
             aspect-[3/2] md:aspect-[16/9] w-full'
    >
      <img
        src={imgSrc}
        alt={title}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      <div className='absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500' />

      <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-6 overflow-hidden'>
        <h3 className='text-2xl font-bold text-white drop-shadow-md'>
          {title}
        </h3>

        {/* <p className='mt-3 text-white/90 text-md max-w-md line-clamp-3'>
          {desc}
        </p> */}

        <div className='flex flex-wrap items-center justify-center gap-2 mt-4'>
          {tags.map((tag, i) => {
            // Normalized lookup: remove internal whitespace, lowercase
            const lookup = tag.toLowerCase().trim();
            // Find matching icon key (keys in toolIcons should be normalized or we check flexibly)
            const iconUrl = toolIcons ? Object.entries(toolIcons).find(([k]) => k.toLowerCase() === lookup)?.[1] : null;

            return iconUrl ? (
              <div key={i} className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm" title={tag}>
                <img src={iconUrl} alt={tag} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
              </div>
            ) : (
              <span
                key={i}
                className='px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground'
              >
                {tag}
              </span>
            );
          })}
        </div>

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
