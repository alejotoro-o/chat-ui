import React from "react";
import { cn } from "../utilities/ui";

type MessageProps = {
    text?: string;
    files?: { name: string; url: string; type: string }[];
    isMe: boolean;
    timestamp: Date;
    bgColorMe?: string;
    textColorMe?: string;
    bgColorOther?: string;
    textColorOther?: string;
    className?: string;
};

export const Message: React.FC<MessageProps> = ({
    text,
    files = [],
    isMe,
    timestamp,
    bgColorMe,
    bgColorOther,
    textColorMe,
    textColorOther,
    className,
}) => {
    const time = timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className={cn(
                "p-3 m-2 rounded-lg max-w-2/3 shadow-sm",
                isMe ? "justify-self-end" : "justify-self-start",
                isMe ? (bgColorMe || "bg-blue-100") : (bgColorOther || "bg-stone-100"),
                isMe ? (textColorMe || "text-black") : (textColorOther || "text-black"),
                className
            )}
        >
            {/* File attachments */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {files.map((file, idx) => {
                        const isImage = file.type.startsWith("image/");
                        return (
                            <a
                                key={idx}
                                href={file.url}
                                download={file.name} // always allow download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative grid items-center gap-1 border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-pointer"
                                title={file.name}
                            >
                                {isImage ? (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded">
                                        {/* Lucide file-text icon */}
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
                                            className="lucide lucide-file-text-icon lucide-file-text"
                                        >
                                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                                            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                                            <path d="M10 9H8" />
                                            <path d="M16 13H8" />
                                            <path d="M16 17H8" />
                                        </svg>
                                    </div>
                                )}
                                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Text message */}
            {text && <p>{text}</p>}

            {/* Timestamp */}
            <span className="block text-xs opacity-70 mt-1 text-right">{time}</span>
        </div>
    );
};