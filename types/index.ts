export interface MAProfile {
  id: number;
  name: string;
  join_date: string;
  latest_rotation: string;
  photo_path: string | null;
  sort_order: number | null;
  tags?: string[] | null;
}

export interface SlideContent {
  id: number;
  slide_id: string;
  title: string | null;
  video_url_1: string | null;
  video_url_2: string | null;
  video_url_3: string | null;
}

export interface PresentationSlideData {
  slideNumber: number;
  presenter: string;
  rotationTitle: string;
  rotationNumber: string;
  maId: number;
}

export interface AppState {
  currentSlide: number;
  editMode: boolean;
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setEditMode: (val: boolean) => void;
  totalSlides: number;
}
