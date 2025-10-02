import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AddressDialog } from "../components/AddressDialog";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { type AddressResponse } from "../schemas/address-response.schema";
import { type AddAddressParam } from "../schemas/address-param-schema";
import { useState } from "react";
import { useAddressDialog } from "../hooks/useAddress";
import { LoadingOverlay } from "~/components/ui/loading";
export default function UserAddressPage({
    userAddress,
}: {
    userAddress: AddressResponse[];
}) {
    const { setOpenAddressDialog } = useDialogStore();
    const [selectedAddress, setSelectedAddress] = useState<
        AddAddressParam & { id?: string }
    >();
    const { handleDelete, loading, handleSetMainAddress } = useAddressDialog();
    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen">
            <AddressDialog editData={selectedAddress} />
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Alamat</h1>
                <Button
                    className="rounded-full"
                    onClick={() => {
                        setSelectedAddress({
                            city: "",
                            fullAddress: "",
                            fullName: "",
                            labelAddress: "",
                            lat: 0,
                            lng: 0,
                            phoneRecepient: "",
                            pinpointAddress: "",
                            province: "",
                            subdistrict: "",
                            zipCode: 0,
                            notes: "",
                        });
                        setOpenAddressDialog(true);
                    }}
                >
                    Buat alamat baru
                </Button>
            </div>

            {userAddress.map((address, key) => {
                return (
                    <Card key={key} className="shadow-sm mb-4">
                        <CardContent>
                            {/* Name, phone, address */}
                            {address.main_address && (
                                <div className="text-xs rounded-full bg-primary text-white px-2 py-1 w-fit mb-3">
                                    Alamat Utama
                                </div>
                            )}
                            <div className="space-y-2">
                                <p className="font-semibold">
                                    {address.recipient_name}
                                    <span className="ml-2 text-gray-500 text-sm">
                                        {address.recipient_phone}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    {address.complete_address}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {address.subdistrict} - {address.city} -{" "}
                                    {address.province} - {address.zip_code}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-gray-500"
                                    onClick={() => {
                                        setSelectedAddress({
                                            id: address.id?.toString(),
                                            city: address.city,
                                            fullAddress:
                                                address.complete_address,
                                            fullName: address.recipient_name,
                                            labelAddress: address.label_address,
                                            lat: address.pinpoint_latitude,
                                            lng: address.pinpoint_longitude,
                                            phoneRecepient:
                                                address.recipient_phone,
                                            pinpointAddress:
                                                address.pinpoint_address,
                                            province: address.province,
                                            subdistrict: address.subdistrict,
                                            zipCode: parseInt(address.zip_code),
                                            notes: address.note_for_courier,
                                        });
                                        setOpenAddressDialog(true);
                                    }}
                                >
                                    Ubah
                                </Button>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-red-500"
                                    onClick={() =>
                                        handleDelete(address.id.toString())
                                    }
                                >
                                    Hapus
                                </Button>
                                <Button
                                    disabled={address.main_address}
                                    variant="link"
                                    className="p-0 h-auto text-blue-500"
                                    onClick={() =>
                                        handleSetMainAddress(
                                            address.id.toString()
                                        )
                                    }
                                >
                                    Jadikan alamat utama
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            {userAddress.length === 0 && <>Kamu belum memiliki alamat, silahkan buat alamat baru</>}
            <LoadingOverlay show={loading} />
        </div>
    );
}
