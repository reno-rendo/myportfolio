/**
 * Types
 */
import type {
  ExperienceType,
  LinksType,
  ProjectType,
  ServiceType,
  StatsType,
  // TestimonialsType,
  ToolsType,
} from '@/types/index';

/**
 * Assets
 */
import {
  Briefcase,
  Linkedin,
  Github,
  MailPlus,
  FileText,
  Globe,
  Home,
  Layers,
  Mail,
  MessageCircle,
  Palette,
  Settings,
  Smartphone,
  User,
} from 'lucide-react';

const navLinks: LinksType[] = [
  { label: 'Home', link: '#hero', icon: Home },
  {
    label: 'Projects',
    link: '#projects',
    icon: Briefcase,
  },
  { label: 'About', link: '#about', icon: User },
  {
    label: 'Services',
    link: '#services',
    icon: Settings,
  },
  { label: 'Resume', link: '#resume', icon: FileText },
  {
    label: 'Reviews',
    link: '#testimonials',
    icon: MessageCircle,
  },
  { label: 'Contact', link: '#contact', icon: Mail },
];

const socialLinks: LinksType[] = [
  {
    icon: Linkedin,
    label: 'Linkedin',
    link: 'https://www.linkedin.com/in/hafsa-aarifeen/',
  },
  {
    icon: Github,
    label: 'Github',
    link: 'https://github.com/hafsa-aarifeen',
  },
  {
    icon: MailPlus,
    label: 'Email',
    link: 'mailto:hafsafathima016@gmail.com',
  },
];

const projectsData: ProjectType[] = [
  {
    imgSrc: '/images/project1.jpg',
    title: 'Learning Management System',
    desc: 'A comprehensive platform for managing educational courses, assignments, and student progress.',
    tags: ['React.js', 'Java', 'PostgreSQL'],
    projectLink: 'https://github.com/hafsa-aarifeen/LMS-New',
  },
  {
    imgSrc: '/images/portfolio1.jfif',
    title: 'Weather Forecast App',
    desc: 'A web application that provides real-time weather updates and forecasts for any location worldwide.',
    tags: ['React.js', 'REST APIs', 'TailwindCSS'],
    projectLink: 'https://github.com/hafsa-aarifeen/weather-forcast-app',
  },
  {
    imgSrc: '/images/portfolio1.jfif',
    title: 'Recipe App',
    desc: 'A user-friendly app to discover, save, and share recipes with a vast collection of culinary delights.',
    tags: ['Javascript', 'Reactjs', 'Spoonacular-API'],
    projectLink: 'https://github.com/hafsa-aarifeen/Recipe-App',
  },
  {
    imgSrc: '/images/project1.jpg',
    title: 'Content Summarizer',
    desc: 'An AI-powered web app that summarizes lengthy articles into concise and informative summaries.',
    tags: ['React.js', 'Node.js', 'OpenAI API', 'TailwindCSS'],
    projectLink: 'https://mellifluous-dango-9bd778.netlify.app/',
  },
];

const education: ExperienceType[] = [
  {
    year: '2021 - 2025',
    title: 'BSc (Hons) Information Technology',
    institute: 'University of Kelaniya, Sri Lanka',
    desc: 'Studyied software engineering, data structures, web technologies, and applied computing while working on academic projects and research.',
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
    year: '2025 Oct – Present',
    title: 'Software Engineering Intern',
    institute: 'X4 Digital Labs',
    desc: 'Building production-grade UIs using React, Next.js, and Tailwind; handling PR reviews, refactoring work, and feature development in a fast-paced startup environment.',
  },
  {
    year: '2023 Sep - 2024 Mar',
    title: 'Software Engineering Intern',
    institute: 'London Stock Exchange Group (LSEG)',
    desc: 'Collaborated on frontend features and real-time dashboards using React.js, enhancing user experience and data visualization.',
  },
  {
    year: '2023 May – Present',
    title: 'Data Annotator - Team Lead',
    institute:
      ' Data Annotation Project In collaboration with the University of Melbourne and the University of Kelaniya.',
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
    title: 'Full-Stack Application Development',
    desc: 'Building complete web applications from frontend architecture to backend logic, ensuring clean structure, and reliable performance.',
    projects: '35 Projects',
    icon: <Palette className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Web Development',
    desc: 'Building responsive and dynamic websites using modern frameworks like React.js to deliver seamless user experiences.',
    projects: '58 Projects',
    icon: <Globe className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Web Designing',
    desc: 'Creating visually appealing and user-friendly web designs that align with brand identity and enhance user engagement.',
    projects: '47 Projects',
    icon: <Layers className='h-6 w-6 text-green-400' />,
  },
  {
    title: 'Mobile App Design',
    desc: 'Designing intuitive and engaging mobile applications with a focus on user experience and modern design principles.',
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
  // testimonials,
};
