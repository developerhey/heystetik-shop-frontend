import { z } from "zod";
import { BaseResponseDataSchema } from "~/shared/schemas/base-response-schema";

export const RoleSchema = z.object({
    id: z.number().nonnegative().nullish(),
    name: z.string().nullish(),
    code: z.string().nullish(),
    created_by: z.string().nullish(),
    updated_by: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
});

export const UserSchema = z.object({
    id: z.number().nonnegative().nullish(),
    fullname: z.string().nullish(),
    username: z.string().nullish(),
    email: z.string().nullish(),
    password: z.string().nullish(),
    no_phone: z.string().nullish(),
    department: z.string().nullish(),
    gender: z.string().nullish(),
    address: z.string().nullish(),
    photo_profile: z.string().nullish(),
    referral_code: z.string().nullish(),
    user_code: z.string().nullish(),
    roleId: z.number().nonnegative().nullish(),
    verification_code_phone: z.string().nullish(),
    verification_code_email: z.string().nullish(),
    provinceId: z.number().nonnegative().nullish(),
    cityId: z.number().nonnegative().nullish(),
    dob: z.string().nullish(),
    bio: z.string().nullish(),
    finish_register: z.boolean().nullish(),
    verified_email_at: z.string().nullish(),
    verified_phone_at: z.string().nullish(),
    verified_account_at: z.string().nullish(),
    education: z.string().nullish(),
    practice_location: z.string().nullish(),
    join_date: z.string().nullish(),
    title: z.string().nullish(),
    sip: z.string().nullish(),
    str: z.string().nullish(),
    ktp_no: z.string().nullish(),
    ktp_image: z.string().nullish(),
    npwp_no: z.string().nullish(),
    npwp_image: z.string().nullish(),
    specialist: z.string().nullish(),
    rating: z.number().nonnegative().nullish(),
    status_schedule: z.string().nullish(),
    since: z.string().nullish(),
    start: z.string().nullish(),
    until: z.string().nullish(),
    doctor_schedule_status: z.string().nullish(),
    doctor_schedule_resting_start_date: z.string().nullish(),
    doctor_schedule_resting_end_date: z.string().nullish(),
    doctor_schedule_resting_time: z.string().nullish(),
    doctor_schedule_onleave_start_date: z.string().nullish(),
    doctor_schedule_onleave_end_date: z.string().nullish(),
    doctor_schedule_onleave_time: z.string().nullish(),
    is_active: z.boolean().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
    refresh_token: z.string().nullish(),
    role: RoleSchema.nullish(),
});

export const LoginSchema = z
    .object({
        token: z.string().nullish(),
        user: UserSchema.nullish(),
    })
    .nullish();

// ===== Types
export const LoginResponseSchema = BaseResponseDataSchema(LoginSchema);
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export const RegisterResponseSchema = BaseResponseDataSchema(UserSchema);
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleSchema>;
