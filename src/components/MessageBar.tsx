import React, { useRef, useState } from "react";
import { cn } from "../utilities/ui";

type MessageBarProps = {
    onSubmit: (message: string) => void;
    placeholder?: string;
    className?: string;
};

export const MessageBar: React.FC<MessageBarProps> = ({
    onSubmit,
    placeholder,
    className,
}) => {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeToContent = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px"; // ~8 lines
    };

    const resetHeight = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.overflowY = "hidden";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
        setValue("");
        // Reset height after value clears; use RAF so DOM has updated
        requestAnimationFrame(() => {
            resetHeight();
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        resizeToContent();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("m-2 p-2 flex flex-row gap-2 border rounded-4xl bg-white", className)}
        >
            <textarea
                ref={textareaRef}
                placeholder={placeholder || "Message"}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                rows={1}
                className="p-2 grow resize-none focus:outline-none overflow-y-auto max-h-40"
            />
            {value && (
                <button
                    type="submit"
                    className="aspect-square h-10 self-end flex items-center justify-center rounded-full bg-black cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                        <path d="M6 12h16" />
                    </svg>
                </button>
            )}
        </form>
    );
};