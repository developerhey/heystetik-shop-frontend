import { request } from "~/lib/request";
import {
    type AddressDataResponse,
    AddressDataResponseSchema,
    type AddressListResponse,
    AddressListResponseSchema,
} from "../schemas/address-response.schema";
import type { AddAddressParam } from "../schemas/address-param-schema";
const path = "user-address";

export const getUserAddress = (token: string) => {
    return request<AddressListResponse>(
        {
            url: path,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddressListResponseSchema
    );
};

export const addUserAddress = ({
    token,
    param,
}: {
    token: string;
    param: AddAddressParam;
}) => {
    return request<AddressDataResponse>(
        {
            url: path,
            method: "POST",
            data: {
                recipient_name: param.fullName,
                recipient_phone: param.phoneRecepient,
                province: param.province,
                city: param.city,
                subdistrict: param.subdistrict,
                zip_code: param.zipCode.toString(),
                pinpoint_latitude: param.lat,
                pinpoint_longitude: param.lng,
                pinpoint_address: param.pinpointAddress,
                complete_address: param.fullAddress,
                label_address: param.labelAddress,
                note_for_courier: param.notes,
                main_address: true,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddressDataResponseSchema
    );
};

export const updateUserAddress = ({
    token,
    param,
    id,
}: {
    token: string;
    param: AddAddressParam;
    id: string;
}) => {
    return request<AddressDataResponse>(
        {
            url: path + "/" + id,
            method: "PATCH",
            data: {
                recipient_name: param.fullName,
                recipient_phone: param.phoneRecepient,
                province: param.province,
                city: param.city,
                subdistrict: param.subdistrict,
                zip_code: param.zipCode.toString(),
                pinpoint_latitude: param.lat,
                pinpoint_longitude: param.lng,
                pinpoint_address: param.pinpointAddress,
                complete_address: param.fullAddress,
                label_address: param.labelAddress,
                note_for_courier: param.notes,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddressDataResponseSchema
    );
};

export const setMainAddress = ({
    token,
    id,
}: {
    token: string;
    id: string;
}) => {
    return request<AddressDataResponse>(
        {
            url: path + "/" + id,
            method: "PATCH",
            data: {
                main_address: true,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddressDataResponseSchema
    );
};

export const deleteUserAddress = ({
    token,
    id,
}: {
    token: string;
    id: string;
}) => {
    return request<AddressDataResponse>(
        {
            url: path + "/" + id,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        AddressDataResponseSchema
    );
};
