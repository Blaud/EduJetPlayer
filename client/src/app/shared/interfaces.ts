import { IDRMLicenseServer } from 'videogular2/streaming';
export interface User {
  email: string;
  password: string;
  lastlang?: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}

export interface Message {
  message: string;
}

export interface Position {
  name: string;
  cost: number;
  user?: string;
  category: string;
  _id?: string;
}

export interface TextToTranslate {
  from: string;
  to: string;
  text: string;
}

export interface ICuePoint {
  id: string;
  title: string;
  description: string;
  src: string;
  href: string;
}

export interface IMediaStream {
  type: 'vod' | 'dash' | 'hls';
  source: string;
  label: string;
  token?: string;
  licenseServers?: IDRMLicenseServer;
}
