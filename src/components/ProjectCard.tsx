import { motion } from 'motion/react';

import { fadeUp } from '@/lib/animations';

import type { ProjectType } from '@/types';

export const ProjectCard = ({
  imgSrc,
  projectLink,
  tags,
  title,
}: ProjectType) => {
  return (
    <motion.div
      variants={fadeUp}
      className='relative'
    >
      <figure className='overflow-hidden rounded-md'>
        <img
          src={imgSrc}
          alt={title}
          className='rounded-md transition duration-500 hover:scale-110 w-full'
        />
      </figure>

      <div className='absolute bottom-0 p-2 flex gap-2'>
        {tags.map((tag, i) => (
          <span
            key={i}
            className='bg-background hover:bg-primary hover:text-black py-1 px-2 rounded-sm text-sm cursor-pointer'
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
