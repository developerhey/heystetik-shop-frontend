import z from "zod";
import { BaseResponseDataSchema } from "./base-response-schema";

const MediaSchema = z.strictObject({
  id: z.number().int().nonnegative(),
  filename: z.string(),
  ext: z.string(),
  size: z.number().int().nonnegative(),
  mime: z.string(),
  path: z.string(),
  destination: z.string(),
  created_by: z.null(),
  updated_by: z.null(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

const MediaUserProfilePictureSchema = z.strictObject({
  id: z.number().int().nonnegative(),
  media_id: z.number().int().nonnegative(),
  user_id: z.number().int().nonnegative(),
  created_by: z.null(),
  updated_by: z.null(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  media: MediaSchema,
});

const CitySchema = z.strictObject({
  id: z.number().int().nonnegative(),
  name: z.string(),
  provinces_id: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

const ProvinceSchema = z.strictObject({
  id: z.number().int().nonnegative(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

const UserSchema = z.strictObject({
  fullname: z.string(),
  username: z.string(),
  bio: z.string().nullable(),
  id: z.number().int().nonnegative(),
  email: z.string().email(),
  no_phone: z.string(),
  gender: z.string().nullish(),
  dob: z.string().nullable(),
  city: CitySchema.nullish(),
  province: ProvinceSchema.nullish(),
  verified_account_at: z.string().nullable(),
  media_user_profile_picture: MediaUserProfilePictureSchema.nullable(),
  age: z.number().int().nonnegative().nullable(),
});

export const UserResponseSchema = BaseResponseDataSchema(UserSchema);
export type UserUI = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;