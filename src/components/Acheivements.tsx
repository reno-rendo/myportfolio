import { publications, certifications } from '@/constants';
import { SectionHeader } from './SectionHeader';
import { PublicationCard } from './PublicationCard';
import { CertificationCard } from './CertificationCard';

export const Acheivements = () => {
  return (
    <section
      className='mt-12 scroll-mt-10 px-2 sm:px-4'
      id='achievements'
    >
      <SectionHeader
        subtitle='Acheivements'
        title='Research Publications'
      />

      {/* Publications Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-8'>
        {publications.map((publication) => (
          <div
            key={publication.title}
            className='w-full'
          >
            <PublicationCard publication={publication} />
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className='mt-14'>
        <h2 className='text-2xl sm:text-3xl font-semibold mb-6 capitalize'>
          Certifications
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 auto-rows-fr'>
          {certifications.map((cert, i) => (
            <div
              key={i}
              className='w-full'
            >
              <CertificationCard cert={cert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
