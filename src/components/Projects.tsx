import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

import { staggerContainer } from '@/lib/animations';

import { SectionHeader } from './SectionHeader';
import { ProjectCard } from './ProjectCard';

// Fallback data for when API is unavailable
import { projectsData as fallbackProjects, tools as fallbackTools } from '@/constants';

import type { ProjectType } from '@/types';

export const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [toolIcons, setToolIcons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Projects
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          // Use API data (even if empty)
          setProjects(data);
        } else {
          throw new Error('API error for projects');
        }

        // Fetch Tools for icons
        const toolsRes = await fetch('/api/tools');
        let toolsData = [];
        if (toolsRes.ok) {
          toolsData = await toolsRes.json();
        }

        // Build map from API tools or fallback
        const toolsSource = toolsData.length > 0 ? toolsData : fallbackTools;
        const iconMap: Record<string, string> = {};
        toolsSource.forEach((t: any) => {
          if (t.label && (t.imageUrl || t.imgSrc)) {
            iconMap[t.label] = t.imageUrl || t.imgSrc;
          }
        });
        setToolIcons(iconMap);

      } catch (e) {
        console.error("Failed to fetch data", e);
        // Fallback
        setProjects(fallbackProjects.map(p => ({
          title: p.title,
          description: p.desc,
          // Handle techStack mapping for fallback
          techStack: p.tags,
          // techStack: p.techStack || p.tags, // REMOVED duplicate key

          id: 'fallback-' + Math.random(),
          imageUrl: p.imgSrc,
          liveUrl: p.projectLink,
          tags: p.tags,
          imgSrc: p.imgSrc,
          projectLink: p.projectLink,
          repoUrl: null,
          category: null,
          toolIcons: {}, // Add missing optional property
          createdAt: new Date().toISOString(),
          sortOrder: 0
        } as unknown as ProjectType)));


        const iconMap: Record<string, string> = {};
        fallbackTools.forEach((t: any) => {
          if (t.label && t.imgSrc) {
            iconMap[t.label] = t.imgSrc;
          }
        });
        setToolIcons(iconMap);

      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <motion.section
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0)}
      className='mt-20 scroll-mt-10'
      id='projects'
    >
      <SectionHeader
        subtitle='Projects'
        title='My Featured Projects'
      />

      <motion.div
        key={loading ? 'loading' : 'loaded'}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer(0.5)}
        className='grid md:grid-cols-2 gap-10 mt-10'
      >
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-zinc-900 rounded-2xl h-80 animate-pulse" />
            ))}
          </>
        ) : (
          displayedProjects.map((project, i) => (
            <ProjectCard
              key={project.id || i}
              imgSrc={project.imageUrl || '/images/placeholder.jpg'}
              projectLink={project.liveUrl || project.repoUrl || '#'}
              tags={project.techStack || []}
              title={project.title}
              toolIcons={toolIcons}
            />
          ))
        )}
      </motion.div>

      {projects.length > 4 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {showAll ? 'Show Less' : 'View All Projects'}
          </button>
        </div>
      )}
    </motion.section>
  );
};
