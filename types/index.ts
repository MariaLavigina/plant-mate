export interface HotspotData {
  id: number;
  position: { top: string; left: string };
  title: string;
  content: string;
}

export interface Plant {
  id: number;
  name: string;
  description: string;
  traits: number[];
  hotspots: HotspotData[];
}

export interface Trait {
  id: number;
  name: string;
}

export interface QuizAnswer {
  id: number;
  text: string;
  trait_ids: number[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export type SelectedAnswers = { [questionId: number]: number };
