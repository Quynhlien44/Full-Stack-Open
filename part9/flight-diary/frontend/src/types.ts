export type Visibility = 'great' | 'good' | 'ok' | 'poor';
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';

export interface DiaryEntry {
  id: number;
  date: string;
  visibility: Visibility;
  weather: Weather;
  comment?: string;
}

export interface NewDiaryEntry {
  date: string;
  visibility: Visibility;
  weather: Weather;
  comment: string;
}