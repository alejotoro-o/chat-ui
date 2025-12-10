import type React from "react"
import { cn } from "../utilities/ui"

type ChatListProps = {
    children: React.ReactNode
    className?: string
}

export const ChatList: React.FC<ChatListProps> = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col gap-2 basis-0 min-w-0", className)}>
            {children}
        </div>
    )
}