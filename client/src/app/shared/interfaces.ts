import { IDRMLicenseServer } from 'videogular2/streaming';
export interface User {
  email: string;
  password: string;
  lastlang?: string;
  imageSrc?: string;
  lastDeckName?: string;
  lastModelName?: string;
  lastVideos?: [
    {
      fulltitle: {
        type: String;
      };
      webpage_url: {
        type: String;
      };
      thumbnail: {
        type: String;
      };
    }
  ];
  _id?: string;
}
export interface Message {
  message: string;
}

export interface TextToTranslate {
  from?: string;
  to: string;
  text: string;
}

export interface SimpleCard {
  answer: string;
  question: string;
  deckName: string;
  modelName: string;
  fieldOrder: number;
  fields: {
    Front: { value: string; order: string };
    Back: { value: string; order: string };
  };
  css: string;
  cardId: string;
  interval: number;
  note: string;
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
  youtubeLink?: string;
}

export interface ITrack {
  kind: string;
  label: string;
  src: string;
  srclang: string;
}
