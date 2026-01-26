import { type JSX } from 'react';
import type { Project, Experience, Service, Tool, Stat, Publication, Certification } from '@/lib/db';

export type { Project, Experience, Service, Tool, Stat, Publication, Certification };

export type ProjectType = Project & {
  imgSrc?: string; // mapping from imageUrl
  tags?: string[]; // mapping from techStack
  projectLink?: string; // mapping from liveUrl/repoUrl
  desc?: string; // mapping from description
  toolIcons?: Record<string, string>;
};

export type ExperienceType = {
  year: string; // from year
  title: string; // from title
  institute: string; // from institute
  desc: string; // from description
};

export type ServiceType = Service & {
  desc?: string; // mapping from description
  projects?: string; // mapping from projectCount
  icon?: JSX.Element; // For UI rendering
};

export type ToolsType = Tool & {
  imgSrc?: string; // mapping from imageUrl
};

export type StatsType = Stat;

export type TestimonialsType = {
  name: string;
  role: string;
  image: string;
  text: string;
  link: string;
};

export type LinksType = {
  label: string;
  link: string;
  icon: React.ElementType;
};

export type PublicationType = Publication & {
  URL?: string; // from url
};

export type CertificationType = Certification & {
  awarded?: string; // from awardedBy
  imgSrc?: string; // from imageUrl
};
