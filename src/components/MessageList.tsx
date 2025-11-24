import React, { useRef, useState, Children, useEffect } from "react";
import { cn } from "../utilities/ui";

type MessageListProps = {
    children: React.ReactNode;
    className?: string;
    classNameScrollButton?: string;
};

export const MessageList: React.FC<MessageListProps> = ({
    children,
    className,
    classNameScrollButton
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const isAtBottomRef = useRef(true);
    const messageCount = Children.count(children); // Used as a reliable dependency

    // 1. HANDLE USER SCROLL EVENTS
    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // Tolerance: allows the user to be a few pixels off the bottom and still considered "at bottom"
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

        isAtBottomRef.current = isAtBottom;

        // Update UI state for the button visibility
        if (!isAtBottom && !showScrollButton) {
            setShowScrollButton(true);
        } else if (isAtBottom && showScrollButton) {
            setShowScrollButton(false);
        }
    };

    // 2. CONDITIONAL AUTO-SCROLL (New Messages)
    useEffect(() => {
        // Only auto-scroll if the user WAS already at the bottom before this new message was rendered
        if (isAtBottomRef.current && scrollRef.current) {
            // Smooth Scroll applied here
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messageCount]); // Dependency on message count

    // --- 3. MANUAL SCROLL-TO-BOTTOM ACTION ---
    const scrollToBottom = () => {
        if (scrollRef.current) {
            // Smooth Scroll applied here
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative flex-1 overflow-hidden">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={cn("grid overflow-y-auto h-full content-start", className)}
            >
                {children}
            </div>

            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className={cn("absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 animate-in fade-in zoom-in cursor-pointer", classNameScrollButton)}
                    aria-label="Scroll to bottom"
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
                        className="lucide lucide-arrow-down-icon lucide-arrow-down"
                    >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                    </svg>
                </button>
            )}
        </div>
    );
};