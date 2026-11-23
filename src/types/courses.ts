export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'ongoing' | 'completed';

export interface CourseTag {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
}

export interface CourseCard {
  id: number;
  title: string;
  slug: string;
  slugs?: Record<string, string>;
  available_locales?: string[];
  description: string;
  cover_image: string | null;
  subject: string;
  level: CourseLevel;
  status: CourseStatus;
  is_published: boolean;
  published_at: string | null;
  started_at: string | null;
  lectures_count: number;
  tags: CourseTag[];
  created_at: string;
}

export interface LectureListItem {
  id: number;
  slug: string;
  slugs?: Record<string, string>;
  available_locales?: string[];
  title: string;
  description: string | null;
  order: number;
  reading_time: number;
  views: number;
  is_published: boolean;
  published_at: string | null;
}

export interface CourseDetail extends CourseCard {
  total_reading_time: number;
  lectures: LectureListItem[];
  updated_at?: string;
}

export interface CourseNavigationItem {
  slug: string;
  title: string;
}

export interface LectureCourseMinimal {
  id: number;
  title: string;
  slug: string;
  slugs?: Record<string, string>;
  subject: string;
  level: CourseLevel;
  status: CourseStatus;
  cover_image?: string | null;
}

export interface LectureDetail {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  slugs?: Record<string, string>;
  available_locales?: string[];
  description: string | null;
  content: string;
  order: number;
  reading_time: number;
  views: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  course: LectureCourseMinimal | null;
  previous_lecture: CourseNavigationItem | null;
  next_lecture: CourseNavigationItem | null;
}

export interface AdminCourseCard extends Omit<CourseCard, 'title' | 'slug' | 'description' | 'subject' | 'tags'> {
  title: string | Record<string, string>;
  slug: string | Record<string, string>;
  description: string | Record<string, string>;
  subject: string | Record<string, string>;
  tags: any[];
}

export interface AdminLectureListItem extends Omit<LectureListItem, 'title' | 'slug' | 'description' | 'reading_time'> {
  title: string | Record<string, string>;
  slug: string | Record<string, string>;
  description: string | Record<string, string> | null;
  reading_time: number | Record<string, number>;
}

export interface AdminCourseDetail extends Omit<CourseDetail, 'title' | 'slug' | 'description' | 'subject' | 'tags' | 'lectures'> {
  title: string | Record<string, string>;
  slug: string | Record<string, string>;
  description: string | Record<string, string>;
  subject: string | Record<string, string>;
  tags: any[];
  lectures: AdminLectureListItem[];
}

export interface AdminLectureDetail extends Omit<LectureDetail, 'title' | 'slug' | 'description' | 'content' | 'reading_time' | 'course'> {
  title: string | Record<string, string>;
  slug: string | Record<string, string>;
  description: string | Record<string, string> | null;
  content: string | Record<string, string>;
  reading_time: number | Record<string, number>;
  course: any;
}

export interface FilterItem<T = string> {
  name?: string;
  value?: T;
  label?: string;
  count: number;
}

export interface TagFilterItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface CoursesFilterMetadata {
  subjects: Array<{ name: string; count: number }>;
  tags: TagFilterItem[];
  levels: Array<{ value: CourseLevel; label: string; count: number }>;
  statuses: Array<{ value: CourseStatus; label: string; count: number }>;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
}

export interface CoursesApiResponse {
  data: CourseCard[];
  meta: PaginationMeta;
  links: PaginationLinks;
  filters: CoursesFilterMetadata;
}

export interface CourseQueryParams {
  subject?: string;
  tag?: string;
  level?: string;
  status?: string;
  search?: string;
  sort?: 'latest' | 'oldest' | 'title';
  page?: number;
  per_page?: number;
}
