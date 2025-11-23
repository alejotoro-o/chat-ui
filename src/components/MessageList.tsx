import type React from "react";
import { cn } from "../utilities/ui";

type MessageListProps = {
    children: React.ReactNode
    className?: string
}

export const MessageList: React.FC<MessageListProps> = ({ children, className }) => {
    return (
        <div className={cn("grid bg-neutral-50", className)}>
            {children}
        </div>
    )
}