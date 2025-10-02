import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Combobox } from "~/components/ui/combobox";
import AvatarUpload from "~/components/template/AvatarUpload";
import { useState, useEffect } from "react";
import { getCities, getProvinces } from "~/shared/services/geography-service";
import type { GeographyResponse } from "~/shared/schemas/geography-response-schema";

// Gender type definition
type Gender = "Laki-laki" | "Perempuan" | "";

interface Province {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

function GenderSelector({
    text,
    value,
    isActive,
    onClick,
}: {
    text: string;
    value: Gender;
    isActive: boolean;
    onClick: (value: Gender) => void;
}) {
    const activeStyle =
        "cursor-pointer text-center text-sm rounded-md py-2 bg-primary text-white hover:bg-primary/90";
    const defaultStyle =
        "cursor-pointer text-center text-sm rounded-md py-2 border hover:bg-black/10";

    let style = defaultStyle;
    if (isActive) style = activeStyle;

    return (
        <div className={style} onClick={() => onClick(value)}>
            {text}
        </div>
    );
}

export function RegisterStepPersonalInfo({
    loading,
    values,
    errors,
    onChange,
    onNextClick,
    onBackClick,
}: {
    values: {
        fullName?: string;
        gender?: string;
        province?: string;
        city?: string;
        pin?: string;
        avatarUrl?: string;
    };
    errors: {
        fullName?: string;
        gender?: string;
        province?: string;
        city?: string;
        pin?: string;
        avatarUrl?: string;
    };
    onChange: (field: string, value: string) => void;
    onNextClick: () => void;
    onBackClick: () => void;
    loading: boolean;
}) {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Check if all required fields are filled and valid
    const isFormValid =
        values.fullName &&
        values.gender &&
        values.province &&
        values.city &&
        values.pin &&
        values.pin.length === 6;

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getProvinces();
                setProvinces(
                    response?.data?.data?.map((p: GeographyResponse) => ({
                        id: p?.id?.toString() ?? "",
                        name: p.name ?? "",
                    })) || []
                );
            } catch (error) {
                console.error("Failed to fetch provinces:", error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (!values.province) {
                setCities([]);
                return;
            }

            setLoadingCities(true);
            try {
                const response = await getCities(values.province);
                setCities(
                    response?.data?.data?.map((p: GeographyResponse) => ({
                        id: p?.id?.toString() ?? "",
                        name: p.name ?? "",
                    })) || []
                );
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, [values.province]);

    const handleAvatarChange = (avatarUrl: string) => {
        onChange("avatarUrl", avatarUrl);
    };

    const handleGenderSelect = (gender: Gender) => {
        onChange("gender", gender);
    };

    const handleProvinceSelect = (provinceId: string) => {
        onChange("province", provinceId);
        // Clear city when province changes
        onChange("city", "");
    };

    const handleCitySelect = (cityId: string) => {
        onChange("city", cityId);
    };

    const handlePinChange = (pin: string) => {
        onChange("pin", pin);
    };

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange("fullName", e.target.value);
    };

    return (
        <div className="relative p-4">
            <ArrowLeft
                size={16}
                className="cursor-pointer"
                onClick={loading ? undefined : onBackClick}
            />
            <DialogHeader>
                <DialogTitle className="flex flex-col items-center mt-2 pb-6">
                    Lengkapi Informasi Pribadi
                </DialogTitle>
            </DialogHeader>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-4">
                <AvatarUpload
                    onAvatarChange={handleAvatarChange}
                    maxSize={10 * 1024 * 1024}
                    initialAvatar={values.avatarUrl}
                    disabled={loading}
                />
            </div>

            {/* Full Name */}
            <div className="space-y-2 mb-4">
                <label htmlFor="fullName" className="text-sm font-medium">
                    Nama Lengkap<span className="text-destructive">*</span>
                </label>
                <Input
                    id="fullName"
                    placeholder="Masukkan nama lengkap kamu"
                    value={values.fullName || ""}
                    onChange={handleFullNameChange}
                    className={errors.fullName ? "border-destructive" : ""}
                    disabled={loading}
                />
            </div>

            {/* Gender Selection */}
            <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">
                    Jenis Kelamin<span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-x-2">
                    <GenderSelector
                        text="Laki-Laki"
                        value="Laki-laki"
                        isActive={values.gender === "Laki-laki"}
                        onClick={handleGenderSelect}
                    />
                    <GenderSelector
                        text="Perempuan"
                        value="Perempuan"
                        isActive={values.gender === "Perempuan"}
                        onClick={handleGenderSelect}
                    />
                </div>
            </div>

            {/* Province Selection */}
            <div className="space-y-2 flex flex-col mb-4">
                <label className="text-sm font-medium">
                    Provinsi<span className="text-destructive">*</span>
                </label>
                <Combobox
                    emptySearchText="Tidak ada hasil pencarian"
                    searchText="Cari Provinsi"
                    selectText="Pilih Provinsi"
                    listData={provinces.map((province) => ({
                        value: province.id,
                        label: province.name,
                    }))}
                    value={values.province || ""}
                    onValueChange={handleProvinceSelect}
                    disabled={loading}
                    // className={errors.province ? "border-destructive" : ""}
                />
            </div>

            {/* City Selection */}
            <div className="space-y-2 flex flex-col mb-4">
                <label className="text-sm font-medium">
                    Kota<span className="text-destructive">*</span>
                </label>
                <Combobox
                    emptySearchText="Tidak ada hasil pencarian"
                    searchText="Cari Kota"
                    selectText={
                        values.province
                            ? "Pilih Kota"
                            : "Pilih provinsi terlebih dahulu"
                    }
                    listData={cities.map((city) => ({
                        value: city.id,
                        label: city.name,
                    }))}
                    value={values.city || ""}
                    onValueChange={handleCitySelect}
                    disabled={!values.province || loadingCities || loading}
                    // className={errors.city ? "border-destructive" : ""}
                />
            </div>

            {/* PIN Password */}
            <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">
                    Pin Password (6 digit)
                    <span className="text-destructive">*</span>
                </label>
                <InputOTP
                    maxLength={6}
                    value={values.pin || ""}
                    onChange={handlePinChange}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={loading}
                    className={
                        errors.pin ? "border-destructive rounded-md" : ""
                    }
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button
                disabled={!isFormValid || loading}
                className="w-full mt-2"
                size={"lg"}
                onClick={onNextClick}
            >
                Selanjutnya
            </Button>
        </div>
    );
}
