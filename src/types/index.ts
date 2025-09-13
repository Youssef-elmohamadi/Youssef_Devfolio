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
  id: string | number;
  url?: string;
  caption?: string;
  alt?: string;
  content?: string;
  language?: string;
}

export interface Blog {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  banner: {
    url: string;
    alt?: string;
    type: string;
    caption?: string;
  };
  slug: string;
  content?: Block[];
  lang?: string;
}
