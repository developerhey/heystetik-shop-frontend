import { request } from "~/lib/request";
import { LoginResponseSchema, type LoginResponse } from "./auth-schema";

const path = "auth/";

export const login = (
    { emailOrPhoneNumber, password }: { emailOrPhoneNumber: string; password: string }
) =>
    request<LoginResponse>(
        {
            url: path + "login",
            method: "POST",
            data: {
                email: emailOrPhoneNumber,
                password: password,
            },
        },
        LoginResponseSchema,
    );