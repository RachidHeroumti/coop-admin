export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cooperative {
  id: string;
  name: string;
  founded: Date;
  founder: string;
  phone: string;
  address: string;
  score: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}


export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}