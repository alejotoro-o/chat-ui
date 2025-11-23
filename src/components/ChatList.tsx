import type React from "react"
import { cn } from "../utilities/ui"

type ChatListProps = {
    className?: string
}

export const ChatList: React.FC<ChatListProps> = ({ className }) => {
    return (
        <div className={cn("", className)}>

        </div>
    )
}