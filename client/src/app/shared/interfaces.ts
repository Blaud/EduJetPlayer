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
