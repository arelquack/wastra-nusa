export interface ClothingItem {
  id: string;
  name: string;
  origin: string;
  description: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  sejarah?: string;
  filosofi?: string;
  konteks?: string;
}

export enum VTOStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}