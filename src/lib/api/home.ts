import { apiFetch } from "./config";

export type Profile = {
  id?: number;
  name: string;
  description: string;
  image_url: string;
  cv_url?: string;
};

export type SocialLink = {
  id: number;
  platform: string;
  url: string;
  platform_name: string;
};

export type HomeProject = {
  id: number;
  title: string;
  description: string;
  github_link: string;
  demo_link: string;
  tags: string[];
  image_url: string;
  created_at: string;
};

export type HomeArticle = {
  id: number;
  title: string;
  excerpt: string;
  feature_image: string;
  date: { raw: string } | string;
  created_at: string;
};

export type HomeData = {
  profile: Profile;
  cv_url?: string;
  SocialLink: SocialLink[];
  Project: HomeProject[];
  Article: HomeArticle[];
};

export async function getHomeData(): Promise<HomeData> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

  const json = await apiFetch(baseUrl, "/api/Home", {
    next: {
      tags: ["home-data"],
      revalidate: 300,
    },
  } as RequestInit & { next: { tags: string[]; revalidate: number } });

  return json.data as HomeData;
}
