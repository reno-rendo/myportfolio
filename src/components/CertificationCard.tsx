import { ExternalLink } from 'lucide-react';

export const CertificationCard = ({ cert }: { cert: any }) => {
  return (
    <div
      className='
        flex flex-col sm:flex-row gap-6
        rounded-2xl border border-neutral-700
        p-5 bg-background
        transition-all duration-300
        hover:bg-zinc-900 hover:border-primary
        h-full
      '
    >
      {/* Logo */}
      <div className='flex items-center justify-center sm:justify-start'>
        <div className='flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-xl overflow-hidden shrink-0'>
          {cert.imgSrc ? (
            <img
              src={cert.imgSrc}
              alt={cert.title}
              className='w-28 h-28 object-contain'
            />
          ) : (
            <span className='text-neutral-400 text-sm'>Logo</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col justify-between flex-1 text-center sm:text-left'>
        <div>
          <h3 className='text-lg font-semibold text-white'>{cert.title}</h3>
          <p className='text-neutral-400 text-md mt-1 leading-5'>
            <span className='font-medium'>{cert.awarded}</span>
          </p>
        </div>

        {cert.credentials && (
          <a
            href={cert.credentials}
            target='_blank'
            rel='noopener noreferrer'
            className='
              mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md
              bg-primary text-black font-medium shadow
              hover:scale-105 transition
              w-full sm:w-fit mx-auto sm:mx-0 justify-center
            '
          >
            View Credentials
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};
