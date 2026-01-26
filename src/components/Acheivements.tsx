import { useState, useEffect } from 'react';
import { SectionHeader } from './SectionHeader';
import { PublicationCard } from './PublicationCard';
import { CertificationCard } from './CertificationCard';

// Fallback data
import { publications as fallbackPublications, certifications as fallbackCertifications } from '@/constants';

interface Publication {
  id?: string;
  title: string;
  conference: string;
  url?: string | null;
  doi?: string | null;
  description?: string | null;
}

interface Certification {
  id?: string;
  title: string;
  awardedBy?: string;
  awarded?: string;
  credentials?: string | null;
  imageUrl?: string | null;
  imgSrc?: string;
}

export const Acheivements = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCerts, setShowAllCerts] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch publications
      try {
        const pubRes = await fetch('/api/publications');
        if (pubRes.ok) {
          const pubData = await pubRes.json();
          if (pubData.length > 0) {
            setPublications(pubData);
          } else {
            setPublications(fallbackPublications.map(p => ({
              title: p.title,
              conference: p.conference,
              url: p.URL,
              doi: p.doi,
              description: p.description,
            })));
          }
        } else {
          throw new Error('API error');
        }
      } catch {
        setPublications(fallbackPublications.map(p => ({
          title: p.title,
          conference: p.conference,
          url: p.URL,
          doi: p.doi,
          description: p.description,
        })));
      }

      // Fetch certifications
      try {
        const certRes = await fetch('/api/certifications');
        if (certRes.ok) {
          const certData = await certRes.json();
          if (certData.length > 0) {
            setCertifications(certData);
          } else {
            setCertifications(fallbackCertifications);
          }
        } else {
          throw new Error('API error');
        }
      } catch {
        setCertifications(fallbackCertifications);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

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
        {loading ? (
          <>
            <div className="h-40 bg-zinc-900 rounded-xl animate-pulse" />
            <div className="h-40 bg-zinc-900 rounded-xl animate-pulse" />
          </>
        ) : publications.length > 0 ? (
          publications.map((publication, i) => (
            <div
              key={publication.id || i}
              className='w-full'
            >
              <PublicationCard publication={{
                title: publication.title,
                conference: publication.conference,
                URL: publication.url || undefined,
                description: publication.description || '',
              }} />
            </div>
          ))
        ) : (
          <p className="text-zinc-500 col-span-2">No publications yet</p>
        )}
      </div>

      {/* Certifications */}
      <div className='mt-14'>
        <h2 className='text-2xl sm:text-3xl font-semibold mb-6 capitalize'>
          Certifications
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 auto-rows-fr'>
          {loading ? (
            <>
              <div className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
              <div className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
            </>
          ) : (showAllCerts ? certifications : certifications.slice(0, 4)).length > 0 ? (
            (showAllCerts ? certifications : certifications.slice(0, 4)).map((cert, i) => (
              <div
                key={cert.id || i}
                className='w-full'
              >
                <CertificationCard cert={{
                  title: cert.title,
                  awarded: cert.awardedBy || cert.awarded || '',
                  credentials: cert.credentials || '',
                  imgSrc: cert.imageUrl || cert.imgSrc || '',
                }} />
              </div>
            ))
          ) : (
            <p className="text-zinc-500 col-span-2">No certifications yet</p>
          )}
        </div>

        {certifications.length > 4 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAllCerts(!showAllCerts)}
              className="px-6 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white transition-all transform hover:scale-105 active:scale-95"
            >
              {showAllCerts ? 'Show Less' : 'View All Certifications'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
