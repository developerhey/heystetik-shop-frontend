import { useState, useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import {
    AddAddressParamSchema,
    type AddAddressParam,
    type AddressField,
} from "../schemas/address-param-schema";
import { useDialogStore } from "~/shared/stores/useDialogStore";
interface AddressState {
    step: "MAP" | "FORM";
    values: AddAddressParam;
    errors: Partial<Record<AddressField, string>>;
    loading: boolean;
    success?: boolean;
    open: boolean;
    isEdit: boolean; // Add this flag
    editId?: string; // Add ID for editing
}

interface UseAddressDialogReturn extends AddressState {
    setStep: (step: "MAP" | "FORM") => void;
    setValue: (field: AddressField, value: string | number) => void;
    setError: (field: AddressField, msg?: string) => void;
    validateField: (field: AddressField) => boolean;
    clearErrors: () => void;
    handleMapComplete: (address: {
        lat: number;
        lng: number;
        formattedAddress: string;
    }) => void;
    handleFormSubmit: () => void;
    setEditData: (data: AddAddressParam & { id?: string }) => void; // New method for edit
    reset: () => void; // New method to reset
    handleDelete: (id: string) => void;
    handleSetMainAddress: (id: string) => void;
}

const initialState: AddressState = {
    step: "FORM",
    values: {
        lat: 0,
        lng: 0,
        pinpointAddress: "",
        fullName: "",
        city: "",
        province: "",
        subdistrict: "",
        phoneRecepient: "",
        zipCode: 0,
        labelAddress: "",
        fullAddress: "",
        notes: "",
    },
    loading: false,
    errors: {},
    success: false,
    open: false,
    isEdit: false, // Default to create mode
    editId: undefined,
};

export const useAddressDialog = (): UseAddressDialogReturn => {
    const [state, setState] = useState<AddressState>(initialState);
    const fetcher = useFetcher();
    const { setOpenAddressDialog } = useDialogStore();

    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    useEffect(() => {
        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }

        if (fetcher.data?.success && !loading) {
            toast.success(
                fetcher.data.message ||
                    (state.isEdit
                        ? "Address updated successfully!"
                        : "Address added successfully!"),
                { duration: 1500 }
            );

            // Close dialog and revalidate data
            setOpenAddressDialog(false);

            // Reset state for next use
            setState(initialState);
        }
    }, [fetcher.data, loading]);

    // Add new method to set edit data
    const setEditData = useCallback(
        (data: AddAddressParam & { id?: string }) => {
            setState((prev) => ({
                ...prev,
                values: {
                    lat: data.lat || 0,
                    lng: data.lng || 0,
                    pinpointAddress: data.pinpointAddress || "",
                    fullName: data.fullName || "",
                    city: data.city || "",
                    province: data.province || "",
                    subdistrict: data.subdistrict || "",
                    phoneRecepient: data.phoneRecepient || "",
                    zipCode: data.zipCode || 0,
                    labelAddress: data.labelAddress || "",
                    fullAddress: data.fullAddress || "",
                    notes: data.notes || "",
                },
                isEdit: !!data.id,
                editId: data.id,
                step: "FORM", // Start with form when editing
            }));
        },
        []
    );

    // Add reset method
    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    const setStep = useCallback((step: "MAP" | "FORM") => {
        setState((prev) => ({ ...prev, step }));
    }, []);

    const setValue = useCallback(
        (field: AddressField, value: string | number) => {
            setState((prev) => ({
                ...prev,
                values: {
                    ...prev.values,
                    [field]: value,
                },
                errors: {
                    ...prev.errors,
                    [field]: undefined,
                },
            }));
        },
        []
    );

    const setError = useCallback((field: AddressField, msg?: string) => {
        setState((prev) => ({
            ...prev,
            errors: {
                ...prev.errors,
                [field]: msg,
            },
        }));
    }, []);

    const clearErrors = useCallback(() => {
        setState((prev) => ({ ...prev, errors: {} }));
    }, []);

    const validateField = useCallback(
        (field: AddressField): boolean => {
            const schemaShape = AddAddressParamSchema.shape as Record<
                string,
                any
            >;

            if (field in schemaShape) {
                const validator = schemaShape[field];
                const fieldValue =
                    state.values[field as keyof typeof state.values];

                try {
                    const result = validator.safeParse(fieldValue);

                    if (!result.success) {
                        const errorMessage =
                            result.error.errors[0]?.message ||
                            `Invalid ${field}`;
                        setError(field, errorMessage);
                        return false;
                    }

                    setError(field, undefined);
                    return true;
                } catch (error) {
                    setError(field, `Validation error for ${field}`);
                    return false;
                }
            }

            setError(field, `Field ${field} is not valid`);
            return false;
        },
        [state.values, setError]
    );

    const handleMapComplete = useCallback(
        (address: { lat: number; lng: number; formattedAddress: string }) => {
            setState((prev) => ({
                ...prev,
                values: {
                    ...prev.values,
                    lat: address.lat,
                    lng: address.lng,
                    formattedAddress: address.formattedAddress,
                    fullAddress: address.formattedAddress,
                },
            }));
            setStep("FORM");
        },
        [setStep]
    );

    const handleFormSubmit = useCallback(() => {
        // Validate all required fields
        const requiredFields: AddressField[] = [
            "fullName",
            "lat",
            "lng",
            "pinpointAddress",
            "phoneRecepient",
            "zipCode",
            "province",
            "city",
            "subdistrict",
            "labelAddress",
            "fullAddress",
        ];

        let isValid = true;
        requiredFields.forEach((field) => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Validate coordinates
        if (!state.values.lat || !state.values.lng) {
            toast.error("Please select a location on the map");
            isValid = false;
        }

        if (!isValid) return;

        // Submit the form data - different action for create vs update
        const formData = new FormData();
        formData.append("lat", state.values.lat?.toString() || "");
        formData.append("lng", state.values.lng?.toString() || "");
        formData.append("fullAddress", state.values.fullAddress || "");
        formData.append("fullName", state.values.fullName || "");
        formData.append("phoneNumber", state.values.phoneRecepient || "");
        formData.append("zipCode", state.values.zipCode.toString());
        formData.append("labelAddress", state.values.labelAddress || "");
        formData.append("province", state.values.province || "");
        formData.append("city", state.values.city || "");
        formData.append("subdistrict", state.values.subdistrict || "");
        formData.append("notes", state.values.notes || "");
        formData.append("pinpointAddress", state.values.pinpointAddress || "");

        // Add ID if in edit mode
        if (state.isEdit && state.editId) {
            formData.append("id", state.editId);
        }

        const action = state.isEdit
            ? "/api/update-address"
            : "/api/add-address";

        fetcher.submit(formData, {
            method: "POST",
            action,
        });
    }, [state.values, state.isEdit, state.editId, validateField, fetcher]);

    const handleDelete = useCallback((id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        fetcher.submit(formData, {
            method: "POST",
            action: "/api/delete-address",
        });
    }, []);

    const handleSetMainAddress = useCallback((id: string) => {
        const formData = new FormData();
        formData.append("id", id);
        fetcher.submit(formData, {
            method: "POST",
            action: "/api/set-main-address",
        });
    }, []);

    useEffect(() => {
        if (state.loading !== loading) {
            setState((prev) => ({ ...prev, loading }));
        }
    }, [loading]);

    return {
        ...state,
        setStep,
        setValue,
        setError,
        clearErrors,
        validateField,
        handleMapComplete,
        handleFormSubmit,
        setEditData,
        handleDelete,
        reset,
        handleSetMainAddress
    };
};
