import type { PublicationType } from '@/types';
import { ExternalLink } from 'lucide-react';

export const PublicationCard = ({
  publication,
}: {
  publication: PublicationType;
}) => {
  const doiUrl = publication.doi ? `https://doi.org/${publication.doi}` : null;

  return (
    <div className='flex flex-col justify-between rounded-2xl border border-neutral-700 p-8 hover:bg-zinc-900 transition-all duration-300 hover:border-primary'>
      <div>
        <h3 className='text-xl font-medium text-white mb-2'>
          {publication.title}
        </h3>

        <p className='text-neutral-300 mb-2'>{publication.conference}</p>

        <p className='text-neutral-400 mb-4'>{publication.description}</p>
      </div>

      {doiUrl && (
        <div className='w-full flex justify-center mt-6'>
          <a
            href={doiUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-md
                 bg-primary text-black font-medium shadow
                 hover:scale-105 transition'
          >
            Read Full Paper
            <ExternalLink size={16} />
          </a>
        </div>
      )}
    </div>
  );
};
