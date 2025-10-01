export interface Project {
  id?: string;
  name: string;
  text: {
    en: string;
    uk: string;
  };
  tags: string[];
  imgs?: string[];
  links: { browser?: string; gitHub?: string };
  tools?: { en: string[]; uk: string[] };
  createdAt?: string;
}