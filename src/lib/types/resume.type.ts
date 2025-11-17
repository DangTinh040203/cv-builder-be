export interface Information {
  label: string;
  value: string;
  order: number;
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: Date;
  endDate: Date | null;
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
  order: number;
}

export enum SectionType {
  WORK_EXPERIENCE = 'WORK_EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILL = 'SKILL',
  PROJECT = 'PROJECT',
  CERTIFICATION = 'CERTIFICATION',
  LANGUAGE = 'LANGUAGE',
}

export class ResumeSection<T> {
  order: number;
  type: SectionType;
  content: T;

  constructor(order: number, type: SectionType, content: T) {
    this.order = order;
    this.type = type;
    this.content = content;
  }
}

export interface Section {
  educations: ResumeSection<Array<Education>>;
  workExperiences: ResumeSection<Array<WorkExperience>>;
  projects: ResumeSection<Array<Project>>;
  skills: ResumeSection<Array<Skill>>;
}
