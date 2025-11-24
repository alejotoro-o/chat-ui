import React, { useRef, useState } from "react";
import { cn } from "../utilities/ui";

type MessageBarProps = {
    onSend: (payload: { text?: string; files?: File[] }) => void;
    placeholder?: string;
    className?: string;
    allowFiles?: boolean;
    classNameAttachIcon?: string;
    classNameSendIcon?: string;
};

export const MessageBar: React.FC<MessageBarProps> = ({
    onSend,
    placeholder,
    className,
    allowFiles = true,
    classNameAttachIcon,
    classNameSendIcon
}) => {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeToContent = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px"; // ~8 lines
        el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
    };

    const resetHeight = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.overflowY = "hidden";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!value.trim() && files.length === 0) return;

        // Single callback with both text + files
        onSend({
            text: value.trim() || undefined,
            files: allowFiles && files.length > 0 ? files : undefined,
        });

        // Reset state
        setValue("");
        if (allowFiles) {
            setFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        requestAnimationFrame(() => resetHeight());
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

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (!allowFiles) return
        const items = e.clipboardData.items;
        const pastedFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) pastedFiles.push(file);
            }
        }
        if (pastedFiles.length > 0) {
            setFiles((prev) => [...prev, ...pastedFiles]);
            e.preventDefault();
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // --- Drag & Drop Handlers ---
    const dragTimeout = useRef<number | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!allowFiles) return;
        e.preventDefault();

        // cancel any pending "leave"
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
            dragTimeout.current = null;
        }

        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!allowFiles) return;
        e.preventDefault();

        // delay turning off
        dragTimeout.current = window.setTimeout(() => {
            setIsDragging(false);
            dragTimeout.current = null;
        }, 100); // tweak delay to taste
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (!allowFiles) return;
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles((prev) => [...prev, ...droppedFiles]);
        }
    };


    return (
        <div
            className={cn(
                "m-2 flex flex-col gap-2 border border-gray-300 rounded-4xl bg-white shadow-sm",
                isDragging && "border-blue-600 rounded-4xl bg-blue-100",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Preview pills */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {files.map((file, idx) => {
                        const isImage = file.type.startsWith("image/");
                        return (
                            <div
                                key={idx}
                                className="relative flex items-center gap-2 border border-gray-400 rounded-lg p-1 bg-gray-100"
                                title={file.name}
                            >
                                {isImage ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
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
                                <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                                {/* Remove File Button */}
                                <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-x-icon lucide-x"

                                    >
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Input bar */}
            <form
                onSubmit={handleSubmit}
                className="p-2 flex flex-row gap-2"
            >
                <input
                    type="file"
                    multiple
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => {
                        if (!allowFiles || !e.target.files) return;
                        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                    }}
                />


                {allowFiles && <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn("aspect-square h-10 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer text-gray-600", classNameAttachIcon)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
                    </svg>
                </button>}

                <textarea
                    ref={textareaRef}
                    placeholder={placeholder || "Message"}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    rows={1}
                    className="p-2 grow resize-none focus:outline-none overflow-y-auto max-h-40"
                />

                {(value || files.length > 0) && (
                    <button
                        type="submit"
                        className={cn("aspect-square h-10 self-end flex items-center justify-center rounded-full bg-black cursor-pointer text-white", classNameSendIcon)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
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
        </div>
    );
};