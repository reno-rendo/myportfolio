import { motion } from 'motion/react';

import { fadeUp } from '@/lib/animations';

import type { ToolsType } from '@/types';

export const ToolsCard = ({ tool }: { tool: ToolsType }) => {
  return (
    <motion.div
      variants={fadeUp}
      className='
        flex flex-col items-center justify-center
        rounded-2xl border border-neutral-700
        px-4 py-4 transition-all duration-300
        hover:bg-zinc-900 hover:border-primary
      '
    >
      <img
        src={tool.imgSrc}
        alt={tool.label}
        className='h-12 w-12 object-contain'
      />
      <p className='font-bold mt-3 text-white'>{tool.label}</p>
    </motion.div>
  );
};
