import axios from 'axios';
import { Response } from '../models/response';

const secureValue = process.env.REACT_APP_API_SECURE_KEY ?? '';

export const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_GATEWAY ??
    'https://apigateway-dev.djbeatblaster.com/',
  headers: {
    'Content-Type': 'application/json',
    secure_value: secureValue,
  },
  withCredentials: true,
});

export const GET = async <T>(url: string, skipInterceptor = false) => {
  return api.get<Response<T>>(url, {
    headers: {
      ...(!skipInterceptor ? {} : { 'Skip-Interceptor': 'true' }),
      secure_value: secureValue,
    },
  });
};

export const POST = async <T>(url: string, data: any) => {
  console.log(api);
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
