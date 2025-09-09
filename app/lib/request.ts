import api from "./api";
import { type AxiosRequestConfig } from "axios";
import { type ZodType } from "zod";

export async function request<T>(
  config: AxiosRequestConfig,
  schema?: ZodType<T>
): Promise<T> {
  const response = await api.request<T>(config);

  if (schema) {
    const parsed = schema.safeParse(response.data);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      throw new Error("API response validation failed");
    }
    return parsed.data;
  }

  return response.data;
}
