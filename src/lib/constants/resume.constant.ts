import { Skill, type Information } from '@/lib/types/resume.type';

export const SUB_TITLE_SEED_DATA = 'Professional';

export const OVERVIEW_SEED_DATA =
  'Over 3 years of experience as a developer with strong communication skills and a quick ability to learn and adapt to new technologies. Specializing in Front-end development and Back-end development, with a solid understanding of modern web technologies. Passionate about building scalable, high-performance web applications and continuously improving skills to stay up to date with the latest industry trends.';

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
