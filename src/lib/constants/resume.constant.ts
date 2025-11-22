import {
  type Education,
  type Information,
  type Project,
  SectionType,
  type Skill,
  type WorkExperience,
} from '@/lib/types/resume.type';
import { type Resume } from '@/user/entities/resume.entity';

export const SUB_TITLE_SEED_DATA = 'Professional';

export const OVERVIEW_SEED_DATA =
  'Over 3 years of experience as a developer with strong communication skills and a quick ability to learn and adapt to new technologies. Specializing in Front-end development and Back-end development, with a solid understanding of modern web technologies. Passionate about building scalable, high-performance web applications and continuously improving skills to stay up to date with the latest industry trends.';

export const EDUCATION_SEED_DATA: Array<Education> = [
  {
    school: 'University of Information Technology - VNUHCM',
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    startDate: '2018-09-01',
    endDate: '2022-06-01',
    order: 1,
  },
];

export const RESUME_INFORMATION_SEED_DATA: Array<Information> = [
  {
    label: 'Email',
    value: 'your_email@example.com',
    order: 1,
  },
  {
    label: 'Phone',
    value: '+123 456 7890',
    order: 2,
  },
  {
    label: 'Address',
    value: '123 Main St, City, Country',
    order: 3,
  },
  {
    label: 'LinkedIn',
    value: 'www.linkedin.com/in/dang-tinh-18709528b',
    order: 4,
  },
  {
    label: 'Website',
    value: 'www.yourwebsite.com',
    order: 5,
  },
  {
    label: 'GitHub',
    value: 'github.com/yourusername',
    order: 6,
  },
];

export const SKILL_SEED_DATA: Array<Skill> = [
  {
    label: 'Frontend',
    value: 'React, Next.js, TailwindCSS',
    order: 0,
  },
  { label: 'Backend', value: 'NestJS, Fastify, Prisma, PostgreSQL', order: 1 },
  { label: 'DevOps', value: 'AWS, Docker, ECS Fargate, CI/CD', order: 2 },
  { label: 'AI/ML', value: 'OpenAI API, LangChain, HuggingFace', order: 3 },
];

export const EXPERIENCE_SEED_DATA: Array<WorkExperience> = [
  {
    company: 'Tech Solutions Inc.',
    position: 'Full Stack Developer',
    startDate: '2022-07-01',
    endDate: null,
    description:
      'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to design scalable solutions and improve application performance.',
    order: 1,
  },
  {
    company: 'Web Innovators LLC',
    position: 'Frontend Developer Intern',
    startDate: '2021-06-01',
    endDate: '2021-08-31',
    description:
      'Assisted in the development of user interfaces using HTML, CSS, and JavaScript. Participated in code reviews and contributed to improving the overall user experience of the company website.',
    order: 2,
  },
];

export const PROJECTS_SEED_DATA: Array<Project> = [
  {
    title: 'Task Management System',
    subTitle: 'Cloud-based productivity platform',
    information: [
      { label: 'Tech Stack', value: 'Next.js, NestJS, AWS', order: 1 },
      { label: 'Role', value: 'Lead Developer', order: 2 },
      {
        label: 'Outcome',
        value: 'Improved team productivity by 40%',
        order: 3,
      },
    ],
    order: 1,
  },
  {
    title: 'E-Commerce Platform',
    subTitle: 'Multi-vendor online marketplace',
    information: [
      { label: 'Tech Stack', value: 'React, Node.js, MongoDB', order: 1 },
      { label: 'Role', value: 'Full Stack Developer', order: 2 },
      {
        label: 'Outcome',
        value: 'Enabled 100+ vendors to sell products online',
        order: 3,
      },
    ],
    order: 2,
  },
  {
    title: 'Real-Time Chat App',
    subTitle: 'Cross-platform messaging application',
    information: [
      { label: 'Tech Stack', value: 'Flutter, Firebase', order: 1 },
      { label: 'Role', value: 'Mobile Developer', order: 2 },
      {
        label: 'Outcome',
        value: 'Achieved 10,000+ downloads in 3 months',
        order: 3,
      },
    ],
    order: 3,
  },
  {
    title: 'Portfolio Website',
    subTitle: 'Personal branding and showcase site',
    information: [
      { label: 'Tech Stack', value: 'Next.js, TailwindCSS', order: 1 },
      { label: 'Role', value: 'Designer & Developer', order: 2 },
      {
        label: 'Outcome',
        value: 'Increased freelance inquiries by 60%',
        order: 3,
      },
    ],
    order: 4,
  },
  {
    title: 'IoT Device Dashboard',
    subTitle: 'Monitoring and analytics for smart devices',
    information: [
      { label: 'Tech Stack', value: 'Vue.js, Express, MQTT', order: 1 },
      { label: 'Role', value: 'Backend Developer', order: 2 },
      {
        label: 'Outcome',
        value: 'Reduced device downtime by 25%',
        order: 3,
      },
    ],
    order: 5,
  },
];

export const RESUME_MOCK_DATA: Resume = {
  userId: 'user-12345',
  title: 'Your Name',
  subTitle: 'Web Developer',
  avatar: 'https://avatars.githubusercontent.com/u/000000?v=4',
  overview:
    'A passionate software engineer with 3+ years of experience in building full-stack web applications, specializing in TypeScript, React, and AWS Cloud infrastructure. Proven track record of delivering scalable solutions and leading development teams to success. Seeking to leverage my expertise to contribute to innovative projects and drive technological advancements.',
  information: RESUME_INFORMATION_SEED_DATA,
  section: {
    educations: {
      order: 1,
      type: SectionType.EDUCATION,
      content: EDUCATION_SEED_DATA,
    },
    workExperiences: {
      order: 2,
      type: SectionType.WORK_EXPERIENCE,
      content: EXPERIENCE_SEED_DATA,
    },
    projects: {
      order: 3,
      type: SectionType.PROJECT,
      content: PROJECTS_SEED_DATA,
    },
    skills: {
      order: 4,
      type: SectionType.SKILL,
      content: SKILL_SEED_DATA,
    },
  },
};
