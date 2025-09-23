export interface Project {
  name: string;
  text: string;
  tags: string[];
  imgs?: string;
  links?: { browser?: string; gitHub?: string };
  tools?: string[];
}