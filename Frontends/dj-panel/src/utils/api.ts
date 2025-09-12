import axios from 'axios';
import { Response } from '../models/api/response';

// Ensure required env variables are present
const baseURL = process.env.REACT_APP_API_GATEWAY;
const secureValue = process.env.REACT_APP_API_SECURE_KEY;

if (!baseURL) {
  throw new Error('REACT_APP_API_GATEWAY environment variable is not set');
}
if (!secureValue) {
  throw new Error('REACT_APP_API_SECURE_KEY environment variable is not set');
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    secure_key: secureValue, // Use the hashed value
  },
  withCredentials: true,
});

export const GET = async <T>(url: string, skipInterceptor = false) => {
  return api.get<Response<T>>(url, {
    headers: {
      ...(!skipInterceptor ? {} : { 'Skip-Interceptor': 'true' }),
      secure_key: secureValue, // Use the hashed value
    },
  });
};

export const POST = async <T>(url: string, data: any) => {
  return api.post<Response<T>>(url, data);
};

export const PUT = async <T>(url: string, data: any) => {
  return api.put<Response<T>>(url, data);
};

export const DELETE = async <T>(url: string) => {
  return api.delete<Response<T>>(url);
};

export const PATCH = async <T>(url: string, data: any) => {
  return api.patch<Response<T>>(url, data);
};

export const HEAD = async <T>(url: string) => {
  return api.head<Response<T>>(url);
};

export const OPTIONS = async <T>(url: string) => {
  return api.options<Response<T>>(url);
};
