import axios from 'axios';
import { SHA256 } from 'crypto-js';

// Helper to hash with sha256
const sha256 = (value: string) => SHA256(value).toString();

const secureValue = sha256(process.env.REACT_APP_API_SECURE_KEY ?? '');

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY,
  headers: {
    'Content-Type': 'application/json',
    secure_value: secureValue,
  },
  withCredentials: true,
});

export const GET = async <T>(url: string, skipInterceptor = false) => {
  return api.get<T>(url, {
    headers: {
      ...(!skipInterceptor ? {} : { 'Skip-Interceptor': 'true' }),
      secure_value: secureValue,
    },
  });
};

export const POST = async <T>(url: string, data: any) => {
  console.log(api);
  return api.post<T>(url, data);
};

export const PUT = async <T>(url: string, data: any) => {
  return api.put<T>(url, data);
};

export const DELETE = async <T>(url: string) => {
  return api.delete<T>(url);
};

export const PATCH = async <T>(url: string, data: any) => {
  return api.patch<T>(url, data);
};

export const HEAD = async <T>(url: string) => {
  return api.head<T>(url);
};

export const OPTIONS = async <T>(url: string) => {
  return api.options<T>(url);
};
