import axios, { AxiosError, type AxiosInstance } from "axios";
import * as AxiosLogger from "axios-logger";

export interface ApiError {
    status: number;
    message: string;
    data?: {
        success?: boolean;
        message?: string;
        error?: string;
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

// api.interceptors.request.use((request) => {
//     // write down your request intercept.
//     return AxiosLogger.requestLogger(request, {
//         prefixText: "your prefix",
//         dateFormat: "HH:MM:ss",
//         headers: true,
//         params: true,
//         url: true
//     });
// });

// Request interceptor to automatically add auth token
// api.interceptors.request.use(
//     async (config) => {
//         try {
//             console.log(config.headers)
//             // For server-side requests, get session from cookies
//             if (typeof window === "undefined" && config.headers?.getCookie) {
//                 const cookieHeader = config.headers.getCookie as string;
//                 console.log("token")
//                 if (cookieHeader) {
//                     const session = await getSession(cookieHeader);
//                     const token = session.get("access_token");
//                     if (token) {
//                         config.headers.Authorization = `Bearer ${token}`;
//                         console.log("token", token)
//                     }
//                 }
//             }
//             // For client-side, token will be attached via cookie automatically
//             return config;
//         } catch (error) {
//             return Promise.reject(error);
//         }
//     },
//     (error) => Promise.reject(error)
// );

// api.interceptors.request.use((request) => {
//     // write down your request intercept.
//     return AxiosLogger.requestLogger(request, {
//         prefixText: 'your prefix',
//         dateFormat: 'HH:MM:ss',
//         headers: true,
//     });
// });
// api.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const customError: ApiError = {
            status: error.response?.status || 500,
            message: (error.response?.data as any)?.message || error.message,
            data: error.response?.data,
        };
        return Promise.reject(customError);
    }
);

export default api;
