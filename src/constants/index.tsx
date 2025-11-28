/**
 * Types
 */
import type {
  ExperienceType,
  LinksType,
  ProjectType,
  PublicationType,
  ServiceType,
  StatsType,
  CertificationType,
  // TestimonialsType,
  ToolsType,
} from '@/types/index';

/**
 * Assets
 */
import {
  Linkedin,
  Github,
  MailPlus,
  FileText,
  Globe,
  Home,
  Layers,
  Mail,
  Palette,
  Settings,
  Smartphone,
  User,
  Trophy,
  FolderOpen,
} from 'lucide-react';

const navLinks: LinksType[] = [
  { label: 'Home', link: '#hero', icon: Home },
  {
    label: 'Projects',
    link: '#projects',
    icon: FolderOpen,
  },
  { label: 'About', link: '#about', icon: User },
  {
    label: 'Services',
    link: '#services',
    icon: Settings,
  },
  { label: 'Resume', link: '#resume', icon: FileText },
  {
    label: 'Achievements',
    link: '#achievements',
    icon: Trophy,
  },
  { label: 'Contact', link: '#contact', icon: Mail },
];

const socialLinks: LinksType[] = [
  {
    icon: Linkedin,
    label: 'Linkedin',
    link: 'https://www.linkedin.com/in/reno-rendo-073034304/',
  },
  {
    icon: Github,
    label: 'Github',
    link: 'https://github.com/reno-rendo',
  },
  {
    icon: MailPlus,
    label: 'Email',
    link: 'ggrignionrendo@gmail.com',
  },
];

