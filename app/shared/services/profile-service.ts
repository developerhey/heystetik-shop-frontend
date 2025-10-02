import { request } from "~/lib/request";
import {
    UserResponseSchema,
    type UserResponse,
} from "~/shared/schemas/profile-response-schema";
const path = "profile/user";
export const getProfile = (token: string) =>
    request<UserResponse>(
        {
            url: path,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        },
        UserResponseSchema
    );
