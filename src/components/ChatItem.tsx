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
    lastMessageStatus?: "sending" | "sent" | "delivered" | "read";
    date: Date;
    onClick: (id: string) => void;
    avatar?: boolean,
    imageUrl?: string;
    unreadCount?: number;
    options?: ChatItemOptions[];
    classNameRead?: string;
    classNameOptions?: string;
    classNameUnreadCount?: string;
    classNameUnreadDate?: string;
    className?: string;
};

export const ChatItem: React.FC<ChatItemProps> = ({
    id,
    name,
    lastMessage,
    lastMessageStatus,
    date,
    onClick,
    avatar,
    imageUrl,
    unreadCount,
    options,
    classNameRead,
    classNameOptions,
    classNameUnreadCount,
    classNameUnreadDate,
    className,
}) => {

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "p-4 flex flex-row gap-4 items-center hover:bg-blue-100 rounded-2xl cursor-pointer",
                className
            )}
            onClick={() => onClick(id)}
        >
            {avatar && (
                <div className="size-14 max-w-14 max-h-14 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center shrink-0 bg-gray-200">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-700">
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
                                className="lucide lucide-user-icon lucide-user size-full object-cover"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                    )}
                </div>
            )}
            <div className="flex flex-col flex-1 min-w-0 basis-0">
                <div className="flex flex-row gap-5 items-center">
                    <span className="font-medium grow whitespace-nowrap truncate">{name}</span>
                    <span className={cn(
                        "opacity-70 whitespace-nowrap",
                        unreadCount && unreadCount > 0 && `text-blue-600 ${classNameUnreadDate}`
                    )}>
                        {formatDate(date)}
                    </span>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    {/* Last Message status if it is from the other participant */}
                    {lastMessageStatus && <div>
                        {lastMessageStatus == 'sending' && <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clock-icon lucide-clock"
                        >
                            <path d="M12 6v6l4 2" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>}
                        {lastMessageStatus == 'sent' && <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check-icon lucide-check"
                        >
                            <path d="M20 6 9 17l-5-5" />
                        </svg>}
                        {lastMessageStatus == 'delivered' && <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check-check-icon lucide-check-check"
                        >
                            <path d="M18 6 7 17l-5-5" />
                            <path d="m22 10-7.5 7.5L13 16" />
                        </svg>}
                        {lastMessageStatus == 'read' && <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(
                                "lucide lucide-check-check-icon lucide-check-check text-blue-600",
                                classNameRead
                            )}
                        >
                            <path d="M18 6 7 17l-5-5" />
                            <path d="m22 10-7.5 7.5L13 16" />
                        </svg>}
                    </div>}
                    {/* Message and options */}
                    <span className="min-w-0 opacity-70 text-sm truncate grow">{lastMessage}</span>
                    <div className="flex flex-row gap-5 items-center ms-4">
                        {unreadCount && unreadCount > 0 && (
                            <div className={cn(
                                "size-7 rounded-full text-white bg-blue-600/70 flex items-center justify-center text-sm font-medium",
                                classNameUnreadCount
                            )}
                            >
                                {unreadCount}
                            </div>
                        )}

                        {options && options.length > 0 && <div className="relative justify-self-end">
                            <button
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={open}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(!open)
                                }}
                                className={cn("p-1 rounded-full hover:bg-blue-200 cursor-pointer", classNameOptions)}
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
            </div>

        </div>
    );
};