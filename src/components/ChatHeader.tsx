import React, { useState } from "react";
import { cn } from "../utilities/ui";

type ChatHeaderOption = {
    label: string;
    onClick: () => void;
    destructive?: boolean; // optional flag for styling (e.g. red text for delete)
};


type ChatHeaderProps = {
    name: string;
    profileLink?: string;
    imageUrl?: string;
    imageAlt?: string;
    status?: string;
    className?: string;
    options?: ChatHeaderOption[]
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    profileLink,
    imageUrl,
    imageAlt,
    status,
    className,
    options
}) => {
    const [open, setOpen] = useState(false);

    const avatarBlock = (
        <div className="flex flex-row gap-5 items-center h-20 py-4">
            {imageUrl && (
                <div className="aspect-square h-full rounded-full overflow-hidden border border-gray-300">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="grid">
                <span className="font-medium">{name}</span>
                {status && <span className="opacity-70 text-sm">{status}</span>}
            </div>
        </div>
    );


    return (
        <div
            className={cn(
                "p-4 bg-white border border-gray-200 flex flex-row justify-between items-center shadow-sm h-20",
                className
            )}
        >
            {/* Left side: avatar + name */}
            {profileLink ? (
                <a href={profileLink} className="grow flex flex-row gap-5 items-center h-20 py-4">
                    {avatarBlock}
                </a>
            ) : (
                avatarBlock
            )}


            {/* Right side: options dropdown */}
            {options && options.length > 0 && <div className="relative justify-self-end">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-10">
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    opt.onClick();
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer",
                                    opt.destructive && "text-red-600"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
};