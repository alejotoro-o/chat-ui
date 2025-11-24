import type React from "react";
import { cn } from "../utilities/ui";
import { formatDate } from "../utilities/formatDate";
import { useState } from "react";

type ChatItemOptions = {
    label: string;
    onClick: () => void;
    destructive?: boolean; // optional flag for styling (e.g. red text for delete)
};

type ChatItemProps = {
    id: string;
    name: string;
    lastMessage: string;
    date: Date;
    onClick: (id: string) => void;
    imageUrl?: string;
    className?: string;
    options?: ChatItemOptions[]
};

export const ChatItem: React.FC<ChatItemProps> = ({
    id,
    name,
    lastMessage,
    date,
    onClick,
    imageUrl,
    className,
    options
}) => {

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "p-4 flex flex-row gap-5 items-start hover:bg-gray-100 rounded-2xl cursor-pointer",
                className
            )}
            onClick={() => onClick(id)}
        >
            {imageUrl && (
                <div className="aspect-square h-full rounded-full overflow-hidden border border-gray-300">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="grid grow">
                <span className="font-medium">{name}</span>
                <span className="opacity-70 text-sm truncate">{lastMessage}</span>
            </div>
            <div className="grid justify-items-end">
                <span className="opacity-70 whitespace-nowrap">{formatDate(date)}</span>
                {options && options.length > 0 && <div className="relative justify-self-end">
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(!open)
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 cursor-pointer"
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
                            className="lucide lucide-ellipsis-icon lucide-ellipsis"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-10">
                            {options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        opt.onClick()
                                        setOpen(false)
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
        </div>
    );
};