const projectsData: ProjectType[] = [
  {
    imgSrc: '/images/project1.jpg',
    title: 'National Police Personnel Data Search System',
    desc: 'A comprehensive platform for managing educational courses, assignments, and student progress.',
    tags: ['Html'],
    projectLink: 'https://github.com/reno-rendo/npd-search-system',
  },
  {
    imgSrc: '/images/portfolio1.jfif',
    title: 'NGSPAM',
    desc: 'A web application that provides real-time weather updates and forecasts for any location worldwide.',
    tags: ['python'],
    projectLink: 'https://github.com/reno-rendo/nglspam-advence',
  },
  {
    imgSrc: '/images/ui.jpg',
    title: 'Travel app design',
    desc: 'A user-friendly app to discover, save, and share recipes with a vast collection of culinary delights.',
    tags: ['Figma'],
    projectLink: 'https://www.instagram.com/p/DKbWtohh5y3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    imgSrc: '/images/ui1.jpg',
    title: 'Mamuli modern design',
    desc: 'An AI-powered web app that summarizes lengthy articles into concise and informative summaries.',
    tags: ['Figma'],
    projectLink: 'https://www.instagram.com/p/DKNSdGGBBlu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
];

const education: ExperienceType[] = [
  {
    year: '2023 - Present',
    title: 'Computer Science',
    institute: 'Widya Mandira Catholic University Kupang',
    desc: 'studying various aspects of computers and information technology, ranging from programming, algorithms, databases, to networks and information systems to prepare students to become IT professionals.',
  },
  // {
  //   year: '2021 – 2022',
  //   title: 'Frontend Development Bootcamp',
  //   institute: 'Udemy / Online Course',
  //   desc: 'Learned modern JavaScript, React, and responsive UI patterns through real-world projects.',
  // },
  // {
  //   year: '2023',
  //   title: 'Advanced UI/UX Design Course',
  //   institute: 'Design+Code',
  //   desc: 'Explored advanced design systems, motion design, and accessibility best practices.',
  // },
];

const experience: ExperienceType[] = [
  {
    year: '2025 Agu - 2025 Oct',
    title: 'ADMINISTRASI & DOKUMENTASI',
    institute: "PAUD Vi'a Dolorosa Tulun Tuan",
    desc: 'Manage and organize accreditation documents, ensure the completeness of administrative files, and collaborate with school administrators in verification.',
  },
  {
    year: '2024 Agu – 2024 Nov',
    title: 'Data Annotator - Team Lead',
    institute:
      ' Data Annotation Project In collaboration with the Widya Mandira Catholic University Kupang.',
    desc: 'Led a team in developing AI-driven solutions for optimizing recycling processes through data annotation and preprocessing.',
  },
  // {
  //   year: '2023 Dec – Present',
  //   title: 'Freelance Developer',
  //   institute: 'Remote.',
  //   desc: 'Designed and developed full-stack projects including LMS platforms, weather apps, and custom UI components using Java, React, PostgreSQL, and cloud tools.',
  // },
];

const tools: ToolsType[] = [
  {
    label: 'React',
    imgSrc: '/images/tools/react.svg',
  },
  // {
  //   label: 'Next.js',
  //   imgSrc: '/images/tools/icons8-nextjs(1).svg',
  // },
  {
    label: 'TypeScript',
    imgSrc: '/images/tools/typescript.svg',
  },
  {
    label: 'JavaScript',
    imgSrc: '/images/tools/javascript.svg',
  },
  {
    label: 'Tailwind CSS',
    imgSrc: '/images/tools/tailwindcss.svg',
  },
  {
    label: 'Node.js',
    imgSrc: '/images/tools/nodejs.svg',
  },
  {
    label: 'Java',
    imgSrc: '/images/tools/java.svg',
  },
  {
    label: 'spring Boot',
    imgSrc: '/images/tools/springboot.svg',
  },
  {
    label: 'Python',
    imgSrc: '/images/tools/python.svg',
  },
  {
    label: 'Express.js',
    imgSrc: '/images/tools/expressjs.svg',
  },
  {
    label: 'PostgreSQL',
    imgSrc: '/images/tools/postgres.svg',
  },
  {
    label: 'MySQL',
    imgSrc: '/images/tools/mysql.svg',
  },
  {
    label: 'Mongodb',
    imgSrc: '/images/tools/mongodb.svg',
  },
  {
    label: 'AWS',
    imgSrc: '/images/tools/aws.svg',
  },
  {
    label: 'GitHub',
    imgSrc: '/images/tools/github.svg',
  },
  {
    label: 'Postman',
    imgSrc: '/images/tools/postman.svg',
  },
];

const services: ServiceType[] = [
  {
    title: 'Full-Stack Development',
    desc: 'I build complete features end to end, covering frontend, backend, APIs and deployment. My focus is delivering working functionality that holds up in real use.',
    projects: '35 Projects',
    icon: <Palette className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Frontend Engineering',
    desc: 'I implement smooth, consistent user interfaces using React and TypeScript. I care about clean structure, predictable behavior and components that scale with the project.',
    projects: '58 Projects',
    icon: <Globe className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Backend Engineering',
    desc: 'I design clear data models and implement reliable server logic in Java or Node. I create REST APIs that stay easy to maintain and easy for the frontend to consume.',
    projects: '47 Projects',
    icon: <Layers className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Database and Data Workflows',
    desc: 'I work with SQL databases, write optimized queries and handle the data layer so the application performs well and stays stable as it grows.',
    projects: '21 Projects',
    icon: <Smartphone className='h-6 w-6 text-green-400' />,
  },

  // {
  //   title: 'Product Launch Strategy',
  //   desc: 'Helping startups prepare their digital products for launch with design systems, marketing pages, and assets.',
  //   projects: '15 Projects',
  //   icon: <Rocket className='h-6 w-6 text-green-400' />,
  // },
];

const publications: PublicationType[] = [
  {
    title:
      "The Impact of the Internet on Teenagers' Social Behavior (Case Study: Boarding House Environment)",
    conference:
      '2025 5th International Conference on Advanced Research in Computing (ICARC)',
    URL: 'https://jptam.org/index.php/jptam/article/view/18313',
    description:
      'This study shows that the internet makes teenagers more open in their interactions, but also puts them at risk of addiction and isolation; supervision and digital education are needed to minimize negative impacts and maximize positive benefits.',
  },


  {
    title:
      'Agent-Based Modeling of Surplus Food Management: A Social Entrepreneurship Approach to Reducing Waste and Enhancing Sustainability',
    conference:
      '2025 International Conference on Multidisciplinary Research (ICMR)',
    // URL: 'https://jptam.org/index.php/jptam/article/view/18313',
    description:
      'Explores the integration of social entrepreneurship and agent-based modeling to address food waste and food insecurity.',
  },
];

const certifications: CertificationType[] = [
  {
    title: 'React',
    awarded: 'Meta Front-End Developer Certificate',
    credentials:
      'https://www.coursera.org/account/accomplishments/certificate/84DLDPE8QE5T',
    imgSrc: '/images/cert/meta.svg',
  },
  {
    title: 'Oracle Database 19c: Advanced SQL',
    awarded: ' LinkedIn',
    credentials:
      'https://www.linkedin.com/learning/certificates/cc1c76a8f2f0456c528048d6e57eee2608ea2ea29e2dd016cab152c621f03600?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3Bq785pZPJRoyT3yw7FwhJbg%3D%3D',
    imgSrc: '/images/cert/linkedin.svg',
  },
  {
    title: 'Java Certification Course',
    awarded: 'Simplilearn',
    credentials: 'https://simpli-web.app.link/e/j784W2jSrYb',
    imgSrc: '/images/cert/simplilearn.png',
  },
  {
    title: ' Postman API Fundamentals Student Expert',
    awarded: 'Postman',
    credentials:
      'https://badges.parchment.com/public/assertions/FNw6FkwfSwWucjgpDXotew?identity__email=hafsama-im19042@stu.kln.ac.lk',
    imgSrc: '/images/tools/postman.svg',
  },
  {
    title: ' AWS Essential Training for Developers',
    awarded: 'LinkedIn',
    credentials:
      'https://www.linkedin.com/learning/certificates/d98390268336b33c2d2112db75aa763b7d10c8bb9647cdf097b5c29169d8b59f?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3Bq785pZPJRoyT3yw7FwhJbg%3D%3D',
    imgSrc: '/images/cert/linkedin.svg',
  },

  {
    title: 'Agile Software Development',
    awarded: 'Project Management Institute',
    credentials:
      'https://www.linkedin.com/learning/certificates/ca01f19db59308edceeab104b7aa896a8baa04e8e34e6748221b639eaf82850a?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3Bq785pZPJRoyT3yw7FwhJbg%3D%3D',
    imgSrc: '/images/cert/pmi.png',
  },
  {
    title: ' Foundation of Project Management',
    awarded: 'Google Project Management: Professional Certificate',
    credentials: 'https://coursera.org/share/b88c85f2971ce9aed3304664ede4c950',
    imgSrc: '/images/cert/google.svg',
  },
  // {
  //   title: ' Using Python for Automation',
  //   awarded: 'LinkedIn',
  //   credentials:
  //     'https://www.linkedin.com/learning/certificates/b1b8c891434f3b4e1d6f1e35e693498e803edab7ff10ad37e65eb480fe8212c1?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3Bq785pZPJRoyT3yw7FwhJbg%3D%3D',
  //   imgSrc: '/images/cert/linkedin.svg',
  // },
  // {
  //   title: 'DevOps Foundations: CD/CI',
  //   awarded: 'National Association of State Boards of Accountancy (NASBA)',
  //   credentials:
  //     'https://www.linkedin.com/learning/certificates/30763542e9c7f26d9b1ccc544231dd908b8210e7605cf7b74747658eb216e202?trk=share_certificate',
  //   imgSrc: '/images/cert/nasba.png',
  // },
  // {
  //   title: 'AI Master Class',
  //   awarded: 'Pantech.AI',
  //   credentials:
  //     'https://drive.google.com/file/d/1rR1t2VsGpbBifNqxws_9ABZ6J_Bt6S8N/view',
  //   imgSrc: '/images/cert/pantech.png',
  // },
];

const statsData: StatsType[] = [
  // {
  //   number: '05+',
  //   label: 'Happy Clients',
  // },
  {
    number: '02+',
    label: 'Years Of Experience',
  },
  {
    number: '10+',
    label: 'Projects Done',
  },
];

// const testimonials: TestimonialsType[] = [
//   {
//     name: 'Alex Tomato',
//     role: 'Brand Manager at Instant Design',
//     image: 'https://randomuser.me/api/portraits/men/32.jpg',
//     text: 'Working with David was an absolute pleasure. His attention to detail, creative insights, and ability to translate complex ideas into stunning visuals truly set him apart. He consistently went above and beyond to ensure the project exceeded expectations.',
//     link: '#',
//   },
//   {
//     name: 'Sara Bloom',
//     role: 'Founder at Bloom Agency',
//     image: 'https://randomuser.me/api/portraits/women/65.jpg',
//     text: 'David brought my brand vision to life better than I could have imagined. He is not only professional and highly skilled but also incredibly responsive and collaborative. Every aspect of the project was handled with precision and creativity.',
//     link: '#',
//   },
//   {
//     name: 'John Park',
//     role: 'CEO at PixelFlow',
//     image: 'https://randomuser.me/api/portraits/men/45.jpg',
//     text: 'From UI/UX design to front-end implementation, David handled every detail flawlessly. His problem-solving skills, innovative approach, and dedication made the entire process smooth and enjoyable. I would highly recommend him for any design-driven project.',
//     link: '#',
//   },
// ];

export {
  socialLinks,
  projectsData,
  education,
  experience,
  tools,
  services,
  navLinks,
  statsData,
  publications,
  certifications,
  // testimonials,
};
