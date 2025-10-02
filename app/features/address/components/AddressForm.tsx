import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PhoneInput } from "~/components/ui/phone-input";
import { Textarea } from "~/components/ui/textarea";
import type {
    AddAddressParam,
    AddressField,
} from "../schemas/address-param-schema";
import { MapPin } from "lucide-react";

interface AddressFormProps {
    values: AddAddressParam;
    errors: Partial<Record<AddressField, string>>;
    onChange: (field: AddressField, value: string | number) => void;
    onNextClick: () => void;
    onChangePinpointAddress: () => void;
    loading: boolean;
    isEdit?: boolean; // Add this prop
}

export function AddressForm({
    loading,
    values,
    errors,
    onChange,
    onNextClick,
    onChangePinpointAddress,
    isEdit = false,
}: AddressFormProps) {
    const isFormValid =
        values.fullName &&
        values.phoneRecepient &&
        values.zipCode &&
        values.labelAddress &&
        values.fullAddress &&
        values.pinpointAddress &&
        values.lat &&
        values.lng;

    return (
        <div className="relative p-4 h-full overflow-y-auto">
            <DialogHeader>
                <div className="flex items-center gap-2">
                    <DialogTitle className="flex flex-col items-center mt-2 pb-6">
                        {isEdit
                            ? "Edit Informasi Penerima"
                            : "Lengkapi Informasi Penerima"}
                    </DialogTitle>
                </div>
            </DialogHeader>

            <div className="flex flex-row justify-between rounded-md border border-border-subtle p-2 items-center mb-4">
                <div className="flex flex-row gap-x-2 items-center">
                    <MapPin />
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Alamat berdasarkan titik lokasi
                        </span>
                        <span>{values.pinpointAddress}</span>
                    </div>
                </div>
                <Button onClick={onChangePinpointAddress}>
                    {values.pinpointAddress ? "Ubah" : "Pilih Titik Lokasi"}
                </Button>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                        Nama Lengkap<span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="fullName"
                        placeholder="Masukkan nama lengkap penerima"
                        value={values.fullName || ""}
                        onChange={(e) => onChange("fullName", e.target.value)}
                        className={errors.fullName ? "border-destructive" : ""}
                        disabled={loading}
                    />
                    {errors.fullName && (
                        <p className="text-sm text-destructive">
                            {errors.fullName}
                        </p>
                    )}
                </div>

                <div className="w-full space-y-2">
                    <label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium"
                    >
                        Nomor HP<span className="text-destructive">*</span>
                    </label>
                    <PhoneInput
                        international={true}
                        defaultCountry="ID"
                        id="phoneNumber"
                        placeholder="8xxxxxxxxxx"
                        value={values.phoneRecepient || ""}
                        onChange={(value) =>
                            onChange("phoneRecepient", value || "")
                        }
                        className={
                            errors.phoneRecepient ? "border-destructive" : ""
                        }
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="zipCode" className="text-sm font-medium">
                        Kode Pos<span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="zipCode"
                        placeholder="Masukkan kode pos penerima"
                        value={values.zipCode || ""}
                        type="number"
                        onChange={(e) =>
                            onChange("zipCode", parseInt(e.target.value))
                        }
                        className={errors.zipCode ? "border-destructive" : ""}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="labelAddress"
                        className="text-sm font-medium"
                    >
                        Label Alamat<span className="text-destructive">*</span>
                    </label>
                    <Input
                        id="labelAddress"
                        placeholder="Kantor, Rumah, Sekolah, Kos, etc."
                        value={values.labelAddress || ""}
                        onChange={(e) =>
                            onChange("labelAddress", e.target.value)
                        }
                        className={
                            errors.labelAddress ? "border-destructive" : ""
                        }
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="fullAddress"
                        className="text-sm font-medium"
                    >
                        Alamat Lengkap
                        <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                        id="fullAddress"
                        placeholder="Masukkan alamat lengkap penerima"
                        value={values.fullAddress || ""}
                        onChange={(e) =>
                            onChange("fullAddress", e.target.value)
                        }
                        className={
                            errors.fullAddress ? "border-destructive" : ""
                        }
                        disabled={loading}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                        Catatan untuk kurir
                    </label>
                    <Textarea
                        id="notes"
                        placeholder="Masukkan catatan untuk kurir"
                        value={values.notes || ""}
                        onChange={(e) => onChange("notes", e.target.value)}
                        className={errors.notes ? "border-destructive" : ""}
                        disabled={loading}
                        rows={2}
                    />
                </div>

                <Button
                    disabled={!isFormValid || loading}
                    className="w-full mt-4"
                    size={"lg"}
                    onClick={onNextClick}
                >
                    {loading
                        ? isEdit
                            ? "Memperbarui..."
                            : "Menambahkan..."
                        : isEdit
                          ? "Perbarui Alamat"
                          : "Tambahkan Alamat"}
                </Button>
            </div>
        </div>
    );
}
