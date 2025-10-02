import { request } from "~/lib/request";
import {
    LoginResponseSchema,
    type LoginResponse,
    type RegisterResponse,
    RegisterResponseSchema,
} from "./auth-schema";

const path = "auth/";
const verificationPath = "verification/";
const registrationPath = "registration/step/";

export const login = ({
    emailOrPhoneNumber,
    password,
}: {
    emailOrPhoneNumber: string;
    password: string;
}) =>
    request<LoginResponse>(
        {
            url: path + "login",
            method: "POST",
            data: {
                email: emailOrPhoneNumber,
                password: password,
            },
        },
        LoginResponseSchema
    );

export const registerStepPhone = ({ phoneNumber }: { phoneNumber: string }) =>
    request<RegisterResponse>(
        {
            url: verificationPath + "send",
            method: "POST",
            data: {
                method: "WHATSAPP",
                type: "REGISTRATION",
                no_phone: phoneNumber,
            },
        },
        RegisterResponseSchema
    );

export const registerStepPhoneOtp = ({
    phoneNumber,
    otp,
}: {
    phoneNumber: string;
    otp: string;
}) =>
    request<RegisterResponse>(
        {
            url: registrationPath + "phone-number",
            method: "POST",
            data: {
                phone_number: phoneNumber,
                verification_code: otp,
            },
        },
        RegisterResponseSchema
    );

export const registerStepEmail = ({ email }: { email: string }) =>
    request<RegisterResponse>(
        {
            url: verificationPath + "send",
            method: "POST",
            data: {
                method: "EMAIL",
                type: "REGISTRATION",
                email: email,
            },
        },
        RegisterResponseSchema
    );

export const registerStepEmailOtp = ({
    userId,
    email,
    otp,
}: {
    userId: string;
    email: string;
    otp: string;
}) =>
    request<RegisterResponse>(
        {
            url: registrationPath + "email",
            method: "POST",
            data: {
                user_id: userId,
                email: email,
                verification_code: otp,
            },
        },
        RegisterResponseSchema
    );

export const registerStepPersonalInfo = ({
    userId,
    gender,
    province,
    fullname,
    city,
    password,
    file, // Optional file parameter
}: {
    userId: string;
    gender: string;
    province: string;
    fullname: string;
    city: string;
    password: string;
    file?: File; // Make file optional
}) => {
    // Validate file size before proceeding (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    if (file && file.size > MAX_FILE_SIZE) {
        throw new Error("File size must be less than 10MB");
    }

    // Create FormData object for multipart form
    const formData = new FormData();

    // Append all required fields to FormData
    formData.append("user_id", userId);
    formData.append("gender", gender);
    formData.append("province_id", province);
    formData.append("fullname", fullname);
    formData.append("city_id", city);
    formData.append("password", password);

    // Append the file if it exists and is valid
    if (file && file.size > 0 && file.size <= MAX_FILE_SIZE) {
        formData.append("file", file);
    }

    return request<RegisterResponse>(
        {
            url: registrationPath + "personal-info",
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            // Remove Content-Type header to let browser set it with boundary
        },
        RegisterResponseSchema
    );
};
