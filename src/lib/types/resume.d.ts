export interface Information {
  _id: string;
  label: string;
  value: string;
  order: number;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date;
  order: number;
}

export interface WorkExperience {
  startDate: Date;
  endDate: Date;
  company: string;
  position: string;
  description: string;
  order: number;
}

export interface Project {
  title: string;
  subTitle: string;
  information: Information[];
  order: number;
}

export interface Skill {
  label: string;
  value: string;
}

export enum SectionType {
  WORK_EXPERIENCE = 'WORK_EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  CERTIFICATIONS = 'CERTIFICATIONS',
  LANGUAGES = 'LANGUAGES',
}

export interface ResumeSection<T> {
  order: number;
  type: SectionType;
  content: T;
}

export interface Section {
  educations: ResumeSection<Array<Education>>;
  workExperiences: ResumeSection<Array<WorkExperience>>;
  projects: ResumeSection<Array<Project>>;
  skills: ResumeSection<Array<Skill>>;
}
