
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: Role;
  text: string;
}

export enum AppMode {
  CHAT = 'Chat',
  IMAGE = 'Image',
}

export interface ImageGen {
  src: string;
  prompt: string;
}
