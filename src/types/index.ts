export interface Project {
  id?: string;
  name: string;
  text: string;
  tags: string[];
  imgs?: string[];
  links: { browser?: string; gitHub?: string };
  tools?: string[];
  createdAt?: string;
}