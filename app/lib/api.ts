import axios, { AxiosError, type AxiosInstance } from "axios";

export interface ApiError {
    status: number;
    message: string;
    isMobile: boolean;
    data?: {
        success?: boolean;
        message?: string;
        error?: string;
        data?: any;
    };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const customError: ApiError = {
            status: error.response?.status || 500,
            message: (error.response?.data as any)?.message || error.message,
            data: error.response?.data as any,
        };
        return Promise.reject(customError);
    }
);

export default api;
