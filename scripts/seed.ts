/**
 * Seed script to migrate data from constants/index.tsx to local SQLite database
 * Run with: npm run db:seed
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/lib/db';

// Database path
const sqlite = new Database('./sqlite.db');
const db = drizzle(sqlite, { schema });

// Data from constants/index.tsx
const projectsData = [
    {
        title: 'National Police Personnel Data Search System',
        description: 'A comprehensive platform for managing educational courses, assignments, and student progress.',
        techStack: ['Html'],
        imageUrl: '/images/project1.jpg',
        repoUrl: 'https://github.com/reno-rendo/npd-search-system',
        category: 'Fullstack',
    },
    {
        title: 'NGSPAM',
        description: 'A web application that provides real-time weather updates and forecasts for any location worldwide.',
        techStack: ['Python'],
        imageUrl: '/images/portfolio1.jfif',
        repoUrl: 'https://github.com/reno-rendo/nglspam-advence',
        category: 'Backend',
    },
    {
        title: 'Travel app design',
        description: 'A user-friendly app to discover, save, and share recipes with a vast collection of culinary delights.',
        techStack: ['Figma'],
        imageUrl: '/images/ui.jpg',
        liveUrl: 'https://www.instagram.com/p/DKbWtohh5y3/',
        category: 'Design',
    },
    {
        title: 'Mamuli modern design',
        description: 'An AI-powered web app that summarizes lengthy articles into concise and informative summaries.',
        techStack: ['Figma'],
        imageUrl: '/images/ui1.jpg',
        liveUrl: 'https://www.instagram.com/p/DKNSdGGBBlu/',
        category: 'Design',
    },
];

const experienceData = [
    {
        type: 'education',
        year: '2023 - Present',
        title: 'Computer Science',
        institute: 'Widya Mandira Catholic University Kupang',
        description: 'Studying various aspects of computers and information technology, ranging from programming, algorithms, databases, to networks and information systems.',
    },
    {
        type: 'work',
        year: '2025 Aug - 2025 Oct',
        title: 'ADMINISTRASI & DOKUMENTASI',
        institute: "PAUD Vi'a Dolorosa Tulun Tuan",
        description: 'Manage and organize accreditation documents, ensure the completeness of administrative files, and collaborate with school administrators in verification.',
    },
    {
        type: 'work',
        year: '2024 Aug – 2024 Nov',
        title: 'Data Annotator - Team Lead',
        institute: 'Data Annotation Project - Widya Mandira Catholic University Kupang',
        description: 'Led a team in developing AI-driven solutions for optimizing recycling processes through data annotation and preprocessing.',
    },
];

const publicationsData = [
    {
        title: "The Impact of the Internet on Teenagers' Social Behavior (Case Study: Boarding House Environment)",
        conference: '2025 5th International Conference on Advanced Research in Computing (ICARC)',
        url: 'https://jptam.org/index.php/jptam/article/view/18313',
        description: 'This study shows that the internet makes teenagers more open in their interactions, but also puts them at risk of addiction and isolation.',
    },
    {
        title: 'Agent-Based Modeling of Surplus Food Management: A Social Entrepreneurship Approach to Reducing Waste and Enhancing Sustainability',
        conference: '2025 International Conference on Multidisciplinary Research (ICMR)',
        description: 'Explores the integration of social entrepreneurship and agent-based modeling to address food waste and food insecurity.',
    },
];

const certificationsData = [
    {
        title: 'React',
        awardedBy: 'Meta Front-End Developer Certificate',
        credentials: 'https://www.coursera.org/account/accomplishments/certificate/84DLDPE8QE5T',
        imageUrl: '/images/cert/meta.svg',
    },
    {
        title: 'Oracle Database 19c: Advanced SQL',
        awardedBy: 'LinkedIn',
        credentials: 'https://www.linkedin.com/learning/certificates/cc1c76a8f2f0456c528048d6e57eee2608ea2ea29e2dd016cab152c621f03600',
        imageUrl: '/images/cert/linkedin.svg',
    },
    {
        title: 'Java Certification Course',
        awardedBy: 'Simplilearn',
        credentials: 'https://simpli-web.app.link/e/j784W2jSrYb',
        imageUrl: '/images/cert/simplilearn.png',
    },
    {
        title: 'Postman API Fundamentals Student Expert',
        awardedBy: 'Postman',
        credentials: 'https://badges.parchment.com/public/assertions/FNw6FkwfSwWucjgpDXotew',
        imageUrl: '/images/tools/postman.svg',
    },
    {
        title: 'AWS Essential Training for Developers',
        awardedBy: 'LinkedIn',
        credentials: 'https://www.linkedin.com/learning/certificates/d98390268336b33c2d2112db75aa763b7d10c8bb9647cdf097b5c29169d8b59f',
        imageUrl: '/images/cert/linkedin.svg',
    },
    {
        title: 'Agile Software Development',
        awardedBy: 'Project Management Institute',
        credentials: 'https://www.linkedin.com/learning/certificates/ca01f19db59308edceeab104b7aa896a8baa04e8e34e6748221b639eaf82850a',
        imageUrl: '/images/cert/pmi.png',
    },
    {
        title: 'Foundation of Project Management',
        awardedBy: 'Google Project Management: Professional Certificate',
        credentials: 'https://coursera.org/share/b88c85f2971ce9aed3304664ede4c950',
        imageUrl: '/images/cert/google.svg',
    },
];

async function seed() {
    console.log('🌱 Starting seed...\n');

    // Seed Projects
    console.log('📁 Seeding projects...');
    for (const project of projectsData) {
        await db.insert(schema.projects).values(project);
    }
    console.log(`   ✅ ${projectsData.length} projects added\n`);

    // Seed Experience
    console.log('💼 Seeding experience...');
    for (const exp of experienceData) {
        await db.insert(schema.experience).values(exp);
    }
    console.log(`   ✅ ${experienceData.length} experience entries added\n`);

    // Seed Publications
    console.log('📚 Seeding publications...');
    for (const pub of publicationsData) {
        await db.insert(schema.publications).values(pub);
    }
    console.log(`   ✅ ${publicationsData.length} publications added\n`);

    // Seed Certifications
    console.log('🎖️ Seeding certifications...');
    for (const cert of certificationsData) {
        await db.insert(schema.certifications).values(cert);
    }
    console.log(`   ✅ ${certificationsData.length} certifications added\n`);

    console.log('✨ Seed completed successfully!');
    sqlite.close();
    process.exit(0);
}

seed().catch((e) => {
    console.error('❌ Seed failed:', e);
    sqlite.close();
    process.exit(1);
});
