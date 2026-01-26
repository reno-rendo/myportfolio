import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { socialLinks } from '@/constants';
import type { Tool } from '@/lib/db';

interface ProfileData {
  name: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  avatarUrl: string;
  specialization: string;
  location: string;
}

// Default/fallback data
const defaultProfile: ProfileData = {
  name: 'Reno Rendo',
  bio: 'Fullstack & Frontend Developer',
  email: '',
  linkedin: '',
  github: '',
  avatarUrl: '/Avatar_animated.png',
  specialization: 'React, Next.js, TypeScript',
  location: 'Kupang, Indonesia',
};

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileRes, toolsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/tools')
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data) {
            setProfile({
              name: data.name || defaultProfile.name,
              bio: data.bio || defaultProfile.bio,
              email: data.email || '',
              linkedin: data.linkedin || '',
              github: data.github || '',
              avatarUrl: data.avatarUrl || defaultProfile.avatarUrl,
              specialization: data.specialization || defaultProfile.specialization,
              location: data.location || defaultProfile.location,
            });
          }
        }

        if (toolsRes.ok) {
          const tData = await toolsRes.json();
          if (Array.isArray(tData)) setTools(tData);
        }

      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Get avatar URL - handle both uploaded and default
  const avatarSrc = profile.avatarUrl.startsWith('/uploads/')
    ? `http://localhost:3000${profile.avatarUrl}`
    : profile.avatarUrl;

  // Filter tools for specialization
  const specTools = tools.filter(tool =>
    profile.specialization.split(',').map(s => s.trim()).includes(tool.label)
  );

  return (
    <aside
      data-lenis-prevent
      className='max-w-3xl border m-6 border-neutral-600 bg-neutral-900 text-white p-6 rounded-lg lg:sticky lg:left-0 lg:top-6 lg:w-96 max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar overscroll-contain'
    >
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-x-10'>
          <h1 className='text-1x3 font-bold'>
            {loading ? <span className="bg-zinc-800 h-6 w-32 rounded animate-pulse block" /> : profile.name}
          </h1>

          <p className='text-sm'>
            {loading ? <span className="bg-zinc-800 h-4 w-40 rounded animate-pulse block" /> : profile.bio}
          </p>
        </div>

        {loading ? (
          <div className="lg:w-96 h-80 rounded-2xl bg-zinc-800 animate-pulse" />
        ) : (
          <img
            src={avatarSrc}
            alt={profile.name}
            className='lg:w-96 rounded-2xl object-cover'
          />
        )}

        <div className='mt-2'>
          <p className='text-sm text-neutral-300 mb-2'>Specialization</p>
          <div className='flex flex-wrap gap-2'>
            {loading ? (
              <span className="bg-zinc-800 h-6 w-48 rounded animate-pulse block mt-1" />
            ) : specTools.length > 0 ? (
              specTools.map(tool => (
                <div key={tool.id} className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700" title={tool.label}>
                  {tool.imageUrl ? (
                    <img src={tool.imageUrl} alt={tool.label} className="w-5 h-5 object-contain" />
                  ) : <span className="text-xs">{tool.label}</span>}
                </div>
              ))
            ) : (
              <p className='text-lg capitalize'>{profile.specialization}</p>
            )}
          </div>
        </div>

        <div>
          <p className='text-sm text-neutral-300'>Based in:</p>
          <p className='text-lg capitalize'>
            {loading ? <span className="bg-zinc-800 h-6 w-32 rounded animate-pulse block mt-1" /> : profile.location}
          </p>
        </div>

        <div className='flex gap-3 pt-2 justify-center text-neutral-500'>
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            // Use profile links if available, fallback to constants
            let link = social.link;
            if (social.link.includes('linkedin') && profile.linkedin) link = profile.linkedin;
            if (social.link.includes('github') && profile.github) link = profile.github;
            if (social.link.includes('mailto') && profile.email) link = `mailto:${profile.email}`;

            return (
              <a
                href={link}
                key={i}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-primary border-2 border-neutral-500 p-2 rounded-full hover:border-primary transition duration-200'
              >
                <Icon className='size-6' />
              </a>
            );
          })}
        </div>
        <Button
          className='mt-2'
          size='lg'
        >
          <a href='#contact'>Let's Work</a>
        </Button>
      </div>
    </aside>
  );
};
