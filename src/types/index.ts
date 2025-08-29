export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  demoLink: string;
  image: string;
}

interface Block {
  type: string;
  content: string;
  language?: string;
}

export interface Blog {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  content?: Block[];
  lang?: string;
}
