import React, { useRef, useState } from "react";
import { cn } from "../utilities/ui";

type MessageBarProps = {
    onSend: (payload: { text?: string; files?: File[] }) => void;
    placeholder?: string;
    className?: string;
    allowFiles?: boolean;
    allowedFiles?: string,
    maxFiles?: number,
    maxFileSize?: number,
    errorMessage?: {
        invalidType?: string,
        maxFiles?: string,
        maxSize?: string,
    },
    classNameAttachIcon?: string;
    classNameSendIcon?: string;
};

export const MessageBar: React.FC<MessageBarProps> = ({
    onSend,
    placeholder,
    className,
    allowFiles = true,
    allowedFiles,
    maxFiles,
    maxFileSize,
    errorMessage,
    classNameAttachIcon,
    classNameSendIcon
}) => {
    const [value, setValue] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null); // State for transient errors

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dragTimeout = useRef<number | null>(null);
    const errorTimeoutRef = useRef<number | null>(null); // Ref for error timeout ID

    /**
     * Helper to show a transient notification and automatically clear it.
     * This uses manual setTimeout management with a useRef to mimic useEffect cleanup.
     */
    const showNotification = (message: string) => {
        // 1. Clear any previous running timeout
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = null;
        }

        // 2. Set the new error message
        setLocalError(message);

        // 3. Set new timeout and store its ID
        const timeoutId = window.setTimeout(() => {
            setLocalError(null);
            errorTimeoutRef.current = null;
        }, 3000);

        errorTimeoutRef.current = timeoutId;
    };


    const validateAndAddFiles = (incomingFiles: File[]): File[] => {
        if (!allowFiles) return [];

        const currentTotal = files.length;
        const potentialNewTotal = currentTotal + incomingFiles.length;

        // --- 1. Check max file count ---
        if (maxFiles && maxFiles > 0 && potentialNewTotal > maxFiles) {
            const message = errorMessage?.maxFiles || `File limit exceeded. You can only attach a maximum of ${maxFiles} files.`;
            showNotification(message);
            // Only return files up to the limit if the current set allows it
            return incomingFiles.slice(0, maxFiles - currentTotal);
        }

        // --- 2. Setup size and type validation parameters ---
        const maxBytes = maxFileSize ? maxFileSize * 1024 * 1024 : Infinity; // Convert MB to bytes
        const allowedTypes = allowedFiles ? allowedFiles.split(',').map(t => t.trim().toLowerCase()) : null;

        const validFiles: File[] = [];
        let hadInvalidType = false;
        let hadInvalidSize = false;

        // Loop through incoming files for individual validation
        incomingFiles.forEach(file => {
            // --- A. Check file size ---
            if (file.size > maxBytes) {
                // If it fails size check, mark flag and skip to the next file
                hadInvalidSize = true;
                return;
            }

            // --- B. Check file types and extensions ---
            let isTypeValid = true;
            if (allowedTypes) {
                const fileType = file.type.toLowerCase();
                const fileName = file.name.toLowerCase();
                // Get file extension including the dot, e.g., ".pdf"
                const fileExtension = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';

                isTypeValid = allowedTypes.some(type => {
                    if (type.startsWith('.')) {
                        // Case A: File extension check (e.g., .pdf)
                        return fileExtension === type;
                    } else if (type.endsWith('/*')) {
                        // Case B: MIME glob pattern check (e.g., image/*)
                        const prefix = type.slice(0, -2);
                        return fileType.startsWith(prefix);
                    } else {
                        // Case C: Exact MIME type check (e.g., application/pdf)
                        return fileType === type;
                    }
                });

                if (!isTypeValid) {
                    hadInvalidType = true;
                    return; // Skip this file
                }
            }

            // If it passed both size and type validation
            validFiles.push(file);
        });

        // --- 3. Show notifications for individual file errors ---
        // Note: We prioritize showing the size error if both size and type errors occurred 
        // across the batch, as size is often the more critical failure.
        if (hadInvalidSize) {
            const message = errorMessage?.maxSize || `One or more files exceed the maximum size of ${maxFileSize} MB.`;
            showNotification(message);
        } else if (hadInvalidType) {
            const message = errorMessage?.invalidType || `One or more files have invalid types. Allowed types: ${allowedFiles || 'all'}.`;
            showNotification(message);
        }

        return validFiles;
    };


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
            const validatedFiles = validateAndAddFiles(pastedFiles);
            if (validatedFiles.length > 0) {
                setFiles((prev) => [...prev, ...validatedFiles]);
                e.preventDefault(); // Prevent default text paste if files were processed
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!allowFiles || !e.target.files) return;

        const newFiles = Array.from(e.target.files!);
        const validatedFiles = validateAndAddFiles(newFiles);

        if (validatedFiles.length > 0) {
            setFiles((prev) => [...prev, ...validatedFiles]);
        }
        // It's important to reset the input value so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // --- Drag & Drop Handlers ---

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!allowFiles) return;
        e.preventDefault();
        e.stopPropagation();

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
            const validatedFiles = validateAndAddFiles(droppedFiles);
            if (validatedFiles.length > 0) {
                setFiles((prev) => [...prev, ...validatedFiles]);
            }
        }
    };


    return (
        <div
            className={cn(
                "m-2 flex flex-col gap-2 border border-gray-300 rounded-4xl bg-white shadow-lg transition-all duration-150 ease-in-out",
                isDragging && "border-blue-500 ring-4 ring-blue-100 bg-blue-50",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Notification Bar */}
            {localError && (
                <div className="mx-4 mt-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl shadow-inner animate-in fade-in slide-in-from-top-4 transition-all duration-300 ease-in-out">
                    {localError}
                </div>
            )}

            {/* Preview pills */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mx-4 mt-4 pb-2 border-b border-gray-200">
                    {files.map((file, idx) => {
                        const isImage = file.type.startsWith("image/");
                        return (
                            <div
                                key={idx}
                                className="relative flex items-center gap-2 border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 shadow-sm"
                                title={file.name}
                            >
                                {isImage ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-10 h-10 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-file-text-icon text-gray-600"
                                        >
                                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                                            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                                            <path d="M10 9H8" />
                                            <path d="M16 13H8" />
                                            <path d="M16 17H8" />
                                        </svg>
                                    </div>
                                )}
                                <span className="text-sm truncate max-w-[120px] text-gray-700">{file.name}</span>
                                {/* Remove File Button */}
                                <button
                                    type="button"
                                    onClick={() => removeFile(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer shadow-md transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-x-icon"

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
                className="p-3 flex flex-row gap-3 items-end"
            >
                <input
                    type="file"
                    multiple
                    accept={allowedFiles}
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={maxFiles !== undefined && files.length >= maxFiles}
                />


                {allowFiles && <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "aspect-square h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer",
                        classNameAttachIcon,
                        maxFiles !== undefined && files.length >= maxFiles ? "bg-gray-100 opacity-60" : ""
                    )}
                    title="Attach Files"
                    disabled={maxFiles !== undefined && files.length >= maxFiles}
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
                    className="p-2 grow resize-none focus:outline-none overflow-y-auto max-h-40 text-gray-800 bg-transparent"
                />

                {(value || files.length > 0) && (
                    <button
                        type="submit"
                        className={cn("aspect-square h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer text-white shadow-md", classNameSendIcon)}
                        title="Send Message"
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