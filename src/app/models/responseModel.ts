export interface ResponseModel<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: {
    googleId: string,
    name: string,
    email: string,
    picture: string,
  };
  message: string;
}

export interface User {
  googleId: string,
  name: string,
  email: string,
  picture: string,
}



