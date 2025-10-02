import { Dialog, DialogContent } from "~/components/ui/dialog";
import { LoadingOverlay } from "~/components/ui/loading";
import { InputMap, type Address } from "./input-map";
import { AddressForm } from "./AddressForm";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { useAddressDialog } from "../hooks/useAddress";
import { useEffect } from "react";
import { type AddAddressParam } from "../schemas/address-param-schema";

interface AddressDialogProps {
    editData?: AddAddressParam & { id?: string }; // Optional edit data
}

export function AddressDialog({ editData }: AddressDialogProps) {
    const {
        step,
        values,
        errors,
        loading,
        setStep,
        setValue,
        handleFormSubmit,
        setEditData,
        reset,
        isEdit,
    } = useAddressDialog();

    const { isOpenAddressDialog, setOpenAddressDialog } = useDialogStore();

    // Effect to handle edit data when dialog opens
    useEffect(() => {
        if (isOpenAddressDialog && editData) {
            setEditData(editData);
        } else if (!isOpenAddressDialog) {
            // Reset when dialog closes
            reset();
        }
    }, [isOpenAddressDialog, editData, setEditData, reset]);

    return (
        <Dialog open={isOpenAddressDialog} onOpenChange={setOpenAddressDialog}>
            <DialogContent
                className="sm:max-w-4xl sm:h-[500px] rounded-md p-0 overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                {step == "MAP" && (
                    <InputMap
                        onAddressSelect={(value: Address) => {
                            setValue("lat", value.lat);
                            setValue("lng", value.lng);
                            setValue("pinpointAddress", value.formattedAddress);
                            setValue("city", value.city ?? "");
                            setValue("province", value.province ?? "");
                            setValue("subdistrict", value.subdistrict ?? "");
                            setStep("FORM");
                        }}
                        defaultToCurrentLocation={!isEdit}
                        defaultLocation={
                            isEdit
                                ? {
                                      lat: values.lat,
                                      lng: values.lng,
                                      formattedAddress: values.pinpointAddress,
                                      city: values.city,
                                      province: values.province,
                                      subdistrict: values.subdistrict,
                                  }
                                : undefined
                        }
                    />
                )}
                {step == "FORM" && (
                    <AddressForm
                        values={values}
                        errors={errors}
                        loading={loading}
                        onChange={setValue}
                        onNextClick={handleFormSubmit}
                        onChangePinpointAddress={() => setStep("MAP")}
                        isEdit={isEdit} // Pass edit mode to form
                    />
                )}
                <LoadingOverlay show={false} />
            </DialogContent>
        </Dialog>
    );
}
