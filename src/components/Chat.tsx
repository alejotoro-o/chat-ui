import type React from "react";
import { cn } from "../utilities/ui";

type ChatProps = {
    children: React.ReactNode
    className?: string
}

export const Chat: React.FC<ChatProps> = ({ children, className }) => {
    return (
        <div className={cn("pb-1 bg-slate-100 max-h-dvh grid", className)}>
            {children}
        </div>
    )
}