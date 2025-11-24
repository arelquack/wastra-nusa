export interface ClothingItem {
  id: string;
  provinceId: string[];
  name: string;
  origin: string;
  description: string;
  imageUrl: string;
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