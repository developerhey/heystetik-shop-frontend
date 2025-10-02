import { cn } from "~/lib/utils";

interface IconWrapperProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    badgeCount?: number;
    className?: string;
}

const IconWrapper = ({
    children,
    onClick,
    badgeCount = 0,
    className,
}: IconWrapperProps) => (
    <div
        className={cn(
            "relative p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition flex",
            className
        )}
        onClick={onClick}
    >
        {children}
        {badgeCount > 0 && (
            <span className="z-[50] absolute top-1 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {badgeCount > 99 ? "99+" : badgeCount}
            </span>
        )}
    </div>
);

export default IconWrapper;
