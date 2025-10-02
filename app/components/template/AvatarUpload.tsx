import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Plus, User, X } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
    onAvatarChange: (avatarUrl: string) => void;
    maxSize?: number;
    initialAvatar?: string;
    disabled?: boolean;
}

export default function AvatarUpload({
    onAvatarChange,
    maxSize = 10 * 1024 * 1024, // Default 10MB
    initialAvatar,
    disabled = false,
}: AvatarUploadProps) {
    const [image, setImage] = useState<string | null>(initialAvatar || null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImage(null);
        onAvatarChange(""); // Clear the avatar URL
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSize) {
            toast.error(`Ukuran file maksimal ${maxSize / 1024 / 1024}MB`);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setIsLoading(true);

        try {
            // Convert image to base64 for immediate preview
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataUrl = reader.result as string;
                setImage(imageDataUrl);
                onAvatarChange(imageDataUrl); // Pass base64 data URL to parent
                setIsLoading(false);
            };
            reader.onerror = () => {
                toast.error("Gagal membaca file gambar");
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengupload gambar");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <Avatar
                className={`w-20 h-20 ${!disabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={handleClick}
            >
                <AvatarImage src={image ?? ""} />
                <AvatarFallback>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    ) : (
                        <User className="w-8 h-8" />
                    )}
                </AvatarFallback>
            </Avatar>

            {/* Plus icon overlay - only show if not disabled and no image */}
            {!disabled && !image && (
                <div
                    onClick={handleClick}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white shadow cursor-pointer hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" />
                </div>
            )}

            {/* Remove icon overlay - show when image exists and not disabled */}
            {!disabled && image && (
                <div
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-white shadow cursor-pointer hover:bg-destructive/90"
                >
                    <X className="w-3 h-3" />
                </div>
            )}

            {/* Change icon overlay - show when image exists and not disabled */}
            {!disabled && image && (
                <div
                    onClick={handleClick}
                    className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white shadow cursor-pointer hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" />
                </div>
            )}

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                disabled={disabled || isLoading}
            />

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}
        </div>
    );
}
