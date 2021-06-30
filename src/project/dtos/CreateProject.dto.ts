export class CreateProjectDTO {
  title: string;
  description: string;
  icon: string;

  website?: string;
  github?: string;
  npmjs?: string;

  hero: string;
  thumbnail: string;

  displayOnHome: boolean;

  designTools: string[];
  frameworks: string[];
  development: string[];
}
