import React from "react"
import { cn } from "../utilities/ui"

type MessageProps = {
    text: string
    isMe: boolean
    timestamp: Date
    bgColorMe?: string
    textColorMe?: string
    bgColorOther?: string
    textColorOther?: string
    className?: string
}

export const Message: React.FC<MessageProps> = ({
    text,
    isMe,
    timestamp,
    bgColorMe,
    bgColorOther,
    textColorMe,
    textColorOther,
    className
}) => {

    const time = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

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
            <p>{text}</p>
            <span className="block text-xs opacity-70 mt-1 text-right">{time}</span>
        </div>
    )
}