import { useState } from 'react';

import { cn } from '@/lib/utils';

import { navLinks } from '@/constants';

export const FloatingMenu = () => {
  const [active, setActive] = useState('#hero');
  return (
    <div className='fixed right-10 top-1/2 -translate-y-1/2 bg-black border border-neutral-500 pt-4 rounded-full z-10 hidden lg:block'>
      {navLinks.map((link) => {
        const Icon = link.icon;

        return (
          <a
            key={link.label}
            href={link.link}
            onClick={() => setActive(link.link)}
            className={cn(
              'group relative text-neutral-400 flex items-center justify-center hover:text-primary transition-colors duration-200 mb-6 px-4',
              active === link.link && 'text-primary',
            )}
          >
            <Icon className='size-5' />

            {/* Tooltip label */}
            <span
              className='
    pointer-events-none absolute right-full mr-3
    whitespace-nowrap text-sm text-black bg-white
    px-2 py-1 rounded-md shadow-md
    opacity-0 translate-x-2
    group-hover:opacity-100 group-hover:translate-x-0
    transition-all duration-200
  '
            >
              {link.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};
